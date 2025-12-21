"use client";

import React, { useState, useEffect, useMemo } from "react";
import useStore from "@/store/store";
import { Briefcase, Code, Layers, Star, Search, SortAsc, SortDesc, Filter, X } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/lib/supabase";
import { ProjectCardSkeleton } from "@/components/LoadingSkeleton";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";
import { getSafeImageUrl } from "@/utils/imageUtils";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/AnimatedSection";

type TabType = "all" | "professional" | "personal";
type SortField = "name" | "created_at" | "is_featured";
type SortOrder = "asc" | "desc";

export default function ProjectsPage() {
    const { isDarkMode } = useStore();
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortField, setSortField] = useState<SortField>("created_at");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [itemsPerPage, setItemsPerPage] = useState(6);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch("/api/projects");
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = useMemo(() => {
        const filtered = projects.filter((project) => {
            // Tab filter
            const matchesTab = activeTab === "all" || project.category === activeTab;

            // Search filter
            const matchesSearch =
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.tech_stack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));

            return matchesTab && matchesSearch;
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
    }, [projects, activeTab, searchTerm, sortField, sortOrder]);

    const {
        currentPage,
        totalPages,
        paginatedData,
        goToPage,
    } = usePagination({
        data: filteredProjects,
        itemsPerPage,
    });

    const professionalCount = projects.filter((p) => p.category === "professional").length;
    const personalCount = projects.filter((p) => p.category === "personal").length;

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
        setSortField("created_at");
        setSortOrder("desc");
    };

    const hasActiveFilters = searchTerm || sortField !== "created_at" || sortOrder !== "desc";

    const tabs = [
        {
            id: "all" as TabType,
            label: "All Projects",
            icon: Layers,
            count: filteredProjects.length,
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            id: "professional" as TabType,
            label: "Professional",
            icon: Briefcase,
            count: filteredProjects.filter(p => p.category === "professional").length,
            gradient: "from-purple-500 to-blue-500",
        },
        {
            id: "personal" as TabType,
            label: "Personal",
            icon: Code,
            count: filteredProjects.filter(p => p.category === "personal").length,
            gradient: "from-pink-500 to-purple-500",
        },
    ];

    return (
        <div
            className={`min-h-screen pt-20 ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                {/* Header */}
                <AnimatedSection animation="fadeIn" className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <TextGenerateEffect words="My Projects" />
                    </h1>
                    <p
                        className={`text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                    >
                        Explore my work across professional client projects and personal experiments
                    </p>
                </AnimatedSection>

                {/* Search and Filter Controls */}
                <AnimatedSection animation="slideUp" delay={0.2} className={`${isDarkMode ? "bg-gray-800" : "bg-white"} rounded-lg p-6 shadow-lg mb-8`}>
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search projects by name, description, or tech stack..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg ${isDarkMode
                                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                />
                            </div>
                        </div>

                        {/* Items per page */}
                        <div className="min-w-[120px]">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                className={`w-full px-3 py-3 border rounded-lg ${isDarkMode
                                    ? "bg-gray-700 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                                className="flex items-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                        Showing {filteredProjects.length} of {projects.length} projects
                        {hasActiveFilters && " (filtered)"}
                    </div>
                </AnimatedSection>

                {/* Tabs */}
                <StaggeredContainer className="flex flex-wrap justify-center gap-4 mb-12" staggerDelay={0.1}>
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${isActive
                                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg`
                                    : isDarkMode
                                        ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{tab.label}</span>
                                <span
                                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${isActive
                                        ? "bg-white/20"
                                        : isDarkMode
                                            ? "bg-gray-700"
                                            : "bg-gray-200"
                                        }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </StaggeredContainer>

                {/* Stats Bar */}
                <AnimatedSection animation="slideUp" delay={0.4} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
                    {[
                        { label: "Total Projects", value: projects.length, gradient: "from-blue-500 to-cyan-500" },
                        {
                            label: "Featured",
                            value: projects.filter((p) => p.is_featured).length,
                            gradient: "from-yellow-500 to-orange-500",
                            icon: Star,
                        },
                        { label: "Professional", value: professionalCount, gradient: "from-purple-500 to-blue-500" },
                        { label: "Personal", value: personalCount, gradient: "from-pink-500 to-purple-500" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className={`text-center p-4 rounded-xl ${isDarkMode ? "bg-gray-800/50" : "bg-white"
                                } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                        >
                            <div className="flex items-center justify-center gap-2 mb-1">
                                {stat.icon && <stat.icon size={18} className="text-yellow-500" />}
                                <div
                                    className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                                >
                                    {stat.value}
                                </div>
                            </div>
                            <div
                                className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                    }`}
                            >
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </AnimatedSection>

                {/* Projects Grid */}
                {loading ? (
                    <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.1}>
                        {Array.from({ length: itemsPerPage }).map((_, i) => (
                            <ProjectCardSkeleton key={i} />
                        ))}
                    </StaggeredContainer>
                ) : filteredProjects.length === 0 ? (
                    <AnimatedSection animation="fadeIn" className="text-center py-20">
                        <div
                            className={`text-6xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"
                                }`}
                        >
                            {hasActiveFilters ? "🔍" : "📂"}
                        </div>
                        <p
                            className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            {hasActiveFilters
                                ? "No projects match your search criteria."
                                : "No projects found in this category."
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
                    </AnimatedSection>
                ) : (
                    <>
                        <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 enhanced-scrollbar" staggerDelay={0.15}>
                            {paginatedData.map((project) => (
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
                        <AnimatedSection animation="slideUp" delay={0.3} className="mt-12">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={goToPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={filteredProjects.length}
                            />
                        </AnimatedSection>
                    </>
                )}
            </div>
        </div >
    );
}