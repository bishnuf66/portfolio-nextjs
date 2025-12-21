"use client";

import { getSupabase } from "@/lib/supabase";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import Image from "next/image";
import { Blog } from "@/types/blog";
import { notFound } from "next/navigation";
import useStore from "@/store/store";
import { useEffect, useState } from "react";
import { getPageClasses, colorScheme } from "@/utils/colorUtils";

interface BlogDetailPageProps {
    params: Promise<{ slug: string }>;
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
    const { isDarkMode } = useStore();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [slug, setSlug] = useState<string>("");

    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params;
            setSlug(resolvedParams.slug);
        };
        getParams();
    }, [params]);

    useEffect(() => {
        if (slug) {
            const fetchBlog = async () => {
                try {
                    const supabase = getSupabase();
                    const { data, error } = await supabase
                        .from("blogs")
                        .select("*")
                        .eq("slug", slug)
                        .maybeSingle();

                    if (error) {
                        console.error("Failed to fetch blog:", error);
                        setBlog(null);
                    } else {
                        setBlog(data as Blog | null);
                    }
                } catch (error) {
                    console.error("Error fetching blog:", error);
                    setBlog(null);
                } finally {
                    setLoading(false);
                }
            };
            fetchBlog();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className={getPageClasses()}>
                <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className={colorScheme.text.secondary}>Loading article...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!blog) {
        notFound();
    }

    return (
        <div className={getPageClasses()}>
            <article className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                <AnimatedSection animation="slideRight">
                    <nav aria-label="Breadcrumb">
                        <Link
                            href="/blog"
                            className={`flex items-center gap-2 mb-8 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
                        >
                            <ArrowLeft size={20} />
                            Back to blog
                        </Link>
                    </nav>
                </AnimatedSection>

                <AnimatedSection animation="fadeIn" delay={0.2}>
                    <header>
                        <h1 className={`text-5xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{blog.title}</h1>
                    </header>
                </AnimatedSection>

                <AnimatedSection animation="slideUp" delay={0.3}>
                    <div className={`flex flex-wrap items-center gap-6 mb-8 pb-8 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-300'}`}>
                        <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <User size={20} />
                            <span className="font-medium">{blog.author}</span>
                        </div>
                        <div className={`flex items-center gap-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <Calendar size={20} />
                            <time dateTime={blog.created_at}>
                                {new Date(blog.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </time>
                        </div>
                    </div>
                </AnimatedSection>

                {blog.cover_image_url && (
                    <AnimatedSection animation="scaleIn" delay={0.4}>
                        <figure className="mb-8 rounded-xl overflow-hidden">
                            <Image
                                src={blog.cover_image_url}
                                alt={`Cover image for ${blog.title}`}
                                width={800}
                                height={400}
                                className="w-full h-auto"
                                unoptimized
                            />
                        </figure>
                    </AnimatedSection>
                )}

                {blog.tags && blog.tags.length > 0 && (
                    <StaggeredContainer className="flex flex-wrap gap-2 mb-8" staggerDelay={0.1}>
                        {blog.tags.map((tag, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'}`}
                            >
                                <Tag size={14} className="inline mr-1" />
                                {tag}
                            </span>
                        ))}
                    </StaggeredContainer>
                )}

                <AnimatedSection animation="fadeIn" delay={0.6}>
                    <div className={`prose prose-lg max-w-none ${isDarkMode ? 'prose-invert' : 'prose-gray'}`}>
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
