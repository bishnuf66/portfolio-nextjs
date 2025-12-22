"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import {
  Calendar,
  User,
  BookOpen,
  Search,
  SortAsc,
  SortDesc,
  Filter,
  X,
  Tag,
} from "lucide-react";
import {
  AnimatedSection,
  StaggeredContainer,
} from "@/components/ui/AnimatedSection";
import { Blog } from "@/types/blog";
import useStore from "@/store/store";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import {
  getPageClasses,
  getCardClasses,
  getInputClasses,
  colorScheme,
} from "@/utils/colorUtils";

type SortField = "title" | "created_at" | "author";
type SortOrder = "asc" | "desc";

interface BlogPageClientProps {
  blogs: Blog[];
}

export function BlogPageClient({ blogs }: BlogPageClientProps) {
  const { isDarkMode } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogs.forEach((blog) => {
      if (blog.tags) {
        blog.tags.forEach((tag) => tags.add(tag));
      }
    });
    return Array.from(tags).sort();
  }, [blogs]);

  // Filter and sort blogs
  const filteredBlogs = useMemo(() => {
    const filtered = blogs.filter((blog) => {
      // Search filter
      const matchesSearch =
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.tags &&
          blog.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      // Tag filter
      const matchesTag =
        !selectedTag || (blog.tags && blog.tags.includes(selectedTag));

      return matchesSearch && matchesTag;
    });

    // Sort blogs
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortField) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "created_at":
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        case "author":
          aValue = a.author.toLowerCase();
          bValue = b.author.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [blogs, searchTerm, selectedTag, sortField, sortOrder]);

  const { currentPage, totalPages, paginatedData, goToPage } = usePagination({
    data: filteredBlogs,
    itemsPerPage,
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    // Reset to first page when sorting changes
    goToPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    goToPage(1);
  };

  const handleTagChange = (value: string) => {
    setSelectedTag(value);
    goToPage(1);
  };

  const clearFilters = () => {
    handleSearchChange("");
    handleTagChange("");
    setSortField("created_at");
    setSortOrder("desc");
  };

  const hasActiveFilters =
    searchTerm ||
    selectedTag ||
    sortField !== "created_at" ||
    sortOrder !== "desc";

  return (
    <div className={getPageClasses()}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        {/* Header */}
        <AnimatedSection animation="fadeIn" className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen size={40} className="text-purple-500" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Blog
            </h1>
          </div>
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Thoughts, tutorials, and insights on web development
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
                  placeholder="Search articles by title, content, author, or tags..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className={`${getInputClasses(
                    "w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  )}`}
                />
              </div>
            </div>

            {/* Tag Filter */}
            <div className="min-w-[200px]">
              <select
                value={selectedTag}
                onChange={(e) => handleTagChange(e.target.value)}
                className={`${getInputClasses(
                  "w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                )}`}
              >
                <option value="">All Tags</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Items per page */}
            <div className="min-w-[120px]">
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className={`${getInputClasses(
                  "w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                )}`}
              >
                <option value={6}>6 per page</option>
                <option value={9}>9 per page</option>
                <option value={12}>12 per page</option>
                <option value={18}>18 per page</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className={`flex items-center gap-2 px-4 py-3 transition-colors border rounded-lg ${colorScheme.text.secondary} hover:${colorScheme.text.primary} ${colorScheme.border.primary} hover:${colorScheme.background.tertiary}`}
              >
                <X size={16} />
                Clear
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <div
            className={`flex flex-wrap gap-2 mt-4 pt-4 border-t ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <span
              className={`text-sm font-medium flex items-center gap-2 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Filter size={16} />
              Sort by:
            </span>
            {[
              { field: "created_at" as SortField, label: "Date" },
              { field: "title" as SortField, label: "Title" },
              { field: "author" as SortField, label: "Author" },
            ].map(({ field, label }) => (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sortField === field
                    ? isDarkMode
                      ? "bg-purple-900 text-purple-300"
                      : "bg-purple-100 text-purple-700"
                    : `${colorScheme.text.secondary} hover:${colorScheme.background.tertiary}`
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

          {/* Results Count */}
          <div
            className={`mt-4 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Showing {filteredBlogs.length} of {blogs.length} articles
            {hasActiveFilters && " (filtered)"}
          </div>
        </AnimatedSection>

        {/* Blog Grid */}
        {filteredBlogs.length === 0 ? (
          <AnimatedSection animation="fadeIn" className="text-center py-20">
            <BookOpen
              size={64}
              className={`mx-auto mb-4 ${
                isDarkMode ? "text-gray-600" : "text-gray-400"
              }`}
            />
            <p
              className={`text-xl ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {hasActiveFilters
                ? "No articles match your search criteria."
                : "No blog posts yet. Check back soon!"}
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </AnimatedSection>
        ) : (
          <>
            <StaggeredContainer
              key={`blogs-${sortField}-${sortOrder}-${currentPage}`}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              staggerDelay={0.15}
            >
              {paginatedData.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className={`${getCardClasses(
                    "rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border"
                  )}`}
                >
                  {blog.cover_image_url && (
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={blog.cover_image_url}
                        alt={blog.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    </div>
                  )}
                  <div className="p-6">
                    <h2
                      className={`text-2xl font-bold mb-3 group-hover:text-purple-500 transition-colors ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {blog.title}
                    </h2>
                    <p
                      className={`mb-4 line-clamp-3 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {blog.excerpt}
                    </p>

                    <div
                      className={`flex items-center gap-4 text-sm mb-4 ${
                        isDarkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <User size={16} />
                        <span>{blog.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={16} />
                        <span>
                          {new Date(blog.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    </div>

                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                              isDarkMode
                                ? "bg-purple-900/50 text-purple-200"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            <Tag size={10} />
                            {tag}
                          </span>
                        ))}
                        {blog.tags.length > 3 && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${colorScheme.background.tertiary} ${colorScheme.text.secondary}`}
                          >
                            +{blog.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </StaggeredContainer>

            {/* Pagination */}
            {totalPages > 1 && (
              <AnimatedSection
                animation="slideUp"
                delay={0.3}
                className="mt-12"
              >
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={goToPage}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredBlogs.length}
                />
              </AnimatedSection>
            )}
          </>
        )}
      </div>
    </div>
  );
}
