import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Star, Edit2, Trash2, Search, SortAsc, SortDesc, Filter, X } from "lucide-react";
import { Project } from "@/lib/supabase";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

interface ProjectListProps {
  projects: Project[];
  isDarkMode: boolean;
  handleEdit: (project: Project) => void;
  handleDelete: (id: string) => void;
}

type SortField = "name" | "created_at" | "category" | "is_featured";
type SortOrder = "asc" | "desc";

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  isDarkMode,
  handleEdit,
  handleDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "professional" | "personal">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured" | "not-featured">("all");

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter((project) => {
      // Search filter
      const matchesSearch =
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech_stack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.slug?.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = categoryFilter === "all" || project.category === categoryFilter;

      // Featured filter
      const matchesFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && project.is_featured) ||
        (featuredFilter === "not-featured" && !project.is_featured);

      return matchesSearch && matchesCategory && matchesFeatured;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "created_at":
          aValue = new Date(a.created_at || 0);
          bValue = new Date(b.created_at || 0);
          break;
        case "category":
          aValue = a.category;
          bValue = b.category;
          break;
        case "is_featured":
          aValue = a.is_featured ? 1 : 0;
          bValue = b.is_featured ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [projects, searchTerm, sortField, sortOrder, categoryFilter, featuredFilter]);

  const { currentPage, totalPages, paginatedData, goToPage } = usePagination({
    data: filteredAndSortedProjects,
    itemsPerPage: 5,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setFeaturedFilter("all");
    setSortField("created_at");
    setSortOrder("desc");
  };

  const hasActiveFilters = searchTerm || categoryFilter !== "all" || featuredFilter !== "all";

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg mb-6`}>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects by name, description, tech stack, or slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="min-w-[150px]">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Categories</option>
              <option value="professional">Professional</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div className="min-w-[150px]">
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value as any)}
              className={`w-full px-3 py-2 border rounded-lg ${isDarkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="all">All Projects</option>
              <option value="featured">Featured Only</option>
              <option value="not-featured">Not Featured</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {/* Sort Controls */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <Filter size={16} />
            Sort by:
          </span>
          {[
            { field: "created_at" as SortField, label: "Date Created" },
            { field: "name" as SortField, label: "Name" },
            { field: "category" as SortField, label: "Category" },
            { field: "is_featured" as SortField, label: "Featured" },
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

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredAndSortedProjects.length} of {projects.length} projects
          {hasActiveFilters && " (filtered)"}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6">
        {paginatedData.map((project) => (
          <div
            key={project.id}
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-6 shadow-lg ${project.is_featured ? "ring-2 ring-yellow-500" : ""
              }`}
          >
            <div className="flex gap-6">
              <div className="relative">
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
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold">{project.name}</h3>
                      {project.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded text-xs font-semibold">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div
                      className="text-sm text-gray-600 dark:text-gray-400 mb-2 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: project.description,
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.tech_stack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-4 text-sm">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View Project
                      </a>
                      <span className="text-gray-500">{project.category}</span>
                      <span className="text-gray-400">
                        Slug: {project.slug || "N/A"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(project)}
                      className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
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

      {filteredAndSortedProjects.length === 0 ? (
        <div className="text-center py-12">
          <div
            className={`text-6xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"
              }`}
          >
            {hasActiveFilters ? "🔍" : "📁"}
          </div>
          <p
            className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
          >
            {hasActiveFilters
              ? "No projects match your search criteria."
              : "No projects found. Create your first project!"
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
          itemsPerPage={5}
          totalItems={filteredAndSortedProjects.length}
        />
      )}
    </div>
  );
};

export default ProjectList;
