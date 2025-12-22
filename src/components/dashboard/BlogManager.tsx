"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { Blog } from "@/types/blog";
import {
  useDeleteBlog,
  useBlogsFiltered,
  useBlogCounts,
} from "@/hooks/useBlogs";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import { Edit2, Trash2, Plus, Search, SortAsc, SortDesc, Filter, X, RefreshCw, Grid, List } from "lucide-react";
import Pagination from "@/components/ui/Pagination";

type SortField = "title" | "created_at" | "updated_at" | "published" | "author";
type SortOrder = "asc" | "desc";
type ViewMode = "grid" | "list";

export default function BlogManager() {
  const router = useRouter();
  const { isDarkMode } = useStore();
  const deleteBlog = useDeleteBlog();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [publishedFilter, setPublishedFilter] = useState<"all" | "published" | "draft">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [authorFilter, setAuthorFilter] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use backend filtering
  const { data: blogsResponse, isLoading: loading, error, refetch } = useBlogsFiltered({
    published: publishedFilter,
    search: debouncedSearchTerm || undefined,
    sortBy: sortField,
    sortOrder: sortOrder,
    page: currentPage,
    limit: itemsPerPage,
    author: authorFilter || undefined,
  });

  const { data: counts, isLoading: countsLoading } = useBlogCounts();

  // Handle both array and object response formats
  const blogs = Array.isArray(blogsResponse)
    ? blogsResponse
    : (blogsResponse?.data || []);
  const pagination = Array.isArray(blogsResponse)
    ? null
    : blogsResponse?.pagination;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setPublishedFilter("all");
    setAuthorFilter("");
    setSortField("created_at");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handlePublishedChange = (value: "all" | "published" | "draft") => {
    setPublishedFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const hasActiveFilters = searchTerm || publishedFilter !== "all" || authorFilter || sortField !== "created_at" || sortOrder !== "desc";

  const handleEdit = (blog: Blog) => {
    router.push(`/dashboard/blogs/edit/${blog.id}`);
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

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <button
          onClick={() => router.push("/dashboard/blogs/add")}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Blog Post
        </button>
      </div>

      <div className="grid gap-6">
        {paginatedData.map((blog) => (
          <div
            key={blog.id}
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 shadow-lg`}
          >
            <div className="flex gap-6">
              {blog.cover_image_url && (
                <Image
                  src={blog.cover_image_url}
                  alt={blog.title}
                  width={128}
                  height={128}
                  unoptimized
                  className="w-32 h-32 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{blog.title}</h3>
                      <span
                        className={`px-2 py-1 text-xs rounded ${blog.published
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

      {blogs.length === 0 ? (
        <div className="text-center py-12">
          <div className={`text-6xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"}`}>
            📝
          </div>
          <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            No blog posts found. Create your first blog post!
          </p>
        </div>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={5}
          totalItems={blogs.length}
        />
      )}
    </>
  );
}
