"use client";

import React, { useState, useEffect } from "react";
import useStore from "@/store/store";
import { Briefcase, Code, Layers, Star } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/lib/supabase";
import { ProjectCardSkeleton } from "@/components/LoadingSkeleton";

type TabType = "all" | "professional" | "personal";

export default function ProjectsPage() {
    const { isDarkMode } = useStore();
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

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

    const filteredProjects = projects.filter((project) => {
        if (activeTab === "all") return true;
        return project.category === activeTab;
    });

    const professionalCount = projects.filter((p) => p.category === "professional").length;
    const personalCount = projects.filter((p) => p.category === "personal").length;

    const tabs = [
        {
            id: "all" as TabType,
            label: "All Projects",
            icon: Layers,
            count: projects.length,
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            id: "professional" as TabType,
            label: "Professional",
            icon: Briefcase,
            count: professionalCount,
            gradient: "from-purple-500 to-blue-500",
        },
        {
            id: "personal" as TabType,
            label: "Personal",
            icon: Code,
            count: personalCount,
            gradient: "from-pink-500 to-purple-500",
        },
    ];

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                } pt-20`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <TextGenerateEffect words="My Projects" />
                    </h1>
                    <p
                        className={`text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                    >
                        Explore my work across professional client projects and personal experiments
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
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
                </div>

                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
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
                </div>

                {/* Projects Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <ProjectCardSkeleton key={i} />
                        ))}
                    </div>
                ) : filteredProjects.length === 0 ? (
                    <div className="text-center py-20">
                        <div
                            className={`text-6xl mb-4 ${isDarkMode ? "text-gray-700" : "text-gray-300"
                                }`}
                        >
                            📂
                        </div>
                        <p
                            className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            No projects found in this category.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    id={project.id}
                                    image={project.cover_image_url ?? "/project-images/placeholder.png"}
                                    name={project.name}
                                    techStack={project.tech_stack.join(", ")}
                                    description={project.description}
                                    link={project.url}
                                    isFeatured={project.is_featured}
                                />
                            ))}
                        </div>

                        {/* Project Count */}
                        <div className="text-center mt-12">
                            <p
                                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                    }`}
                            >
                                Showing {filteredProjects.length} {activeTab === "all" ? "" : activeTab}{" "}
                                {filteredProjects.length === 1 ? "project" : "projects"}
                            </p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
