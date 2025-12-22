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

      {/* Search and Filter Controls */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg mb-6`}>
        {/* Top Row - Search, View Mode, Refresh */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search blogs by title, content, or author..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 flex items-center gap-2 transition-colors ${viewMode === "list"
                ? "bg-blue-500 text-white"
                : `${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`
                }`}
            >
              <List size={16} />
              List
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 flex items-center gap-2 transition-colors ${viewMode === "grid"
                ? "bg-blue-500 text-white"
                : `${isDarkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`
                }`}
            >
              <Grid size={16} />
              Grid
            </button>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`px-4 py-2 flex items-center gap-2 border rounded-lg transition-colors ${isDarkMode
              ? "border-gray-600 text-gray-300 hover:bg-gray-700"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Second Row - Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Published Status Filter */}
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
              Status
            </label>
            <select
              value={publishedFilter}
              onChange={(e) => handlePublishedChange(e.target.value as "all" | "published" | "draft")}
              className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            >
              <option value="all">All Posts</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Author Filter */}
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
              Author
            </label>
            <input
              type="text"
              placeholder="Filter by author"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            />
          </div>

          {/* Items Per Page */}
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
              Per Page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={20}>20 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={16} />
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Filter size={16} />
            Sort by:
          </span>
          {[
            { field: "created_at" as SortField, label: "Date Created" },
            { field: "updated_at" as SortField, label: "Last Updated" },
            { field: "title" as SortField, label: "Title" },
            { field: "author" as SortField, label: "Author" },
            { field: "published" as SortField, label: "Status" },
          ].map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${sortField === field
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              {label}
              {sortField === field && (
                sortOrder === "asc" ? <SortAsc size={14} /> : <SortDesc size={14} />
              )}
            </button>
          ))}
        </div>

        {/* Results Count and Status */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {blogs.length} of {pagination?.totalItems || 0} blog posts
            {hasActiveFilters && " (filtered)"}
            {pagination && (
              <span className="ml-2">
                • Page {pagination.currentPage} of {pagination.totalPages}
              </span>
            )}
          </div>
          {debouncedSearchTerm !== searchTerm && (
            <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <RefreshCw size={12} className="animate-spin" />
              Searching...
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Posts", value: countsLoading ? "..." : (counts?.all || 0), gradient: "from-blue-500 to-cyan-500" },
          { label: "Published", value: countsLoading ? "..." : (counts?.published || 0), gradient: "from-green-500 to-emerald-500" },
          { label: "Drafts", value: countsLoading ? "..." : (counts?.draft || 0), gradient: "from-yellow-500 to-orange-500" },
        ].map((stat, index) => (
          <div
            key={index}
            className={`text-center p-4 rounded-xl ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-lg border`}
          >
            <div
              className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
            >
              {stat.value}
            </div>
            <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Blog Posts Display */}
      {loading ? (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "grid gap-6"}>
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div
              key={i}
              className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg animate-pulse`}
            >
              {viewMode === "grid" ? (
                <div className="space-y-4">
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              ) : (
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className={`text-6xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"}`}>⚠️</div>
          <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
            Failed to load blog posts. Please try again.
          </p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog: Blog) => (
            <div
              key={blog.id}
              className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow`}
            >
              {blog.cover_image_url && (
                <div className="relative mb-4">
                  <Image
                    src={blog.cover_image_url}
                    alt={blog.title}
                    width={300}
                    height={200}
                    unoptimized
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold truncate">{blog.title}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                      title="Edit blog"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                      title="Delete blog"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span
                    className={`px-2 py-1 text-xs rounded ${blog.published
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                  >
                    {blog.published ? "Published" : "Draft"}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                  {blog.excerpt}
                </p>

                <div className="flex flex-wrap gap-1">
                  {blog.tags.slice(0, 3).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                  {blog.tags.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded text-xs">
                      +{blog.tags.length - 3} more
                    </span>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  By {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {blogs.map((blog: Blog) => (
            <div
              key={blog.id}
              className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                } rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex gap-6">
                {blog.cover_image_url && (
                  <Image
                    src={blog.cover_image_url}
                    alt={blog.title}
                    width={128}
                    height={128}
                    unoptimized
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold truncate">{blog.title}</h3>
                        <span
                          className={`px-2 py-1 text-xs rounded ${blog.published
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            }`}
                        >
                          {blog.published ? "Published" : "Draft"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {blog.excerpt}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {blog.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500">
                        By {blog.author} • Created: {new Date(blog.created_at).toLocaleDateString()}
                        {blog.updated_at && blog.updated_at !== blog.created_at && (
                          <span> • Updated: {new Date(blog.updated_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(blog)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                        title="Edit blog"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                        title="Delete blog"
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
      )}

      {/* Empty State */}
      {blogs.length === 0 && !loading && !error ? (
        <div className="text-center py-12">
          <div className={`text-6xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"}`}>
            {hasActiveFilters ? "🔍" : "📝"}
          </div>
          <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`}>
            {hasActiveFilters
              ? "No blog posts match your search criteria."
              : "No blog posts found. Create your first blog post!"
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : null}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={pagination.pageSize}
            totalItems={pagination.totalItems}
          />
        </div>
      )}
    </>
  );
}
