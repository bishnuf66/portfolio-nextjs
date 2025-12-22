"use client";

import { useState } from "react";
import {
  getPageClasses,
  getCardClasses,
  getInputClasses,
  colorScheme,
} from "@/utils/colorUtils";
import { Select } from "@/components/ui/Select";
import useStore from "@/store/store";
import { Button } from "@/components/ui/Button";
import {
  Briefcase,
  Code,
  Layers,
  Star,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  X,
  WorkflowIcon,
} from "lucide-react";
import ProjectCard from "@/components/ProjectCard";
import { ProjectCardSkeleton } from "@/components/LoadingSkeleton";
import Pagination from "@/components/ui/Pagination";
import { getSafeImageUrl } from "@/utils/imageUtils";
import {
  AnimatedSection,
  StaggeredContainer,
} from "@/components/ui/AnimatedSection";
import SEOContent from "@/components/SEOContent";
import { useProjectsFiltered, useProjectCounts } from "@/hooks/useProjects";

type TabType = "all" | "professional" | "personal";
type SortField = "name" | "created_at" | "is_featured" | "category";
type SortOrder = "asc" | "desc";

export default function ProjectsPage() {
  const { isDarkMode } = useStore();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);

  // Use the new hooks for backend filtering and pagination
  const {
    data: projectsResponse,
    isPending: loading,
    isFetching: isRefetching,
    error,
  } = useProjectsFiltered({
    category: activeTab,
    search: searchTerm || undefined,
    sortBy: sortField,
    sortOrder: sortOrder,
    page: currentPage,
    limit: itemsPerPage,
  });

  const { data: counts, isPending: countsLoading } = useProjectCounts();

  // Extract data from the paginated response
  const projects = Array.isArray(projectsResponse?.data)
    ? projectsResponse.data
    : [];
  const pagination = projectsResponse?.pagination;

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
    setSortField("created_at");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when tab changes
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when items per page changes
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when search changes
  };

  const hasActiveFilters =
    searchTerm || sortField !== "created_at" || sortOrder !== "desc";

  // Show loading state for counts in tabs
  const tabs = [
    {
      id: "all" as TabType,
      label: "All Projects",
      icon: Layers,
      count: countsLoading ? "..." : counts?.all || 0,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "professional" as TabType,
      label: "Professional",
      icon: Briefcase,
      count: countsLoading ? "..." : counts?.professional || 0,
      gradient: "from-purple-500 to-blue-500",
    },
    {
      id: "personal" as TabType,
      label: "Personal",
      icon: Code,
      count: countsLoading ? "..." : counts?.personal || 0,
      gradient: "from-pink-500 to-purple-500",
    },
  ];

  return (
    <div className={getPageClasses()}>
      {/* SEO Content */}
      <SEOContent page="projects" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Header */}
        <AnimatedSection animation="fadeIn" className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <WorkflowIcon size={40} className="text-purple-500" />
            <h1 className="text-5xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Projects
            </h1>
          </div>
          <p
            className={`text-xl max-w-3xl mx-auto ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Explore my work across professional client projects and personal
            experiments
          </p>
        </AnimatedSection>

        {/* Search and Filter Controls */}
        <AnimatedSection
          animation="slideUp"
          delay={0.2}
          className={`${getCardClasses("rounded-lg p-6 shadow-lg mb-8")}`}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search projects by name, description, or tech stack..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`${getInputClasses(
                    "w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  )}`}
                />
              </div>
            </div>

            {/* Items per page */}
            <div className="min-w-[120px]">
              <Select
                value={itemsPerPage.toString()}
                onChange={(e) =>
                  handleItemsPerPageChange(Number(e.target.value))
                }
                options={[
                  { value: "6", label: "6 per page" },
                  { value: "9", label: "9 per page" },
                  { value: "12", label: "12 per page" },
                  { value: "18", label: "18 per page" },
                ]}
              />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="md"
                onClick={clearFilters}
                icon={<X size={16} />}
              >
                Clear
              </Button>
            )}
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <span
              className={`text-sm font-medium ${colorScheme.text.secondary} flex items-center gap-2`}
            >
              <Filter size={16} />
              Sort by:
            </span>
            {[
              { field: "created_at" as SortField, label: "Date Created" },
              { field: "name" as SortField, label: "Name" },
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

          {/* Results Count */}
          <div className={`mt-4 text-sm ${colorScheme.text.secondary}`}>
            Showing {projects.length} of {pagination?.totalItems || 0} projects
            {hasActiveFilters && " (filtered)"}
            {pagination && (
              <span className="ml-2">
                (Page {pagination.currentPage} of {pagination.totalPages})
              </span>
            )}
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <StaggeredContainer
          className="flex flex-wrap justify-center gap-4 mb-12"
          staggerDelay={0.1}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Button
                key={tab.id}
                variant={isActive ? "gradient" : "outline"}
                size="lg"
                onClick={() => handleTabChange(tab.id)}
                icon={<Icon size={20} />}
                iconPosition="left"
                className="transform hover:scale-105"
              >
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? "bg-white/20" : colorScheme.background.tertiary
                  }`}
                >
                  {tab.count}
                </span>
              </Button>
            );
          })}
        </StaggeredContainer>

        {/* Stats Bar */}
        <AnimatedSection
          animation="slideUp"
          delay={0.4}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
        >
          {[
            {
              label: "Total Projects",
              value: countsLoading ? "..." : counts?.all || 0,
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              label: "Featured",
              value: countsLoading ? "..." : counts?.featured || 0,
              gradient: "from-yellow-500 to-orange-500",
              icon: Star,
            },
            {
              label: "Professional",
              value: countsLoading ? "..." : counts?.professional || 0,
              gradient: "from-purple-500 to-blue-500",
            },
            {
              label: "Personal",
              value: countsLoading ? "..." : counts?.personal || 0,
              gradient: "from-pink-500 to-purple-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`text-center p-4 rounded-xl ${getCardClasses()} border`}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                {stat.icon && (
                  <stat.icon size={18} className="text-yellow-500" />
                )}
                <div
                  className={`text-3xl font-bold bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
              </div>
              <div className={`text-xs ${colorScheme.text.secondary}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </AnimatedSection>

        {/* Projects Grid */}
        {loading || isRefetching ? (
          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            staggerDelay={0.1}
          >
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </StaggeredContainer>
        ) : error ? (
          <AnimatedSection animation="fadeIn" className="text-center py-20">
            <div className={`text-6xl mb-4 ${colorScheme.text.muted}`}>⚠️</div>
            <p className={`text-xl ${colorScheme.text.secondary} mb-4`}>
              Failed to load projects. Please try again.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </AnimatedSection>
        ) : projects.length === 0 ? (
          <AnimatedSection animation="fadeIn" className="text-center py-20">
            <div className={`text-6xl mb-4 ${colorScheme.text.muted}`}>
              {hasActiveFilters ? "🔍" : "📂"}
            </div>
            <p className={`text-xl ${colorScheme.text.secondary}`}>
              {hasActiveFilters
                ? "No projects match your search criteria."
                : `No projects found in "${activeTab}" category.`}
            </p>
            {hasActiveFilters && (
              <Button
                variant="primary"
                size="md"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear Filters
              </Button>
            )}
          </AnimatedSection>
        ) : (
          <>
            <StaggeredContainer
              key={`projects-${activeTab}-${searchTerm}-${sortField}-${sortOrder}-${currentPage}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 enhanced-scrollbar"
              staggerDelay={0.15}
            >
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  id={project.id}
                  slug={project.slug}
                  image={getSafeImageUrl(project.cover_image_url)}
                  name={project.name}
                  techStack={project.tech_stack.join(", ")}
                  description={project.description}
                  link={project.url}
                  isFeatured={project.is_featured}
                />
              ))}
            </StaggeredContainer>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <AnimatedSection
                animation="slideUp"
                delay={0.3}
                className="mt-12"
              >
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={setCurrentPage}
                  itemsPerPage={pagination.pageSize}
                  totalItems={pagination.totalItems}
                />
              </AnimatedSection>
            )}
          </>
        )}
      </div>
    </div>
  );
}
