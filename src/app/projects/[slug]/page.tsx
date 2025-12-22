"use client";

import { getSupabase } from "@/lib/supabase";
import { Project } from "@/types/project";
import { ImageCarousel } from "@/components/ui/ImageCarousel";
import { Tabs } from "@/components/ui/AnimatedTabs";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { MovingBorder } from "@/components/ui/MovingBorder";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Tag as TagIcon,
  Code2,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import {
  AnimatedSection,
  StaggeredContainer,
} from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPageClasses,
  getCardClasses,
  colorScheme,
} from "@/utils/colorUtils";
import useStore from "@/store/store";
import { useEffect, useState } from "react";

interface ProjectDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { isDarkMode } = useStore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setSlug(resolvedParams.slug);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (slug) {
      const fetchProject = async () => {
        try {
          const supabase = getSupabase();
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("slug", slug)
            .maybeSingle();

          if (error) {
            console.error("Failed to fetch project:", error);
            setProject(null);
          } else {
            setProject(data as Project | null);
          }
        } catch (error) {
          console.error("Error fetching project:", error);
          setProject(null);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [slug]);

  if (!mounted) {
    return (
      <div className={getPageClasses()}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={getPageClasses()}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className={colorScheme.text.secondary}>Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np";
  const projectUrl = `${baseUrl}/projects/${slug}`;

  // Structured data for the project
  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: project.description.replace(/<[^>]*>/g, ""),
    url: projectUrl,
    image: project.cover_image_url || `${baseUrl}/coding2.webp`,
    author: {
      "@type": "Person",
      name: "Bishnu BK",
      url: baseUrl,
    },
    creator: {
      "@type": "Person",
      name: "Bishnu BK",
      url: baseUrl,
    },
    dateCreated: project.created_at,
    dateModified: project.updated_at || project.created_at,
    genre: project.category,
    keywords: project.tech_stack.join(", "),
    mainEntity: {
      "@type": "SoftwareApplication",
      name: project.name,
      applicationCategory: "WebApplication",
      operatingSystem: "Web Browser",
      url: project.url,
    },
    isPartOf: {
      "@type": "WebSite",
      name: "Bishnu BK Portfolio",
      url: baseUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projects",
        item: `${baseUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.name,
        item: projectUrl,
      },
    ],
  };

  // Get gallery images with titles, fallback to legacy format
  const getGalleryImages = () => {
    if (
      project.gallery_images_with_titles &&
      project.gallery_images_with_titles.length > 0
    ) {
      return project.gallery_images_with_titles;
    }
    // Fallback to legacy format
    return (project.gallery_images || []).map((url) => ({ url, title: "" }));
  };

  const galleryImagesWithTitles = getGalleryImages();
  const allImages = [
    project.cover_image_url || "/project-images/placeholder.png",
    ...galleryImagesWithTitles.map((img) => img.url),
  ];

  const tabs = [
    {
      title: "Overview",
      value: "overview",
      content: (
        <div className="space-y-6">
          <div>
            <h3
              className={`text-2xl font-bold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              About This Project
            </h3>
            <div
              className={`text-lg leading-relaxed prose prose-lg max-w-none ${
                isDarkMode
                  ? "prose-invert text-gray-300"
                  : "prose-gray text-gray-700"
              }`}
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <BackgroundGradient className="rounded-[22px] p-1">
              <div
                className={`p-6 rounded-[20px] ${
                  isDarkMode ? "bg-gray-900" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <h4
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Timeline
                  </h4>
                </div>
                <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
                  Created:{" "}
                  {project.created_at
                    ? new Date(project.created_at).toLocaleDateString()
                    : "Unknown"}
                </p>
              </div>
            </BackgroundGradient>

            <BackgroundGradient className="rounded-[22px] p-1">
              <div
                className={`p-6 rounded-[20px] ${
                  isDarkMode ? "bg-gray-900" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <TagIcon className="w-5 h-5 text-purple-500" />
                  <h4
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Category
                  </h4>
                </div>
                <p
                  className={`capitalize ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
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
            className={`text-2xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Technologies Used
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {project.tech_stack.map((tech, index) => (
              <BackgroundGradient key={index} className="rounded-[22px] p-1">
                <div
                  className={`p-4 rounded-[20px] text-center ${
                    isDarkMode ? "bg-black" : "bg-white"
                  }`}
                >
                  <Code2 className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p
                    className={`font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
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
            className={`text-2xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
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
                      alt={
                        imageWithTitle.title ||
                        `${project.name} - Gallery ${index + 1}`
                      }
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  {imageWithTitle.title && (
                    <div
                      className={`p-3 ${
                        isDarkMode ? "bg-gray-800" : "bg-gray-100"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${
                          isDarkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        {imageWithTitle.title}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p
              className={`text-center py-12 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className={getPageClasses()}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <AnimatedSection animation="slideRight">
            <nav aria-label="Breadcrumb">
              <Link href="/projects">
                <Button
                  variant="outline"
                  size="md"
                  icon={<ArrowLeft className="w-5 h-5" />}
                  className="mb-8"
                >
                  Back to Projects
                </Button>
              </Link>
            </nav>
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
                    className={`text-xl prose prose-xl max-w-none ${
                      isDarkMode
                        ? "prose-invert text-gray-300"
                        : "prose-gray text-gray-700"
                    }`}
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>

                <div className="flex gap-4">
                  {project.url && (
                    <MovingBorder
                      as="a"
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      duration={3000}
                      className="px-6 py-3 rounded-full flex items-center gap-2"
                      aria-label={`Visit ${project.name} project`}
                    >
                      <ExternalLink className="w-5 h-5" />
                      Visit Project
                    </MovingBorder>
                  )}
                </div>
              </div>
            </AnimatedSection>

            {/* Tech Stack Badges */}
            <StaggeredContainer
              className="flex flex-wrap gap-2 mb-8"
              staggerDelay={0.1}
            >
              {project.tech_stack.map((tech, index) => (
                <Tag key={index} variant="blog" size="md">
                  {tech}
                </Tag>
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
            <div
              className={`mt-16 p-8 rounded-2xl text-center ${
                isDarkMode ? "bg-gray-900" : "bg-gray-100"
              }`}
            >
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
              <h3
                className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Interested in Similar Projects?
              </h3>
              <p
                className={`mb-6 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Check out more of my work or get in touch to discuss your
                project
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/#projects">
                  <Button variant="primary" size="md">
                    View All Projects
                  </Button>
                </Link>
                <Link href="/#contact">
                  <Button variant="outline" size="md">
                    Contact Me
                  </Button>
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </>
  );
}
