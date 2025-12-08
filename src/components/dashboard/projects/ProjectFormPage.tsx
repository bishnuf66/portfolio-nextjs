"use client";

import React, { useState, ChangeEvent } from "react";
import { ArrowLeft, Star, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RichTextEditor from "../../RichTextEditor";

type ProjectData = {
    name: string;
    slug: string;
    url: string;
    description: string;
    tech_stack: string[];
    category: "professional" | "personal";
    is_featured: boolean;
    cover_image_url: string;
    gallery_images: string[];
};

interface ProjectFormPageProps {
    initialData?: any;
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
    const router = useRouter();
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
    });

    const [pendingUploads, setPendingUploads] = useState<{
        cover: File | null;
        gallery: File[];
    }>({ cover: null, gallery: [] });

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

    const handleImageUpload = async (file: File): Promise<string> => {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: uploadFormData,
        });

        if (response.ok) {
            const data = await response.json();
            return data.imageUrl;
        }
        return "";
    };

    const handleCoverImageChange = async (file: File) => {
        setPendingUploads((prev) => ({ ...prev, cover: file }));
        const previewUrl = URL.createObjectURL(file);
        setFormData((prev) => ({ ...prev, cover_image_url: previewUrl }));
    };

    const handleGalleryImageUpload = async (files: FileList) => {
        const fileArray = Array.from(files);
        for (const file of fileArray) {
            setPendingUploads((prev) => ({
                ...prev,
                gallery: [...prev.gallery, file],
            }));
            const previewUrl = URL.createObjectURL(file);
            setFormData((prev) => ({
                ...prev,
                gallery_images: [...prev.gallery_images, previewUrl],
            }));
        }
    };

    const removeCoverImage = () => {
        setFormData((prev) => ({ ...prev, cover_image_url: "" }));
        setPendingUploads((prev) => ({ ...prev, cover: null }));
    };

    const removeGalleryImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            gallery_images: prev.gallery_images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let finalCoverUrl = formData.cover_image_url;
            const finalGalleryUrls = [...formData.gallery_images.filter((url) => !url.startsWith("blob:"))];

            // Upload pending cover image
            if (pendingUploads.cover) {
                finalCoverUrl = await handleImageUpload(pendingUploads.cover);
            }

            // Upload pending gallery images
            for (const file of pendingUploads.gallery) {
                const url = await handleImageUpload(file);
                if (url) finalGalleryUrls.push(url);
            }

            const projectData = {
                ...formData,
                cover_image_url: finalCoverUrl.startsWith("blob:") ? "" : finalCoverUrl,
                gallery_images: finalGalleryUrls,
            };

            await onSubmit(projectData);
        } catch (error) {
            console.error("Failed to submit:", error);
        }
    };

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
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
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        handleCoverImageChange(file);
                                    }
                                }}
                                className={`w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${isDarkMode
                                        ? "bg-gray-700 border-gray-600 file:bg-gray-600 file:text-white"
                                        : "bg-white border-gray-300 file:bg-gray-100 file:text-gray-700"
                                    }`}
                            />
                            {formData.cover_image_url && (
                                <div className="mt-3 relative inline-block">
                                    <Image
                                        src={formData.cover_image_url}
                                        alt="Cover Preview"
                                        width={128}
                                        height={128}
                                        className="w-32 h-32 object-cover rounded border"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeCoverImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        aria-label="Remove cover image"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
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
                                className={`w-full px-3 py-2 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold ${isDarkMode
                                        ? "bg-gray-700 border-gray-600 file:bg-gray-600 file:text-white"
                                        : "bg-white border-gray-300 file:bg-gray-100 file:text-gray-700"
                                    }`}
                            />
                            {formData.gallery_images.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-sm font-medium mb-2">Gallery Preview:</p>
                                    <div className="flex flex-wrap gap-3">
                                        {formData.gallery_images.map((url, index) => (
                                            <div key={index} className="relative group">
                                                <Image
                                                    src={url}
                                                    alt={`Gallery ${index + 1}`}
                                                    width={80}
                                                    height={80}
                                                    className="w-20 h-20 object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryImage(index)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                    aria-label={`Remove gallery image ${index + 1}`}
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {uploading
                                    ? "Saving..."
                                    : initialData
                                        ? "Update Project"
                                        : "Add Project"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProjectFormPage;
