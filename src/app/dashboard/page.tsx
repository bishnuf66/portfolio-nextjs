"use client";

import React, { useState } from "react";
import { Project } from "@/lib/supabase";
import useStore from "@/store/store";
import { Upload, X, Edit2, Trash2, Plus, LogOut } from "lucide-react";
import withAuth from "@/components/withAuth";
import { useAuth } from "@/components/AuthProvider";
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from "@/hooks/useProjects";

const Dashboard = () => {
  const { isDarkMode } = useStore();
  const { signOut } = useAuth();

  // TanStack Query hooks
  const { data: projects = [], isLoading, error } = useProjects();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    tech_stack: "",
    cover_image_url: "",
    gallery_images: [] as string[],
    category: "professional" as "professional" | "personal",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [originalImages, setOriginalImages] = useState<{
    cover_image_url: string;
    gallery_images: string[];
  }>({ cover_image_url: "", gallery_images: [] });
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [pendingUploads, setPendingUploads] = useState<{
    cover: File | null;
    gallery: File[];
  }>({ cover: null, gallery: [] });

  const handleImageUpload = async (file: File, type: "cover" | "gallery") => {
    if (type === "cover") {
      setPendingUploads((prev) => ({ ...prev, cover: file }));
      // Create preview URL for immediate UI update
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, cover_image_url: previewUrl }));
    } else {
      setPendingUploads((prev) => ({
        ...prev,
        gallery: [...prev.gallery, file],
      }));
      // Create preview URLs for immediate UI update
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        gallery_images: [...prev.gallery_images, previewUrl],
      }));
    }
  };

  const uploadPendingImages = async () => {
    let newCoverUrl = "";
    const uploadedGalleryUrls = [];

    // Upload cover image if pending
    if (pendingUploads.cover) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", pendingUploads.cover);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        newCoverUrl = data.imageUrl;
      }
    }

    // Upload gallery images if pending
    for (const file of pendingUploads.gallery) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (response.ok) {
        const data = await response.json();
        uploadedGalleryUrls.push(data.imageUrl);
      }
    }

    return { coverUrl: newCoverUrl, galleryUrls: uploadedGalleryUrls };
  };

  const cleanupOrphanedImages = async (imageUrls: string[]) => {
    try {
      await fetch("/api/cleanup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ imageUrls }),
      });
    } catch (error) {
      console.error("Failed to cleanup images:", error);
    }
  };

  const handleGalleryImageUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    for (const file of fileArray) {
      await handleImageUpload(file, "gallery");
    }
  };

  const handleCoverImageChange = async (file: File) => {
    // Simply handle the new image upload
    // Deletion of old image will be handled in handleSubmit
    await handleImageUpload(file, "cover");
  };

  const removeCoverImage = () => {
    // Clear cover image and pending upload
    // Deletion of original will be handled in handleSubmit
    setFormData((prev) => ({ ...prev, cover_image_url: "" }));
    setPendingUploads((prev) => ({ ...prev, cover: null }));
  };

  const removeGalleryImage = async (index: number) => {
    const imageToRemove = formData.gallery_images[index];

    // Remove from form data
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index),
    }));

    // Mark real image for deletion (not blob URLs)
    if (imageToRemove && !imageToRemove.startsWith("blob:")) {
      setImagesToDelete((prev) => [...prev, imageToRemove]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Build list of images to delete
      const toDelete: string[] = [];

      // Check if cover image was changed or removed
      if (
        originalImages.cover_image_url &&
        originalImages.cover_image_url !== formData.cover_image_url
      ) {
        // Original cover image exists and is different from current
        // Delete the original if it's a real URL (not a blob)
        if (!originalImages.cover_image_url.startsWith("blob:")) {
          toDelete.push(originalImages.cover_image_url);
        }
      }

      // Find gallery images that were removed
      const currentGalleryUrls = formData.gallery_images.filter(
        (url) => !url.startsWith("blob:")
      );
      const originalGalleryUrls = originalImages.gallery_images;

      const removedGalleryImages = originalGalleryUrls.filter(
        (originalUrl) => !currentGalleryUrls.includes(originalUrl)
      );

      if (removedGalleryImages.length > 0) {
        toDelete.push(...removedGalleryImages);
      }

      // Upload pending images and get actual URLs
      const { coverUrl, galleryUrls } = await uploadPendingImages();

      // Prepare final URLs, using uploaded URLs or existing non-blob URLs
      const finalCoverImageUrl =
        coverUrl ||
        (formData.cover_image_url.startsWith("blob:")
          ? ""
          : formData.cover_image_url);

      const finalGalleryImages = [
        ...formData.gallery_images.filter((url) => !url.startsWith("blob:")),
        ...galleryUrls,
      ];

      const projectData = {
        ...formData,
        cover_image_url: finalCoverImageUrl,
        gallery_images: finalGalleryImages,
        tech_stack: formData.tech_stack
          .split(",")
          .map((tech) => tech.trim())
          .filter(Boolean),
      };

      try {
        if (editingProject) {
          await updateProject.mutateAsync({
            id: editingProject.id,
            projectData,
          });
        } else {
          await createProject.mutateAsync(projectData);
        }

        // Delete marked images on successful save
        if (toDelete.length > 0) {
          console.log("Deleting images:", toDelete);
          await cleanupOrphanedImages(toDelete);
        }
        resetForm();
      } catch (error) {
        console.error("Failed to save project:", error);
        alert("Failed to save project");
      }
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Failed to save project");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      url: project.url,
      description: project.description,
      tech_stack: project.tech_stack.join(", "),
      cover_image_url: project.cover_image_url || "",
      gallery_images: project.gallery_images || [],
      category: project.category,
    });
    // Track original images for cleanup
    setOriginalImages({
      cover_image_url: project.cover_image_url || "",
      gallery_images: project.gallery_images || [],
    });
    // Clear any pending uploads and deletion queue
    setPendingUploads({ cover: null, gallery: [] });
    setImagesToDelete([]);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    // Find project to get its images for cleanup
    const projectToDelete = projects.find((p) => p.id === id);
    const imagesToDelete = [];

    if (projectToDelete) {
      if (projectToDelete.cover_image_url) {
        imagesToDelete.push(projectToDelete.cover_image_url);
      }
      if (projectToDelete.gallery_images) {
        imagesToDelete.push(...projectToDelete.gallery_images);
      }
    }

    try {
      await deleteProject.mutateAsync(id);

      // Delete associated images
      if (imagesToDelete.length > 0) {
        await cleanupOrphanedImages(imagesToDelete);
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Failed to delete project");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      description: "",
      tech_stack: "",
      cover_image_url: "",
      gallery_images: [],
      category: "professional",
    });
    setImageFile(null);
    setCoverImageFile(null);
    setGalleryFiles([]);
    setUploadedImages([]);
    setOriginalImages({ cover_image_url: "", gallery_images: [] });
    setImagesToDelete([]);
    setPendingUploads({ cover: null, gallery: [] });
    setEditingProject(null);
    setShowForm(false);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } p-8`}
    >
      <div className="max-w-6xl mx-auto pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Project Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Project
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto`}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingProject ? "Edit Project" : "Add New Project"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Project URL
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, url: e.target.value }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="React, Node.js, MongoDB"
                    value={formData.tech_stack}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tech_stack: e.target.value,
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value as "professional" | "personal",
                      }))
                    }
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    <option value="professional">Professional</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleCoverImageChange(file);
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {formData.cover_image_url && (
                    <div className="mt-2 relative inline-block">
                      <img
                        src={formData.cover_image_url}
                        alt="Cover Preview"
                        className="w-32 h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={removeCoverImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Gallery Images (multiple)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) {
                        handleGalleryImageUpload(e.target.files);
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  {formData.gallery_images.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium mb-1">
                        Gallery Preview:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {formData.gallery_images.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Gallery ${index + 1}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {uploading
                      ? "Processing..."
                      : editingProject
                      ? "Update Project"
                      : "Add Project"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 shadow-lg`}
            >
              <div className="flex gap-6">
                <img
                  src={
                    project.cover_image_url ?? "/project-images/placeholder.png"
                  }
                  alt={project.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.tech_stack.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-sm">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Project
                        </a>
                        <span className="text-gray-500">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
