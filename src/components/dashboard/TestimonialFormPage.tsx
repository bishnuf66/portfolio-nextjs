"use client";

import React, { useState } from "react";
import { ArrowLeft, Star, X } from "lucide-react";
import Image from "next/image";

interface TestimonialFormPageProps {
    initialData?: any;
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    uploading: boolean;
    isDarkMode: boolean;
}

const TestimonialFormPage: React.FC<TestimonialFormPageProps> = ({
    initialData,
    onSubmit,
    onCancel,
    uploading,
    isDarkMode,
}) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        slug: initialData?.slug || "",
        role: initialData?.role || "",
        company: initialData?.company || "",
        content: initialData?.content || "",
        avatar_url: initialData?.avatar_url || "",
        rating: initialData?.rating || 5,
        published: initialData?.published || false,
    });

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    const handleImageUpload = async (file: File) => {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        uploadFormData.append("bucket", "testimonial-avatars");

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit({
            ...formData,
            company: formData.company || undefined,
        });
    };

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                }`}
        >
            <div className="max-w-3xl mx-auto p-8 pt-24">
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
                        {initialData ? "Edit Testimonial" : "Add New Testimonial"}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => {
                                    const name = e.target.value;
                                    setFormData((prev) => ({
                                        ...prev,
                                        name,
                                        slug:
                                            prev.slug === generateSlug(prev.name)
                                                ? generateSlug(name)
                                                : prev.slug,
                                    }));
                                }}
                                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                        ? "bg-gray-700 border-gray-600"
                                        : "bg-white border-gray-300"
                                    }`}
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
                                Automatically generated from name
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Role</label>
                            <input
                                type="text"
                                required
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, role: e.target.value }))
                                }
                                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                        ? "bg-gray-700 border-gray-600"
                                        : "bg-white border-gray-300"
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Company (optional)
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        company: e.target.value,
                                    }))
                                }
                                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                        ? "bg-gray-700 border-gray-600"
                                        : "bg-white border-gray-300"
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Testimonial
                            </label>
                            <textarea
                                required
                                rows={5}
                                value={formData.content}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        content: e.target.value,
                                    }))
                                }
                                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                        ? "bg-gray-700 border-gray-600"
                                        : "bg-white border-gray-300"
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Avatar Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const url = await handleImageUpload(file);
                                        setFormData((prev) => ({ ...prev, avatar_url: url }));
                                    }
                                }}
                                className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                                        ? "bg-gray-700 border-gray-600"
                                        : "bg-white border-gray-300"
                                    }`}
                            />
                            {formData.avatar_url && (
                                <Image
                                    src={formData.avatar_url}
                                    alt="Avatar Preview"
                                    width={80}
                                    height={80}
                                    className="mt-2 w-20 h-20 object-cover rounded-full"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() =>
                                            setFormData((prev) => ({ ...prev, rating: star }))
                                        }
                                        className="focus:outline-none"
                                    >
                                        <Star
                                            size={32}
                                            className={
                                                star <= formData.rating
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-400"
                                            }
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="published"
                                checked={formData.published}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        published: e.target.checked,
                                    }))
                                }
                                className="w-4 h-4"
                            />
                            <label htmlFor="published" className="text-sm font-medium">
                                Publish immediately
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={uploading}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                                {uploading
                                    ? "Saving..."
                                    : initialData
                                        ? "Update Testimonial"
                                        : "Add Testimonial"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TestimonialFormPage;
