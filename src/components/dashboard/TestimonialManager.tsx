"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { Testimonial } from "@/types/blog";
import {
  useDeleteTestimonial,
  useTestimonialsFiltered,
  useTestimonialCounts,
} from "@/hooks/useTestimonials";
import { DashboardSkeleton } from "@/components/LoadingSkeleton";
import {
  Edit2,
  Trash2,
  Plus,
  Star,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  X,
  RefreshCw,
  Grid,
  List,
} from "lucide-react";
import Pagination from "@/components/ui/Pagination";

type SortField = "name" | "created_at" | "updated_at" | "published" | "rating";
type SortOrder = "asc" | "desc";
type ViewMode = "grid" | "list";

export default function TestimonialManager() {
  const router = useRouter();
  const { isDarkMode } = useStore();
  const deleteTestimonial = useDeleteTestimonial();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [publishedFilter, setPublishedFilter] = useState<
    "all" | "published" | "draft"
  >("all");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use backend filtering
  const {
    data: testimonialsResponse,
    isLoading: loading,
    error,
    refetch,
  } = useTestimonialsFiltered({
    published: publishedFilter,
    search: debouncedSearchTerm || undefined,
    sortBy: sortField,
    sortOrder: sortOrder,
    page: currentPage,
    limit: itemsPerPage,
    rating: ratingFilter === "all" ? undefined : ratingFilter,
  });

  const { data: counts, isLoading: countsLoading } = useTestimonialCounts();

  // Handle both array and object response formats
  const testimonials = Array.isArray(testimonialsResponse)
    ? testimonialsResponse
    : testimonialsResponse?.data || [];
  const pagination = Array.isArray(testimonialsResponse)
    ? null
    : testimonialsResponse?.pagination;

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
    setRatingFilter("all");
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

  const handleRatingChange = (value: number | "all") => {
    setRatingFilter(value);
    setCurrentPage(1);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const hasActiveFilters =
    searchTerm ||
    publishedFilter !== "all" ||
    ratingFilter !== "all" ||
    sortField !== "created_at" ||
    sortOrder !== "desc";

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

  if (loading) {
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

      {/* Search and Filter Controls */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-6 shadow-lg mb-6`}
      >
        {/* Top Row - Search, View Mode, Refresh */}
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search testimonials by name, content, or company..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg ${
                  isDarkMode
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
              className={`px-3 py-2 flex items-center gap-2 transition-colors ${
                viewMode === "list"
                  ? "bg-blue-500 text-white"
                  : `${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`
              }`}
            >
              <List size={16} />
              List
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 flex items-center gap-2 transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : `${
                      isDarkMode
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`
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
            className={`px-4 py-2 flex items-center gap-2 border rounded-lg transition-colors ${
              isDarkMode
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
              onChange={(e) =>
                handlePublishedChange(
                  e.target.value as "all" | "published" | "draft"
                )
              }
              className={`${getInputClasses(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              )}`}
            >
              <option value="all">All Testimonials</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Rating Filter */}
          <div className="min-w-[150px]">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
              Rating
            </label>
            <select
              value={ratingFilter}
              onChange={(e) =>
                handleRatingChange(
                  e.target.value === "all" ? "all" : Number(e.target.value)
                )
              }
              className={`${getInputClasses(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              )}`}
            >
              <option value="all">All Ratings</option>
              <option value={5}>5 Stars</option>
              <option value={4}>4 Stars</option>
              <option value={3}>3 Stars</option>
              <option value={2}>2 Stars</option>
              <option value={1}>1 Star</option>
            </select>
          </div>

          {/* Items Per Page */}
          <div className="min-w-[120px]">
            <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
              Per Page
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className={`${getInputClasses(
                "w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              )}`}
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
            { field: "name" as SortField, label: "Name" },
            { field: "rating" as SortField, label: "Rating" },
            { field: "published" as SortField, label: "Status" },
          ].map(({ field, label }) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                sortField === field
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {label}
              {sortField === field &&
                (sortOrder === "asc" ? (
                  <SortAsc size={14} />
                ) : (
                  <SortDesc size={14} />
                ))}
            </button>
          ))}
        </div>

        {/* Results Count and Status */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {testimonials.length} of {pagination?.totalItems || 0}{" "}
            testimonials
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total",
            value: countsLoading ? "..." : counts?.all || 0,
            gradient: "from-blue-500 to-cyan-500",
          },
          {
            label: "Published",
            value: countsLoading ? "..." : counts?.published || 0,
            gradient: "from-green-500 to-emerald-500",
          },
          {
            label: "Drafts",
            value: countsLoading ? "..." : counts?.draft || 0,
            gradient: "from-yellow-500 to-orange-500",
          },
          {
            label: "5 Stars",
            value: countsLoading ? "..." : counts?.fiveStar || 0,
            gradient: "from-purple-500 to-pink-500",
          },
        ].map((stat, index) => (
          <div
            key={index}
            className={`text-center p-4 rounded-xl ${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } shadow-lg border`}
          >
            <div
              className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
            >
              {stat.value}
            </div>
            <div
              className={`text-xs ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Testimonials Display */}
      {loading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "grid gap-6"
          }
        >
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div
              key={i}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 shadow-lg animate-pulse`}
            >
              {viewMode === "grid" ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              ) : (
                <div className="flex gap-6">
                  <div className="w-20 h-20 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
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
          <div
            className={`text-6xl mb-4 ${
              isDarkMode ? "text-gray-700" : "text-gray-300"
            }`}
          >
            ⚠️
          </div>
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } mb-4`}
          >
            Failed to load testimonials. Please try again.
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
          {testimonials.map((testimonial: Testimonial) => (
            <div
              key={testimonial.id}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="text-center space-y-4">
                {testimonial.avatar_url ? (
                  <Image
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    width={80}
                    height={80}
                    unoptimized
                    className="w-20 h-20 object-cover rounded-full mx-auto"
                  />
                ) : (
                  <div
                    className={`w-20 h-20 rounded-full ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    } flex items-center justify-center text-2xl font-bold mx-auto`}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold truncate">
                    {testimonial.name}
                  </h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(testimonial)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                      title="Edit testimonial"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(testimonial.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                      title="Delete testimonial"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm justify-center">
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

                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.role}
                  {testimonial.company && ` at ${testimonial.company}`}
                </p>

                {testimonial.rating && (
                  <div className="flex gap-1 justify-center">
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

                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                  {testimonial.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {testimonials.map((testimonial: Testimonial) => (
            <div
              key={testimonial.id}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow`}
            >
              <div className="flex gap-6">
                {testimonial.avatar_url ? (
                  <Image
                    src={testimonial.avatar_url}
                    alt={testimonial.name}
                    width={80}
                    height={80}
                    unoptimized
                    className="w-20 h-20 object-cover rounded-full flex-shrink-0"
                  />
                ) : (
                  <div
                    className={`w-20 h-20 rounded-full ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-200"
                    } flex items-center justify-center text-2xl font-bold flex-shrink-0`}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold truncate">
                          {testimonial.name}
                        </h3>
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
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                        {testimonial.content}
                      </p>
                      <div className="text-sm text-gray-500 mt-2">
                        Created:{" "}
                        {new Date(testimonial.created_at).toLocaleDateString()}
                        {testimonial.updated_at &&
                          testimonial.updated_at !== testimonial.created_at && (
                            <span>
                              {" "}
                              • Updated:{" "}
                              {new Date(
                                testimonial.updated_at
                              ).toLocaleDateString()}
                            </span>
                          )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                        title="Edit testimonial"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                        title="Delete testimonial"
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
      {testimonials.length === 0 && !loading && !error ? (
        <div className="text-center py-12">
          <div
            className={`text-6xl mb-4 ${
              isDarkMode ? "text-gray-700" : "text-gray-300"
            }`}
          >
            {hasActiveFilters ? "🔍" : "💬"}
          </div>
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } mb-4`}
          >
            {hasActiveFilters
              ? "No testimonials match your search criteria."
              : "No testimonials found. Add your first testimonial!"}
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
