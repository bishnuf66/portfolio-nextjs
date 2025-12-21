"use client";

import React, { useState, ChangeEvent, useRef } from "react";
import { ArrowLeft, Star, X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import RichTextEditor from "../../RichTextEditor";

export type ProjectData = {
    name: string;
    slug: string;
    url: string;
    description: string;
    tech_stack: string[];
    category: "professional" | "personal";
    is_featured: boolean;
    cover_image_url: string;
    gallery_images: string[]; // Keep for backward compatibility
    gallery_images_with_titles?: GalleryImageWithTitle[]; // New enhanced gallery
};

interface GalleryImageWithTitle {
    url: string;
    title: string;
}

interface PendingGalleryImage {
    file: File;
    title: string;
    preview: string;
}

interface ProjectFormPageProps {
    initialData?: ProjectData & { id?: string }; // Add id for existing projects
    onSubmit: (data: ProjectData) => Promise<void>;
    onCancel: () => void;
    uploading: boolean;
    isDarkMode: boolean;
}

const ProjectFormPage: React.FC<ProjectFormPageProps> = ({
    initialData,
    onSubmit,
    onCancel,
    uploading,
    isDarkMode,
}) => {
    const [formData, setFormData] = useState<ProjectData>({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        url: initialData?.url || "",
        description: initialData?.description || "",
        tech_stack: initialData?.tech_stack || [],
        category: initialData?.category || "professional",
        is_featured: initialData?.is_featured || false,
        cover_image_url: initialData?.cover_image_url || "",
        gallery_images: initialData?.gallery_images || [],
        gallery_images_with_titles: initialData?.gallery_images_with_titles || [],
    });

    const [pendingUploads, setPendingUploads] = useState<{
        cover: File | null;
        gallery: PendingGalleryImage[];
    }>({ cover: null, gallery: [] });

    const [uploadStates, setUploadStates] = useState<{
        coverUploading: boolean;
        galleryUploading: boolean;
        uploadProgress: { [key: string]: number };
    }>({
        coverUploading: false,
        galleryUploading: false,
        uploadProgress: {},
    });

    // Refs for AbortController to cancel uploads
    const coverUploadController = useRef<AbortController | null>(null);
    const galleryUploadControllers = useRef<Map<string, AbortController>>(new Map());

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/--+/g, "-");
    };

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setFormData((prev) => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }));
    };

    const handleImageUpload = async (file: File, signal?: AbortSignal): Promise<string> => {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
            signal,
        });

        if (response.ok) {
            const data = await response.json();
            return data.imageUrl;
        }
        throw new Error(`Upload failed: ${response.statusText}`);
    };

    const handleCoverImageChange = async (file: File) => {
        // Cancel any existing cover upload
        if (coverUploadController.current) {
            coverUploadController.current.abort();
        }

        // Create new abort controller
        coverUploadController.current = new AbortController();

        setPendingUploads((prev) => ({ ...prev, cover: file }));
        setUploadStates((prev) => ({ ...prev, coverUploading: true }));

        // Set preview URL immediately
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, cover_image_url: previewUrl }));

        try {
            const uploadedUrl = await handleImageUpload(file, coverUploadController.current.signal);
            setFormData((prev) => ({ ...prev, cover_image_url: uploadedUrl }));
            setPendingUploads((prev) => ({ ...prev, cover: null }));
        } catch (error: unknown) {
            if (error instanceof Error && error.name !== 'AbortError') {
                console.error("Cover image upload failed:", error);
                // Revert to no image on error
                setFormData((prev) => ({ ...prev, cover_image_url: "" }));
                setPendingUploads((prev) => ({ ...prev, cover: null }));
            }
        } finally {
            setUploadStates((prev) => ({ ...prev, coverUploading: false }));
            coverUploadController.current = null;
        }
    };

    const cancelCoverUpload = () => {
        if (coverUploadController.current) {
            coverUploadController.current.abort();
            setUploadStates((prev) => ({ ...prev, coverUploading: false }));
            setFormData((prev) => ({ ...prev, cover_image_url: "" }));
            setPendingUploads((prev) => ({ ...prev, cover: null }));
        }
    };

    const handleGalleryImageUpload = async (files: FileList) => {
        const fileArray = Array.from(files);

        // Add files to pending uploads immediately for user to add titles
        const newPendingImages: PendingGalleryImage[] = fileArray.map((file) => ({
            file,
            title: "",
            preview: URL.createObjectURL(file),
        }));

        setPendingUploads((prev) => ({
            ...prev,
            gallery: [...prev.gallery, ...newPendingImages],
        }));
    };

    const cancelAllGalleryUploads = () => {
        galleryUploadControllers.current.forEach((controller) => {
            controller.abort();
        });
        galleryUploadControllers.current.clear();
        setUploadStates((prev) => ({ ...prev, galleryUploading: false }));

        // Remove any blob URLs (previews)
        setFormData((prev) => ({
            ...prev,
            gallery_images: prev.gallery_images.filter((url) => !url.startsWith("blob:")),
        }));
    };

    const removeCoverImage = async () => {
        // Cancel upload if in progress
        if (uploadStates.coverUploading) {
            cancelCoverUpload();
        } else {
            const currentCoverUrl = formData.cover_image_url;

            // If editing an existing project and has a cover image, delete from storage
            if (currentCoverUrl && initialData?.slug && !currentCoverUrl.startsWith("blob:")) {
                try {
                    const token = localStorage.getItem("supabase_token");
                    const response = await fetch(`/api/projects/${initialData.slug}/images?url=${encodeURIComponent(currentCoverUrl)}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!response.ok) {
                        console.error("Failed to delete cover image from storage");
                    }
                } catch (error) {
                    console.error("Error deleting cover image:", error);
                }
            }

            // Remove from local state regardless of API call result
            setFormData((prev) => ({ ...prev, cover_image_url: "" }));
            setPendingUploads((prev) => ({ ...prev, cover: null }));
        }
    };

    const removeGalleryImage = async (index: number) => {
        const imageUrl = formData.gallery_images[index];
        if (imageUrl && initialData?.slug) {
            // Call API to remove from database and storage
            try {
                const token = localStorage.getItem("supabase_token");
                const response = await fetch(`/api/projects/${initialData.slug}/images?url=${encodeURIComponent(imageUrl)}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error("Failed to delete image from storage");
                }
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        }

        // Remove from local state regardless of API call result
        setFormData((prev) => ({
            ...prev,
            gallery_images: prev.gallery_images.filter((_, i) => i !== index),
        }));
    };

    // New helper functions for gallery images with titles
    const updatePendingGalleryTitle = (index: number, title: string) => {
        setPendingUploads((prev) => ({
            ...prev,
            gallery: prev.gallery.map((img, i) =>
                i === index ? { ...img, title } : img
            ),
        }));
    };

    const removePendingGalleryImage = (index: number) => {
        setPendingUploads((prev) => {
            const imageToRemove = prev.gallery[index];
            if (imageToRemove?.preview) {
                URL.revokeObjectURL(imageToRemove.preview); // Clean up memory
            }
            return {
                ...prev,
                gallery: prev.gallery.filter((_, i) => i !== index),
            };
        });
    };

    const removeGalleryImageWithTitle = async (index: number) => {
        const imageWithTitle = formData.gallery_images_with_titles?.[index];
        if (imageWithTitle && initialData?.slug) {
            // Call API to remove from database and storage
            try {
                const token = localStorage.getItem("supabase_token");
                const response = await fetch(`/api/projects/${initialData.slug}/images?url=${encodeURIComponent(imageWithTitle.url)}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    console.error("Failed to delete image from storage");
                }
            } catch (error) {
                console.error("Error deleting image:", error);
            }
        }

        // Remove from local state regardless of API call result
        setFormData((prev) => ({
            ...prev,
            gallery_images_with_titles: prev.gallery_images_with_titles?.filter((_, i) => i !== index) || [],
        }));
    };

    const updateGalleryImageTitle = (index: number, title: string) => {
        setFormData((prev) => ({
            ...prev,
            gallery_images_with_titles: prev.gallery_images_with_titles?.map((img, i) =>
                i === index ? { ...img, title } : img
            ) || [],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let finalCoverUrl = formData.cover_image_url;
            const finalGalleryImagesWithTitles: GalleryImageWithTitle[] = [
                ...(formData.gallery_images_with_titles || [])
            ];

            // Upload pending cover image
            if (pendingUploads.cover) {
                finalCoverUrl = await handleImageUpload(pendingUploads.cover);
            }

            // Upload pending gallery images with titles
            for (const pendingImage of pendingUploads.gallery) {
                if (pendingImage.file) {
                    const url = await handleImageUpload(pendingImage.file);
                    if (url) {
                        finalGalleryImagesWithTitles.push({
                            url,
                            title: pendingImage.title || "",
                        });
                    }
                }
            }

            // Create backward-compatible gallery_images array
            const finalGalleryUrls = finalGalleryImagesWithTitles.map(img => img.url);

            const projectData = {
                ...formData,
                cover_image_url: finalCoverUrl.startsWith("blob:") ? "" : finalCoverUrl,
                gallery_images: finalGalleryUrls, // Backward compatibility
                gallery_images_with_titles: finalGalleryImagesWithTitles, // New enhanced format
            };

            await onSubmit(projectData);
        } catch (error) {
            console.error("Failed to submit:", error);
        }
    };

    const isAnyUploadInProgress = uploadStates.coverUploading || uploadStates.galleryUploading;

    return (
        <div
            className={`min-h-screen ${isDarkMode ? " text-white" : " text-gray-900"
                }`}
        >
            <div className="max-w-4xl mx-auto p-8 pt-24">
                <button
                    onClick={onCancel}
                    className="flex items-center gap-2 mb-6 text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>

                <div
                    className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                        } rounded-lg shadow-xl p-8`}
                >
                    <h1 className="text-3xl font-bold mb-8">
                        {initialData ? "Edit Project" : "Add New Project"}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Project Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleNameChange}
                                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                    ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    } focus:outline-none focus:ring-1`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Slug</label>
                            <div
                                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                    ? "bg-gray-700 border-gray-600 text-gray-300"
                                    : "bg-gray-100 border-gray-300 text-gray-700"
                                    }`}
                            >
                                {formData.slug}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Automatically generated from project name
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Project URL
                            </label>
                            <input
                                type="url"
                                required
                                value={formData.url}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        url: e.target.value,
                                    }))
                                }
                                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                    ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    } focus:outline-none focus:ring-1`}
                                placeholder="https://example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Description
                            </label>
                            <div className="min-h-[200px]">
                                <RichTextEditor
                                    content={formData.description}
                                    onChange={(description) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description,
                                        }))
                                    }
                                    placeholder="Describe your project..."
                                    maxLength={2000}
                                    height="200px"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Tech Stack (comma-separated)
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="React, Node.js, MongoDB"
                                value={formData.tech_stack.join(", ")}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        tech_stack: e.target.value.split(",").map((t) => t.trim()),
                                    }))
                                }
                                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                    ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    } focus:outline-none focus:ring-1`}
                            />
                        </div>

                        <div className="flex items-start">
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.is_featured}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            is_featured: e.target.checked,
                                        }))
                                    }
                                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-1"
                                />
                                <div>
                                    <span className="text-sm font-medium flex items-center gap-2">
                                        <Star size={16} className="text-yellow-500" />
                                        Featured Project
                                    </span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        Show this project on the homepage (max 6 recommended)
                                    </p>
                                </div>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        category: e.target.value as "professional" | "personal",
                                    }))
                                }
                                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                    ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                    : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    } focus:outline-none focus:ring-1`}
                            >
                                <option value="professional">Professional</option>
                                <option value="personal">Personal</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Cover Image
                            </label>
                            <div className="space-y-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={uploadStates.coverUploading}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleCoverImageChange(file);
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${isDarkMode
                                        ? "bg-gray-700 border-gray-600 file:bg-gray-600 file:text-white"
                                        : "bg-white border-gray-300 file:bg-gray-100 file:text-gray-700"
                                        } ${uploadStates.coverUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                />

                                {uploadStates.coverUploading && (
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                        <span className="text-sm text-blue-700 dark:text-blue-300">
                                            Uploading cover image...
                                        </span>
                                        <button
                                            type="button"
                                            onClick={cancelCoverUpload}
                                            className="ml-auto text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                                {formData.cover_image_url && (
                                    <div className="relative inline-block">
                                        <Image
                                            src={formData.cover_image_url}
                                            alt="Cover Preview"
                                            width={128}
                                            height={128}
                                            unoptimized
                                            className={`w-32 h-32 object-cover rounded border ${uploadStates.coverUploading ? "opacity-75" : ""
                                                }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={removeCoverImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                            aria-label="Remove cover image"
                                        >
                                            <X size={12} />
                                        </button>
                                        {uploadStates.coverUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Gallery Images (multiple)
                            </label>
                            <div className="space-y-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    disabled={uploadStates.galleryUploading}
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            handleGalleryImageUpload(e.target.files);
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${isDarkMode
                                        ? "bg-gray-700 border-gray-600 file:bg-gray-600 file:text-white"
                                        : "bg-white border-gray-300 file:bg-gray-100 file:text-gray-700"
                                        } ${uploadStates.galleryUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                                />

                                {uploadStates.galleryUploading && (
                                    <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                                        <span className="text-sm text-blue-700 dark:text-blue-300">
                                            Uploading gallery images...
                                        </span>
                                        <button
                                            type="button"
                                            onClick={cancelAllGalleryUploads}
                                            className="ml-auto text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            Cancel All
                                        </button>
                                    </div>
                                )}

                                {/* Pending Gallery Images with Title Inputs */}
                                {pendingUploads.gallery.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-2">Pending Gallery Images:</p>
                                        <div className="space-y-3">
                                            {pendingUploads.gallery.map((pendingImage, index) => (
                                                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50 dark:bg-gray-700">
                                                    <div className="relative">
                                                        <Image
                                                            src={pendingImage.preview}
                                                            alt={`Pending ${index + 1}`}
                                                            width={80}
                                                            height={80}
                                                            unoptimized
                                                            className="w-20 h-20 object-cover rounded border"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removePendingGalleryImage(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                            aria-label={`Remove pending image ${index + 1}`}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium mb-1">
                                                            Image Title (Optional)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={pendingImage.title}
                                                            onChange={(e) => updatePendingGalleryTitle(index, e.target.value)}
                                                            placeholder="Enter a title for this image..."
                                                            className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                                                ? "bg-gray-600 border-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                                                : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                                } focus:outline-none focus:ring-1`}
                                                        />
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                            File: {pendingImage.file.name}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Existing Gallery Images with Titles */}
                                {formData.gallery_images_with_titles && formData.gallery_images_with_titles.length > 0 && (
                                    <div>
                                        <p className="text-sm font-medium mb-2">Current Gallery Images:</p>
                                        <div className="space-y-3">
                                            {formData.gallery_images_with_titles.map((imageWithTitle, index) => (
                                                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                                    <div className="relative">
                                                        <Image
                                                            src={imageWithTitle.url}
                                                            alt={imageWithTitle.title || `Gallery ${index + 1}`}
                                                            width={80}
                                                            height={80}
                                                            unoptimized
                                                            className="w-20 h-20 object-cover rounded border"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeGalleryImageWithTitle(index)}
                                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                                            aria-label={`Remove gallery image ${index + 1}`}
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1">
                                                        <label className="block text-sm font-medium mb-1">
                                                            Image Title (Optional)
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={imageWithTitle.title}
                                                            onChange={(e) => updateGalleryImageTitle(index, e.target.value)}
                                                            placeholder="Enter a title for this image..."
                                                            className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                                                ? "bg-gray-700 border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                                                                : "bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                                                } focus:outline-none focus:ring-1`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Legacy Gallery Images (for backward compatibility) */}
                                {formData.gallery_images.length > 0 && (!formData.gallery_images_with_titles || formData.gallery_images_with_titles.length === 0) && (
                                    <div>
                                        <p className="text-sm font-medium mb-2">Gallery Preview (Legacy):</p>
                                        <div className="flex flex-wrap gap-3">
                                            {formData.gallery_images.map((url, index) => (
                                                <div key={index} className="relative group">
                                                    <Image
                                                        src={url}
                                                        alt={`Gallery ${index + 1}`}
                                                        width={80}
                                                        height={80}
                                                        unoptimized
                                                        className={`w-20 h-20 object-cover rounded border ${url.startsWith("blob:") && uploadStates.galleryUploading
                                                            ? "opacity-75"
                                                            : ""
                                                            }`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(index)}
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                        aria-label={`Remove gallery image ${index + 1}`}
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                    {url.startsWith("blob:") && uploadStates.galleryUploading && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                                                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onCancel}
                                disabled={uploading || isAnyUploadInProgress}
                                className="px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading || isAnyUploadInProgress}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2"
                            >
                                {uploading || isAnyUploadInProgress ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        {uploading ? "Saving..." : "Uploading..."}
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-4 h-4" />
                                        {initialData ? "Update Project" : "Add Project"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectFormPage;
