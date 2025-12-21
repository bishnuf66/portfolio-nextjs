"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useStore from "@/store/store";
import { Project } from "@/types/project";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { Tabs } from "@/components/ui/AnimatedTabs";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { MovingBorder } from "@/components/ui/MovingBorder";
import { ImageModal } from "@/components/ui/ImageModal";
import {
    ArrowLeft,
    ExternalLink,
    Github,
    Calendar,
    Tag,
    Code2,
    Sparkles,
    Maximize2,
} from "lucide-react";
import Image from "next/image";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/AnimatedSection";

export default function ProjectDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isDarkMode } = useStore();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        fetchProject();
    }, [params.id]);

    useEffect(() => {
        if (project && project.id) {
            // Track project view
            import("@/lib/analytics").then(({ trackProjectView }) => {
                trackProjectView(project.id!);
            });
        }
    }, [project]);

    const fetchProject = async () => {
        try {
            const response = await fetch(`/api/projects/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setProject(data);
            } else {
                router.push("/");
            }
        } catch (error) {
            console.error("Failed to fetch project:", error);
            router.push("/");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-black" : "bg-gray-50"
                    }`}
            >
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p
                        className={`text-xl ${isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Loading project...
                    </p>
                </div>
            </div>
        );
    }

    if (!project) {
        return null;
    }

    // Get gallery images with titles, fallback to legacy format
    const getGalleryImages = () => {
        if (project.gallery_images_with_titles && project.gallery_images_with_titles.length > 0) {
            return project.gallery_images_with_titles;
        }
        // Fallback to legacy format
        return (project.gallery_images || []).map(url => ({ url, title: "" }));
    };

    const galleryImagesWithTitles = getGalleryImages();
    const allImages = [
        project.cover_image_url || "/project-images/placeholder.png",
        ...galleryImagesWithTitles.map(img => img.url),
    ];

    const tabs = [
        {
            title: "Overview",
            value: "overview",
            content: (
                <div className="space-y-6">
                    <div>
                        <h3
                            className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                                }`}
                        >
                            About This Project
                        </h3>
                        <div
                            className={`text-lg leading-relaxed prose prose-lg max-w-none ${isDarkMode ? "prose-invert text-gray-300" : "text-gray-600"
                                }`}
                            dangerouslySetInnerHTML={{ __html: project.description }}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <BackgroundGradient className="rounded-[22px] p-1">
                            <div
                                className={`p-6 rounded-[20px] ${isDarkMode ? "bg-black" : "bg-white"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    <h4
                                        className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        Timeline
                                    </h4>
                                </div>
                                <p
                                    className={`${isDarkMode ? "text-gray-300" : "text-gray-600"
                                        }`}
                                >
                                    Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : "Unknown"}
                                </p>
                            </div>
                        </BackgroundGradient>

                        <BackgroundGradient className="rounded-[22px] p-1">
                            <div
                                className={`p-6 rounded-[20px] ${isDarkMode ? "bg-black" : "bg-white"
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <Tag className="w-5 h-5 text-purple-500" />
                                    <h4
                                        className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        Category
                                    </h4>
                                </div>
                                <p
                                    className={`capitalize ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                        }`}
                                >
                                    {project.category}
                                </p>
                            </div>
                        </BackgroundGradient>
                    </div>
                </div>
            ),
        },
        {
            title: "Tech Stack",
            value: "tech",
            content: (
                <div className="space-y-6">
                    <h3
                        className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Technologies Used
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {project.tech_stack.map((tech, index) => (
                            <BackgroundGradient key={index} className="rounded-[22px] p-1">
                                <div
                                    className={`p-4 rounded-[20px] text-center ${isDarkMode ? "bg-black" : "bg-white"
                                        }`}
                                >
                                    <Code2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                    <p
                                        className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {tech}
                                    </p>
                                </div>
                            </BackgroundGradient>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            title: "Gallery",
            value: "gallery",
            content: (
                <div className="space-y-6">
                    <h3
                        className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        Project Gallery
                    </h3>
                    {galleryImagesWithTitles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleryImagesWithTitles.map((imageWithTitle, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-2xl overflow-hidden group cursor-pointer"
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <div className="relative h-64">
                                        <Image
                                            src={imageWithTitle.url}
                                            alt={imageWithTitle.title || `${project.name} - Gallery ${index + 1}`}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                                            <Maximize2 className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        </div>
                                    </div>
                                    {imageWithTitle.title && (
                                        <div className={`p-3 ${isDarkMode ? "bg-gray-800" : "bg-white"}`}>
                                            <p className={`text-sm font-medium ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>
                                                {imageWithTitle.title}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p
                            className={`text-center py-12 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                }`}
                        >
                            No additional images available
                        </p>
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <ImageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                images={galleryImagesWithTitles.map(img => img.url)}
                currentIndex={currentImageIndex}
                onNavigate={setCurrentImageIndex}
                alt={project.name}
            />

            <div
                className={`min-h-screen ${isDarkMode ? "bg-black" : "bg-gray-50"} pt-20`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Back Button */}
                    <AnimatedSection animation="slideRight">
                        <button
                            onClick={() => router.back()}
                            className={`flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-all ${isDarkMode
                                ? "text-gray-300 hover:text-white hover:bg-gray-800"
                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Projects
                        </button>
                    </AnimatedSection>

                    {/* Hero Section */}
                    <div className="mb-12">
                        <AnimatedSection animation="fadeIn" delay={0.2}>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                <div>
                                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                        {project.name}
                                    </h1>
                                    <div
                                        className={`text-xl prose prose-xl max-w-none ${isDarkMode ? "prose-invert text-gray-300" : "text-gray-600"
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: project.description }}
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <MovingBorder
                                        as="a"
                                        href={project.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        duration={3000}
                                        className="px-6 py-3 rounded-full flex items-center gap-2"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        Visit Project
                                    </MovingBorder>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Tech Stack Badges */}
                        <StaggeredContainer className="flex flex-wrap gap-2 mb-8" staggerDelay={0.1}>
                            {project.tech_stack.map((tech, index) => (
                                <span
                                    key={index}
                                    className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode
                                        ? "bg-linear-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30"
                                        : "bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200"
                                        }`}
                                >
                                    {tech}
                                </span>
                            ))}
                        </StaggeredContainer>
                    </div>

                    {/* Image Carousel */}
                    <AnimatedSection animation="scaleIn" delay={0.4} className="mb-12">
                        <ImageCarousel images={allImages} alt={project.name} />
                    </AnimatedSection>

                    {/* Tabs Section */}
                    <AnimatedSection animation="slideUp" delay={0.5} className="mb-12">
                        <Tabs
                            tabs={tabs}
                            containerClassName="mb-8"
                            activeTabClassName="bg-linear-to-r from-blue-500 to-purple-600"
                        />
                    </AnimatedSection>

                    {/* Call to Action */}
                    <AnimatedSection animation="fadeIn" delay={0.6}>
                        <div
                            className={`mt-16 p-8 rounded-2xl text-center ${isDarkMode ? "bg-gray-900" : "bg-white"
                                }`}
                        >
                            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                            <h3
                                className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                Interested in Similar Projects?
                            </h3>
                            <p
                                className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                            >
                                Check out more of my work or get in touch to discuss your project
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <button
                                    onClick={() => router.push("/#projects")}
                                    className={`px-6 py-3 rounded-full font-semibold transition-all ${isDarkMode
                                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                        }`}
                                >
                                    View All Projects
                                </button>
                                <button
                                    onClick={() => router.push("/#contact")}
                                    className={`px-6 py-3 rounded-full font-semibold border-2 transition-all ${isDarkMode
                                        ? "border-gray-700 text-white hover:bg-gray-800"
                                        : "border-gray-300 text-gray-900 hover:bg-gray-100"
                                        }`}
                                >
                                    Contact Me
                                </button>
                            </div>
                        </div>
                    </AnimatedSection>
                </div>
            </div>
        </>
    );
}
