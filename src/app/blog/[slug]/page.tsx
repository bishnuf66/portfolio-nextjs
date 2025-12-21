"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import useStore from "@/store/store";
import { useBlog } from "@/hooks/useBlogs";
import { BlogDetailSkeleton } from "@/components/LoadingSkeleton";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/AnimatedSection";

export default function BlogDetailPage() {
    const { isDarkMode } = useStore();
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { data: blog, isLoading, error } = useBlog(slug);

    // Track blog view
    React.useEffect(() => {
        if (blog && blog.id) {
            import("@/lib/analytics").then(({ trackSectionInteraction }) => {
                trackSectionInteraction("blog-post", "view", {
                    blogId: blog.id,
                    blogTitle: blog.title,
                    blogSlug: slug,
                });
            });
        }
    }, [blog, slug]);

    if (isLoading) {
        return (
            <div
                className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                    }`}
            >
                <BlogDetailSkeleton />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div
                className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                    } flex items-center justify-center`}
            >
                <AnimatedSection animation="fadeIn" className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Blog post not found</h1>
                    <button
                        onClick={() => router.push("/blog")}
                        className="text-blue-500 hover:underline"
                    >
                        Back to blog
                    </button>
                </AnimatedSection>
            </div>
        );
    }

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                } pt-20`}
        >
            <article className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                <AnimatedSection animation="slideRight">
                    <button
                        onClick={() => router.push("/blog")}
                        className={`flex items-center gap-2 mb-8 ${isDarkMode
                            ? "text-gray-400 hover:text-white"
                            : "text-gray-600 hover:text-gray-900"
                            } transition-colors`}
                    >
                        <ArrowLeft size={20} />
                        Back to blog
                    </button>
                </AnimatedSection>

                <AnimatedSection animation="fadeIn" delay={0.2}>
                    <h1 className="text-5xl font-bold mb-6">{blog.title}</h1>
                </AnimatedSection>

                <AnimatedSection animation="slideUp" delay={0.3}>
                    <div
                        className={`flex flex-wrap items-center gap-6 mb-8 pb-8 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <User size={20} />
                            <span className="font-medium">{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={20} />
                            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </AnimatedSection>

                {blog.cover_image_url && (
                    <AnimatedSection animation="scaleIn" delay={0.4}>
                        <div className="mb-8 rounded-xl overflow-hidden">
                            <img
                                src={blog.cover_image_url}
                                alt={blog.title}
                                className="w-full h-auto"
                            />
                        </div>
                    </AnimatedSection>
                )}

                {blog.tags && blog.tags.length > 0 && (
                    <StaggeredContainer className="flex flex-wrap gap-2 mb-8" staggerDelay={0.1}>
                        {blog.tags.map((tag, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode
                                    ? "bg-blue-900 text-blue-200"
                                    : "bg-blue-100 text-blue-800"
                                    }`}
                            >
                                <Tag size={14} className="inline mr-1" />
                                {tag}
                            </span>
                        ))}
                    </StaggeredContainer>
                )}

                <AnimatedSection animation="fadeIn" delay={0.6}>
                    <div
                        className={`prose ${isDarkMode ? "prose-invert" : ""
                            } prose-lg max-w-none`}
                    >
                        <div
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                            className="whitespace-pre-wrap"
                        />
                    </div>
                </AnimatedSection>
            </article>
        </div>
    );
}
