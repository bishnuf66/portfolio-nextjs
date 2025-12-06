"use client";

import React, { useState } from "react";
import Image from "next/image";
import useStore from "@/store/store";
import { Blog } from "@/types/blog";
import {
  useBlogs,
  useCreateBlog,
  useUpdateBlog,
  useDeleteBlog,
} from "@/hooks/useBlogs";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { X, Edit2, Trash2, Plus } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";

export default function BlogManager() {
  const { isDarkMode } = useStore();
  const { data: blogs = [], isLoading } = useBlogs(false);
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image_url: "",
    author: "",
    tags: "",
    published: false,
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
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
    setUploading(true);

    try {
      const blogData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (editingBlog) {
        await updateBlog.mutateAsync({
          id: editingBlog.id,
          blogData,
        });
      } else {
        await createBlog.mutateAsync(blogData);
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save blog:", error);
      alert("Failed to save blog");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      cover_image_url: blog.cover_image_url || "",
      author: blog.author,
      tags: blog.tags.join(", "),
      published: blog.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await deleteBlog.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete blog:", error);
      alert("Failed to delete blog");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      cover_image_url: "",
      author: "",
      tags: "",
      published: false,
    });
    setEditingBlog(null);
    setShowForm(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Blog Post
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg w-full max-w-3xl h-[80vh] flex flex-col overflow-hidden`}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold">
                {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                id="blog-form"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Title
                  </label>
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
                  <label className="block text-sm font-medium mb-1">Slug</label>
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
                  <label className="block text-sm font-medium mb-1">
                    Excerpt
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Content
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
                    Cover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
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
                      className="mt-2 w-full h-48 object-cover rounded"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Author
                  </label>
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
                  <label className="block text-sm font-medium mb-1">
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
              </form>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="flex gap-2">
                <button
                  form="blog-form"
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {uploading
                    ? "Saving..."
                    : editingBlog
                    ? "Update Blog"
                    : "Add Blog"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 shadow-lg`}
          >
            <div className="flex gap-6">
              {blog.cover_image_url && (
                <Image
                  src={blog.cover_image_url}
                  alt={blog.title}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{blog.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          blog.published
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {blog.excerpt}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {blog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      By {blog.author} •{" "}
                      {new Date(blog.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
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
    </>
  );
}
