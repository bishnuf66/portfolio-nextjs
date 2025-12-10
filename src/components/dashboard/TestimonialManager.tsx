"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { Testimonial } from "@/types/blog";
import {
  useTestimonials,
  useDeleteTestimonial,
} from "@/hooks/useTestimonials";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { Edit2, Trash2, Plus, Star } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

export default function TestimonialManager() {
  const router = useRouter();
  const { isDarkMode } = useStore();
  const { data: testimonials = [], isLoading } = useTestimonials(false);
  const deleteTestimonial = useDeleteTestimonial();

  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
  } = usePagination({
    data: testimonials,
    itemsPerPage: 5,
  });

  const handleEdit = (testimonial: Testimonial) => {
    router.push(`/dashboard/testimonials/edit/${testimonial.id}`);
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

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Testimonials</h2>
        <button
          onClick={() => router.push("/dashboard/testimonials/add")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      <div className="grid gap-6">
        {paginatedData.map((testimonial) => (
          <div
            key={testimonial.id}
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"
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
                  className={`w-20 h-20 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
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
                        className={`px-2 py-1 text-xs rounded ${testimonial.published
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

      {testimonials.length === 0 ? (
        <div className="text-center py-12">
          <div className={`text-6xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"}`}>
            💬
          </div>
          <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            No testimonials found. Add your first testimonial!
          </p>
        </div>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={5}
          totalItems={testimonials.length}
        />
      )}
    </>
  );
}
