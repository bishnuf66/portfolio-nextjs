import React from "react";
import { supabasePublic } from "@/lib/supabase-public";
import { Project } from "@/types/project";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { Tabs } from "@/components/ui/AnimatedTabs";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { MovingBorder } from "@/components/ui/MovingBorder";
import {
    ArrowLeft,
    ExternalLink,
    Calendar,
    Tag,
    Code2,
    Sparkles,
} from "lucide-react";
import Image from "next/image";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Revalidate every hour

async function getProject(slug: string): Promise<Project | null> {
    try {
        const { data, error } = await supabasePublic()
            .from("projects")
            .select("*")
            .eq("slug", slug)
            .maybeSingle();

        if (error) {
            console.error("Failed to fetch project:", error);
            return null;
        }

        return data as Project | null;
    } catch (error) {
        console.error("Error fetching project:", error);
        return null;
    }
}

async function getAllProjectSlugs(): Promise<string[]> {
    try {
        const { data, error } = await supabasePublic()
            .from("projects")
            .select("slug");

        if (error || !data) {
            console.error("Failed to fetch project slugs:", error);
            return [];
        }

        return data.map((item: { slug: string }) => item.slug);
    } catch (error) {
        console.error("Error fetching project slugs:", error);
        return [];
    }
}

export async function generateStaticParams() {
    const slugs = await getAllProjectSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        return {
            title: "Project Not Found",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";
    const projectUrl = `${baseUrl}/projects/${slug}`;
    const description = project.description.replace(/<[^>]*>/g, "").substring(0, 160);

    return {
        title: `${project.name} | Portfolio Project`,
        description: description,
        keywords: [...project.tech_stack, project.category, "portfolio", "project"].join(", "),
        authors: [{ name: "Your Name" }],
        openGraph: {
            title: project.name,
            description: description,
            url: projectUrl,
            type: "website",
            images: project.cover_image_url ? [
                {
                    url: project.cover_image_url,
                    width: 1200,
                    height: 630,
                    alt: project.name,
                    type: "image/jpeg",
                }
            ] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: project.name,
            description: description,
            images: project.cover_image_url ? [project.cover_image_url] : [],
        },
        canonical: projectUrl,
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-snippet": -1,
                "max-image-preview": "large",
                "max-video-preview": -1,
            },
        },
    };
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = await getProject(slug);

    if (!project) {
        notFound();
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
                        <h3 className="text-2xl font-bold mb-4 text-white">
                            About This Project
                        </h3>
                        <div
                            className="text-lg leading-relaxed prose prose-lg max-w-none prose-invert text-gray-300"
                            dangerouslySetInnerHTML={{ __html: project.description }}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <BackgroundGradient className="rounded-[22px] p-1">
                            <div className="p-6 rounded-[20px] bg-black">
                                <div className="flex items-center gap-3 mb-3">
                                    <Calendar className="w-5 h-5 text-blue-500" />
                                    <h4 className="font-semibold text-white">
                                        Timeline
                                    </h4>
                                </div>
                                <p className="text-gray-300">
                                    Created: {project.created_at ? new Date(project.created_at).toLocaleDateString() : "Unknown"}
                                </p>
                            </div>
                        </BackgroundGradient>

                        <BackgroundGradient className="rounded-[22px] p-1">
                            <div className="p-6 rounded-[20px] bg-black">
                                <div className="flex items-center gap-3 mb-3">
                                    <Tag className="w-5 h-5 text-purple-500" />
                                    <h4 className="font-semibold text-white">
                                        Category
                                    </h4>
                                </div>
                                <p className="capitalize text-gray-300">
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
                    <h3 className="text-2xl font-bold mb-4 text-white">
                        Technologies Used
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {project.tech_stack.map((tech, index) => (
                            <BackgroundGradient key={index} className="rounded-[22px] p-1">
                                <div className="p-4 rounded-[20px] text-center bg-black">
                                    <Code2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                                    <p className="font-semibold text-white">
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
                    <h3 className="text-2xl font-bold mb-4 text-white">
                        Project Gallery
                    </h3>
                    {galleryImagesWithTitles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {galleryImagesWithTitles.map((imageWithTitle, index) => (
                                <div
                                    key={index}
                                    className="relative rounded-2xl overflow-hidden group"
                                >
                                    <div className="relative h-64">
                                        <Image
                                            src={imageWithTitle.url}
                                            alt={imageWithTitle.title || `${project.name} - Gallery ${index + 1}`}
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    {imageWithTitle.title && (
                                        <div className="p-3 bg-gray-800">
                                            <p className="text-sm font-medium text-gray-200">
                                                {imageWithTitle.title}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center py-12 text-gray-400">
                            No additional images available
                        </p>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-black pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back Button */}
                <AnimatedSection animation="slideRight">
                    <Link
                        href="/projects"
                        className="flex items-center gap-2 mb-8 px-4 py-2 rounded-lg transition-all text-gray-300 hover:text-white hover:bg-gray-800"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Projects
                    </Link>
                </AnimatedSection>

                {/* Hero Section */}
                <div className="mb-12">
                    <AnimatedSection animation="fadeIn" delay={0.2}>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    {project.name}
                                </h1>
                                <div
                                    className="text-xl prose prose-xl max-w-none prose-invert text-gray-300"
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
                                className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30"
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
                        activeTabClassName="bg-gradient-to-r from-blue-500 to-purple-600"
                    />
                </AnimatedSection>

                {/* Call to Action */}
                <AnimatedSection animation="fadeIn" delay={0.6}>
                    <div className="mt-16 p-8 rounded-2xl text-center bg-gray-900">
                        <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                        <h3 className="text-2xl font-bold mb-4 text-white">
                            Interested in Similar Projects?
                        </h3>
                        <p className="mb-6 text-gray-300">
                            Check out more of my work or get in touch to discuss your project
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                href="/#projects"
                                className="px-6 py-3 rounded-full font-semibold transition-all bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                View All Projects
                            </Link>
                            <Link
                                href="/#contact"
                                className="px-6 py-3 rounded-full font-semibold border-2 transition-all border-gray-700 text-white hover:bg-gray-800"
                            >
                                Contact Me
                            </Link>
                        </div>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
}
