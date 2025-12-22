"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Edit2,
  Star,
  Eye,
  X,
  Save,
  Plus,
} from "lucide-react";
import useStore from "@/store/store";
import { toast } from "react-toastify";
import Image from "next/image";
import { Select } from "@/components/ui/Select";
import { getInputClasses } from "@/utils/colorUtils";

interface GalleryImage {
  id: string;
  filename: string;
  original_filename: string;
  file_url: string;
  title?: string;
  description?: string;
  file_size: number;
  mime_type: string;
  width?: number;
  height?: number;
  is_featured: boolean;
  display_order: number;
  category: string;
  uploaded_at: string;
  updated_at: string;
}

interface ImageUpload {
  file: File;
  title: string;
  description: string;
  category: string;
  preview: string;
}

const GalleryManager: React.FC = () => {
  const { isDarkMode } = useStore();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [pendingUploads, setPendingUploads] = useState<ImageUpload[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "general",
    "projects",
    "personal",
    "artwork",
    "photography",
  ];

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      const { getSupabase } = await import("@/lib/supabase");
      const {
        data: { session },
      } = await getSupabase().auth.getSession();

      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch("/api/gallery", { headers });
      if (response.ok) {
        const data = await response.json();
        setGalleryImages(data);
      } else {
        console.error("Failed to fetch gallery images");
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newUploads: ImageUpload[] = [];

    Array.from(files).forEach((file) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file`);
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 10MB)`);
        return;
      }

      const preview = URL.createObjectURL(file);
      newUploads.push({
        file,
        title: "",
        description: "",
        category: "general",
        preview,
      });
    });

    setPendingUploads((prev) => [...prev, ...newUploads]);
    event.target.value = ""; // Reset input
  };

  const updatePendingUpload = (
    index: number,
    field: keyof ImageUpload,
    value: string
  ) => {
    setPendingUploads((prev) =>
      prev.map((upload, i) =>
        i === index ? { ...upload, [field]: value } : upload
      )
    );
  };

  const removePendingUpload = (index: number) => {
    setPendingUploads((prev) => {
      const upload = prev[index];
      URL.revokeObjectURL(upload.preview); // Clean up preview URL
      return prev.filter((_, i) => i !== index);
    });
  };

  const uploadImages = async () => {
    if (pendingUploads.length === 0) return;

    setUploading(true);

    try {
      const { getSupabase } = await import("@/lib/supabase");
      const {
        data: { session },
      } = await getSupabase().auth.getSession();

      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      for (const upload of pendingUploads) {
        const formData = new FormData();
        formData.append("file", upload.file);
        formData.append("title", upload.title);
        formData.append("description", upload.description);
        formData.append("category", upload.category);

        const response = await fetch("/api/gallery/upload", {
          method: "POST",
          headers,
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          toast.error(`Failed to upload ${upload.file.name}: ${error.message}`);
          continue;
        }

        const newImage = await response.json();
        setGalleryImages((prev) => [newImage, ...prev]);
        URL.revokeObjectURL(upload.preview); // Clean up preview URL
      }

      setPendingUploads([]);
      toast.success(`Successfully uploaded ${pendingUploads.length} image(s)!`);
    } catch (error) {
      console.error("Error uploading images:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateImage = async (
    imageId: string,
    updates: Partial<GalleryImage>
  ) => {
    try {
      const { getSupabase } = await import("@/lib/supabase");
      const {
        data: { session },
      } = await getSupabase().auth.getSession();

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`/api/gallery/${imageId}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedImage = await response.json();
        setGalleryImages((prev) =>
          prev.map((img) => (img.id === imageId ? updatedImage : img))
        );
        setEditingImage(null);
        toast.success("Image updated successfully!");
      } else {
        toast.error("Failed to update image");
      }
    } catch (error) {
      console.error("Error updating image:", error);
      toast.error("Failed to update image");
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const { getSupabase } = await import("@/lib/supabase");
      const {
        data: { session },
      } = await getSupabase().auth.getSession();

      const headers: HeadersInit = {};
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`/api/gallery/${imageId}`, {
        method: "DELETE",
        headers,
      });

      if (response.ok) {
        setGalleryImages((prev) => prev.filter((img) => img.id !== imageId));
        toast.success("Image deleted successfully!");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

  const filteredImages = galleryImages.filter(
    (img) => selectedCategory === "all" || img.category === selectedCategory
  );

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-xl">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 shadow-lg`}
      >
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ImageIcon className="w-6 h-6" />
          Gallery Management
        </h2>

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
            id="gallery-upload"
          />
          <label
            htmlFor="gallery-upload"
            className={`cursor-pointer flex flex-col items-center gap-4 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium">Upload Gallery Images</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select multiple images (JPG, PNG, WebP, max 10MB each)
              </p>
            </div>
          </label>
        </div>

        {/* Pending Uploads */}
        {pendingUploads.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold">
              Pending Uploads ({pendingUploads.length})
            </h3>
            <div className="grid gap-4">
              {pendingUploads.map((upload, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    isDarkMode
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex gap-4">
                    <Image
                      src={upload.preview}
                      alt="Preview"
                      width={80}
                      height={80}
                      unoptimized
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Title (Optional)
                        </label>
                        <input
                          type="text"
                          value={upload.title}
                          onChange={(e) =>
                            updatePendingUpload(index, "title", e.target.value)
                          }
                          placeholder="Enter image title..."
                          className={`w-full px-3 py-2 border rounded ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Description (Optional)
                        </label>
                        <textarea
                          value={upload.description}
                          onChange={(e) =>
                            updatePendingUpload(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Enter image description..."
                          rows={2}
                          className={`w-full px-3 py-2 border rounded resize-none ${
                            isDarkMode
                              ? "bg-gray-600 border-gray-500 text-white"
                              : "bg-white border-gray-300 text-gray-900"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Category
                        </label>
                        <Select
                          value={upload.category}
                          onChange={(e) =>
                            updatePendingUpload(
                              index,
                              "category",
                              (e.target as HTMLSelectElement).value
                            )
                          }
                          options={categories.map((cat) => ({
                            value: cat,
                            label: cat.charAt(0).toUpperCase() + cat.slice(1),
                          }))}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removePendingUpload(index)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={uploadImages}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {uploading
                  ? "Uploading..."
                  : `Upload ${pendingUploads.length} Image(s)`}
              </button>
              <button
                onClick={() => setPendingUploads([])}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Display */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 shadow-lg`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold">
            Gallery Images ({filteredImages.length})
          </h3>

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory((e.target as HTMLSelectElement).value)}
            options={[
              { value: "all", label: "All Categories" },
              ...categories.map((cat) => ({
                value: cat,
                label: cat.charAt(0).toUpperCase() + cat.slice(1),
              })),
            ]}
          />
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No images in this category. Upload some images to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className={`border rounded-lg overflow-hidden ${
                  isDarkMode ? "border-gray-600" : "border-gray-200"
                } ${image.is_featured ? "ring-2 ring-yellow-500" : ""}`}
              >
                <div className="relative">
                  <Image
                    src={image.file_url}
                    alt={image.title || image.original_filename}
                    width={300}
                    height={200}
                    unoptimized
                    className="w-full h-48 object-cover"
                  />
                  {image.is_featured && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-1">
                      <Star size={16} fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold truncate">
                        {image.title || image.original_filename}
                      </h4>
                      {image.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {image.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span>{image.category}</span>
                    <span>{formatFileSize(image.file_size)}</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingImage(image)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded text-sm"
                    >
                      <Edit2 size={14} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded text-sm"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 w-full max-w-md`}
          >
            <h3 className="text-lg font-semibold mb-4">Edit Image</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editingImage.title || ""}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, title: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  value={editingImage.description || ""}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className={`w-full px-3 py-2 border rounded resize-none ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <Select
                  value={editingImage.category}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      category: (e.target as HTMLSelectElement).value,
                    })
                  }
                  options={categories.map((cat) => ({
                    value: cat,
                    label: cat.charAt(0).toUpperCase() + cat.slice(1),
                  }))}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={editingImage.is_featured}
                  onChange={(e) =>
                    setEditingImage({
                      ...editingImage,
                      is_featured: e.target.checked,
                    })
                  }
                  className="rounded"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                  Featured Image
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  handleUpdateImage(editingImage.id, {
                    title: editingImage.title,
                    description: editingImage.description,
                    category: editingImage.category,
                    is_featured: editingImage.is_featured,
                  })
                }
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Save size={16} />
                Save Changes
              </button>
              <button
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
