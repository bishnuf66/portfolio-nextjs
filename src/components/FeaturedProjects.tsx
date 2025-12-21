"use client";

import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/lib/supabase";
import Link from "next/link";
import useStore from "@/store/store";
import { ProjectCardSkeleton } from "./LoadingSkeleton";
import { Sparkles } from "lucide-react";
import { getSafeImageUrl } from "@/utils/imageUtils";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/AnimatedSection";

const FeaturedProjects = () => {
    const { isDarkMode } = useStore();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    // Track featured projects section view
    React.useEffect(() => {
        if (!loading && projects.length > 0) {
            import("@/lib/analytics").then(({ trackSectionInteraction }) => {
                trackSectionInteraction("featured-projects", "view", {
                    projectCount: projects.length,
                    featuredCount: projects.filter(p => p.is_featured).length
                });
            });
        }
    }, [loading, projects]);

    useEffect(() => {
        fetchFeaturedProjects();
    }, []);

    const fetchFeaturedProjects = async () => {
        try {
            const response = await fetch("/api/projects?featured=true&limit=6");
            const data = await response.json();
            setProjects(data);
        } catch (error) {
            console.error("Failed to fetch featured projects:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <ProjectCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (projects.length === 0) {
        return (
            <div className="text-center py-20">
                <p className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    No featured projects yet.
                </p>
            </div>
        );
    }

    return (
        <AnimatedSection animation="fadeIn" duration={0.8}>
            <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.15}>
                {projects.map((project) => (
                    <ProjectCard
                        key={project.id}
                        id={project.id}
                        image={getSafeImageUrl(project.cover_image_url)}
                        name={project.name}
                        techStack={project.tech_stack.join(", ")}
                        description={project.description}
                        link={project.url}
                    />
                ))}
            </StaggeredContainer>

            <AnimatedSection
                animation="slideUp"
                delay={0.4}
                className="text-center mt-12"
            >
                <Link
                    href="/projects"
                    className={`inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${isDarkMode
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 text-white"
                        : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/50 text-white"
                        }`}
                >
                    <Sparkles size={20} />
                    View All Projects
                </Link>
            </AnimatedSection>
        </AnimatedSection>
    );
};

export default FeaturedProjects;
