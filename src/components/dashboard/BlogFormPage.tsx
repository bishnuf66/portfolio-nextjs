"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import RichTextEditor from "../RichTextEditor";
import { toast } from "react-toastify";

interface BlogFormPageProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  uploading: boolean;
  isDarkMode: boolean;
}

const BlogFormPage: React.FC<BlogFormPageProps> = ({
  initialData,
  onSubmit,
  onCancel,
  uploading,
  isDarkMode,
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    cover_image_url: initialData?.cover_image_url || "",
    author: initialData?.author || "",
    tags: initialData?.tags?.join(", ") || "",
    published: initialData?.published || false,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleImageUpload = async (file: File) => {
    // Validate file size (max 1MB)
    const maxSize = 1 * 1024 * 1024; // 1MB in bytes
    if (file.size > maxSize) {
      toast.error(`${file.name} is too large (max 1MB)`);
      return "";
    }

    // Recommend WebP format
    if (file.type !== "image/webp") {
      toast.warn(
        `${file.name}: Consider converting to WebP format for better compression and performance`
      );
    }

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("bucket", "blog-images");

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
      tags: formData.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean),
    });
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? " text-white" : " text-gray-900"
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
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } rounded-lg shadow-xl p-8`}
        >
          <h1 className="text-3xl font-bold mb-8">
            {initialData ? "Edit Blog Post" : "Add New Blog Post"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    title,
                    slug:
                      prev.slug === generateSlug(prev.title)
                        ? generateSlug(title)
                        : prev.slug,
                  }));
                }}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
                className={`w-full px-3 py-2 border rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                required
                rows={2}
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    excerpt: e.target.value,
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
              <label className="block text-sm font-medium mb-2">Content</label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({
                    ...prev,
                    content,
                  }))
                }
                placeholder="Write your blog content here..."
                maxLength={50000}
                height="400px"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/webp,image/jpeg,image/png,image/gif,image/svg+xml"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = await handleImageUpload(file);
                    setFormData((prev) => ({
                      ...prev,
                      cover_image_url: url,
                    }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              />
              {formData.cover_image_url && (
                <Image
                  src={formData.cover_image_url}
                  alt="Cover Preview"
                  width={800}
                  height={192}
                  unoptimized
                  className="mt-2 w-full h-48 object-cover rounded"
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Author</label>
              <input
                type="text"
                required
                value={formData.author}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    author: e.target.value,
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
              <label className="block text-sm font-medium mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="React, Next.js, TypeScript"
                value={formData.tags}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, tags: e.target.value }))
                }
                className={`w-full px-3 py-2 border rounded-lg ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600"
                    : "bg-white border-gray-300"
                }`}
              />
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
                  ? "Update Blog"
                  : "Add Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogFormPage;
