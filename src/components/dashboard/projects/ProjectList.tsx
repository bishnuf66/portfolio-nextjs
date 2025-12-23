import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Star,
  Edit2,
  Trash2,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  X,
  RefreshCw,
  Grid,
  List,
} from "lucide-react";
import { Project } from "@/lib/supabase";
import Pagination from "@/components/ui/Pagination";
import { useProjectsFiltered } from "@/hooks/useProjects";
import { Select } from "@/components/ui/Select";
import { Tag } from "@/components/ui/Tag";
import { Button } from "@/components/ui/Button";

interface ProjectListProps {
  isDarkMode: boolean;
  handleEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
}

type SortField =
  | "name"
  | "created_at"
  | "category"
  | "is_featured"
  | "updated_at";
type SortOrder = "asc" | "desc";
type ViewMode = "grid" | "list";

const ProjectList: React.FC<ProjectListProps> = ({
  isDarkMode,
  handleEdit,
  handleDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [categoryFilter, setCategoryFilter] = useState<
    "all" | "professional" | "personal"
  >("all");
  const [featuredFilter, setFeaturedFilter] = useState<
    "all" | "featured" | "not-featured"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Use backend filtering instead of frontend filtering
  const featuredParam =
    featuredFilter === "featured"
      ? true
      : featuredFilter === "not-featured"
      ? false
      : undefined;

  const {
    data: projectsResponse,
    isLoading: loading,
    error,
    refetch,
  } = useProjectsFiltered({
    category: categoryFilter,
    search: debouncedSearchTerm || undefined,
    sortBy: sortField,
    sortOrder: sortOrder,
    page: currentPage,
    limit: itemsPerPage,
    featured: featuredParam,
  });

  // Handle both array and object response formats
  const projects = Array.isArray(projectsResponse)
    ? projectsResponse
    : projectsResponse?.data || [];
  const pagination = Array.isArray(projectsResponse)
    ? null
    : projectsResponse?.pagination;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const clearFilters = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCategoryFilter("all");
    setFeaturedFilter("all");
    setSortField("created_at");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    // Debouncing is handled by useEffect
  };

  const handleCategoryChange = (value: "all" | "professional" | "personal") => {
    setCategoryFilter(value);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleFeaturedChange = (value: "all" | "featured" | "not-featured") => {
    setFeaturedFilter(value);
    setCurrentPage(1); // Reset to first page when featured filter changes
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const hasActiveFilters =
    searchTerm ||
    categoryFilter !== "all" ||
    featuredFilter !== "all" ||
    sortField !== "created_at" ||
    sortOrder !== "desc";

  return (
    <div>
      {/* Search and Filter Controls */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg p-4 md:p-6 shadow-lg mb-6`}
      >
        {/* Top Row - Search, View Mode, Refresh */}
        <div className="flex flex-col gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className={`w-full pl-10 pr-10 py-2 md:py-3 border rounded-lg text-sm md:text-base ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors`}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* View Mode and Refresh */}
          <div className="flex gap-2">
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-2 md:px-3 py-2 flex items-center gap-1 md:gap-2 transition-colors text-sm md:text-base ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : `${
                        isDarkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`
                }`}
              >
                <List size={14} className="md:size-16" />
                <span className="hidden md:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2 md:px-3 py-2 flex items-center gap-1 md:gap-2 transition-colors text-sm md:text-base ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : `${
                        isDarkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`
                }`}
              >
                <Grid size={14} className="md:size-16" />
                <span className="hidden md:inline">Grid</span>
              </button>
            </div>

            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              className={`px-3 md:px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
                isDarkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <RefreshCw size={14} className="md:size-16" />
              <span className="hidden md:inline ml-1 md:ml-2">Refresh</span>
            </button>
          </div>
        </div>

        {/* Second Row - Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          {/* Category Filter */}
          <div className="flex-1 sm:flex-none">
            <label className="block text-xs md:text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
              Category
            </label>
            <Select
              value={categoryFilter}
              onChange={(e) =>
                handleCategoryChange(
                  (e.target as HTMLSelectElement).value as
                    | "all"
                    | "professional"
                    | "personal"
                )
              }
              options={[
                { value: "all", label: "All Categories" },
                { value: "professional", label: "Professional" },
                { value: "personal", label: "Personal" },
              ]}
            />
          </div>

          {/* Featured Filter */}
          <div className="flex-1 sm:flex-none">
            <label className="block text-xs md:text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
              Featured
            </label>
            <Select
              value={featuredFilter}
              onChange={(e) =>
                handleFeaturedChange(
                  (e.target as HTMLSelectElement).value as
                    | "all"
                    | "featured"
                    | "not-featured"
                )
              }
              options={[
                { value: "all", label: "All Projects" },
                { value: "featured", label: "Featured" },
                { value: "not-featured", label: "Not Featured" },
              ]}
            />
          </div>

          {/* Items Per Page */}
          <div className="flex-1 sm:flex-none">
            <label className="block text-xs md:text-sm font-medium mb-1 text-gray-600 dark:text-gray-400">
              Per Page
            </label>
            <Select
              value={itemsPerPage.toString()}
              onChange={(e) =>
                handleItemsPerPageChange(
                  Number((e.target as HTMLSelectElement).value)
                )
              }
              options={[
                { value: "5", label: "5 per page" },
                { value: "10", label: "10 per page" },
                { value: "20", label: "20 per page" },
                { value: "50", label: "50 per page" },
              ]}
            />
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={12} className="md:size-16" />
                <span className="hidden md:inline">Clear Filters</span>
                <span className="md:hidden">Clear</span>
              </button>
            </div>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Filter size={12} className="md:size-16" />
            Sort by:
          </span>
          {[
            { field: "created_at" as SortField, label: "Date Created" },
            { field: "updated_at" as SortField, label: "Last Updated" },
            { field: "name" as SortField, label: "Name" },
            { field: "category" as SortField, label: "Category" },
            { field: "is_featured" as SortField, label: "Featured" },
          ].map(({ field, label }) => (
            <Button
              key={field}
              variant={sortField === field ? "primary" : "ghost"}
              size="sm"
              onClick={() => handleSort(field)}
              icon={
                sortField === field &&
                (sortOrder === "asc" ? (
                  <SortAsc size={14} />
                ) : (
                  <SortDesc size={14} />
                ))
              }
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Results Count and Status */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {projects.length} of {pagination?.totalItems || 0} projects
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

      {/* Projects Display */}
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
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                  <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              ) : (
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-lg shrink-0"></div>
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
            Failed to load projects. Please try again.
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
          {projects.map((project) => (
            <div
              key={project.id}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow ${
                project.is_featured ? "ring-2 ring-yellow-500" : ""
              }`}
            >
              <div className="relative mb-4">
                <Image
                  src={
                    project.cover_image_url &&
                    project.cover_image_url.trim() !== ""
                      ? project.cover_image_url
                      : "/project-images/placeholder.png"
                  }
                  alt={project.name}
                  width={300}
                  height={200}
                  unoptimized
                  className="w-full h-48 object-cover rounded-lg"
                />
                {project.is_featured && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full p-2">
                    <Star size={16} fill="currentColor" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold truncate">{project.name}</h3>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-1.5 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                      title="Edit project"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-1.5 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                      title="Delete project"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Tag variant="category" size="sm">
                    {project.category}
                  </Tag>
                  {project.is_featured && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs font-medium">
                      FEATURED
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1">
                  {project.tech_stack
                    .slice(0, 3)
                    .map((tech: string, index: number) => (
                      <Tag key={index} variant="blog" size="sm">
                        {tech}
                      </Tag>
                    ))}
                  {project.tech_stack.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400 rounded text-xs">
                      +{project.tech_stack.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex gap-4 text-sm">
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    View Project
                  </a>
                  <span className="text-gray-400 truncate">
                    {project.slug || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow ${
                project.is_featured ? "ring-2 ring-yellow-500" : ""
              }`}
            >
              <div className="flex gap-6">
                <div className="relative shrink-0">
                  <Image
                    src={
                      project.cover_image_url &&
                      project.cover_image_url.trim() !== ""
                        ? project.cover_image_url
                        : "/project-images/placeholder.png"
                    }
                    alt={project.name}
                    width={96}
                    height={96}
                    unoptimized
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  {project.is_featured && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                      <Star size={16} fill="currentColor" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-xl font-bold truncate">
                          {project.name}
                        </h3>
                        {project.is_featured && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs font-semibold">
                            FEATURED
                          </span>
                        )}
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            project.category === "professional"
                              ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {project.category}
                        </span>
                      </div>
                      <div
                        className="text-sm text-gray-600 dark:text-gray-400 mb-2 prose prose-sm max-w-none line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: project.description,
                        }}
                      />
                      <div className="flex flex-wrap gap-2 mb-2">
                        {project.tech_stack.map(
                          (tech: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm"
                            >
                              {tech}
                            </span>
                          )
                        )}
                      </div>
                      <div className="flex gap-4 text-sm flex-wrap">
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View Project
                        </a>
                        <span className="text-gray-400">
                          Slug: {project.slug || "N/A"}
                        </span>
                        <span className="text-gray-400">
                          Created:{" "}
                          {new Date(
                            project.created_at || ""
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors"
                        title="Edit project"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                        title="Delete project"
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
      {projects.length === 0 && !loading && !error ? (
        <div className="text-center py-12">
          <div
            className={`text-6xl mb-4 ${
              isDarkMode ? "text-gray-700" : "text-gray-300"
            }`}
          >
            {hasActiveFilters ? "🔍" : "📁"}
          </div>
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            } mb-4`}
          >
            {hasActiveFilters
              ? "No projects match your search criteria."
              : "No projects found. Create your first project!"}
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
    </div>
  );
};

export default ProjectList;
