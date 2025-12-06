"use client";

import React, { useState } from "react";
import Image from "next/image";
import useStore from "@/store/store";
import { Testimonial } from "@/types/blog";
import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "@/hooks/useTestimonials";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { X, Edit2, Trash2, Plus, Star } from "lucide-react";

export default function TestimonialManager() {
  const { isDarkMode } = useStore();
  const { data: testimonials = [], isLoading } = useTestimonials(false);
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    role: "",
    company: "",
    content: "",
    avatar_url: "",
    rating: 5,
    published: false,
  });
  const [uploading, setUploading] = useState(false);

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
    setUploading(true);

    try {
      const testimonialData = {
        ...formData,
        company: formData.company || undefined,
      };

      if (editingTestimonial) {
        await updateTestimonial.mutateAsync({
          id: editingTestimonial.id,
          testimonialData,
        });
      } else {
        await createTestimonial.mutateAsync(testimonialData);
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save testimonial:", error);
      alert("Failed to save testimonial");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      slug: testimonial.slug,
      role: testimonial.role,
      company: testimonial.company || "",
      content: testimonial.content,
      avatar_url: testimonial.avatar_url || "",
      rating: testimonial.rating || 5,
      published: testimonial.published,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await deleteTestimonial.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
      alert("Failed to delete testimonial");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      role: "",
      company: "",
      content: "",
      avatar_url: "",
      rating: 5,
      published: false,
    });
    setEditingTestimonial(null);
    setShowForm(false);
  };

  const generateSlug = (name: string) => {
    return name
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
        <h2 className="text-2xl font-bold">Testimonials</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg w-full max-w-2xl h-[80vh] flex flex-col overflow-hidden`}
          >
            <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold">
                {editingTestimonial
                  ? "Edit Testimonial"
                  : "Add New Testimonial"}
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
                id="testimonial-form"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
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
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <div
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600 text-gray-300"
                        : "bg-gray-100 border-gray-300 text-gray-700"
                    }`}
                  >
                    {formData.slug}
                  </div>
                  <input type="hidden" name="slug" value={formData.slug} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Automatically generated from name
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, role: e.target.value }))
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
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
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
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
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
                    className={`w-full px-3 py-2 border rounded-lg ${
                      isDarkMode
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
                  <label className="block text-sm font-medium mb-1">
                    Rating
                  </label>
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

                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {uploading
                      ? "Saving..."
                      : editingTestimonial
                      ? "Update Testimonial"
                      : "Add Testimonial"}
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

            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="flex gap-2">
                <button
                  form="testimonial-form"
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {uploading
                    ? "Saving..."
                    : editingTestimonial
                    ? "Update Testimonial"
                    : "Add Testimonial"}
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
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg p-6 shadow-lg`}
          >
            <div className="flex gap-6">
              {testimonial.avatar_url ? (
                <Image
                  src={testimonial.avatar_url}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-full"
                />
              ) : (
                <div
                  className={`w-20 h-20 rounded-full ${
                    isDarkMode ? "bg-gray-700" : "bg-gray-200"
                  } flex items-center justify-center text-2xl font-bold`}
                >
                  {testimonial.name.charAt(0)}
                </div>
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{testimonial.name}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          testimonial.published
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        {testimonial.published ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {testimonial.role}
                      {testimonial.company && ` at ${testimonial.company}`}
                    </p>
                    {testimonial.rating && (
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < testimonial.rating!
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-400"
                            }
                          />
                        ))}
                      </div>
                    )}
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {testimonial.content}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
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
