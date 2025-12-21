import { getSupabase } from "@/lib/supabase";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { Blog } from "@/types/blog";
import { notFound } from "next/navigation";

export const revalidate = 3600; // Revalidate every hour

async function getBlog(slug: string): Promise<Blog | null> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
        console.error("Failed to fetch blog:", error);
        return null;
    }

    return data as Blog | null;
}

async function getAllBlogSlugs(): Promise<string[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from("blogs")
        .select("slug")
        .eq("published", true);

    if (error) {
        console.error("Failed to fetch blog slugs:", error);
        return [];
    }

    return data.map((item) => item.slug);
}

export async function generateStaticParams() {
    const slugs = await getAllBlogSlugs();
    return slugs.map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        return {
            title: "Blog Post Not Found",
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com";
    const blogUrl = `${baseUrl}/blog/${slug}`;

    return {
        title: blog.title,
        description: blog.excerpt,
        keywords: blog.tags?.join(", ") || "blog, article",
        authors: [{ name: blog.author }],
        openGraph: {
            title: blog.title,
            description: blog.excerpt,
            url: blogUrl,
            type: "article",
            publishedTime: blog.created_at,
            authors: [blog.author],
            tags: blog.tags || [],
            images: blog.cover_image_url ? [
                {
                    url: blog.cover_image_url,
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                    type: "image/jpeg",
                }
            ] : [],
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description: blog.excerpt,
            images: blog.cover_image_url ? [blog.cover_image_url] : [],
        },
        canonical: blogUrl,
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

export default async function BlogDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const blog = await getBlog(slug);

    if (!blog) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-20">
            <article className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                <AnimatedSection animation="slideRight">
                    <Link
                        href="/blog"
                        className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Back to blog
                    </Link>
                </AnimatedSection>

                <AnimatedSection animation="fadeIn" delay={0.2}>
                    <h1 className="text-5xl font-bold mb-6">{blog.title}</h1>
                </AnimatedSection>

                <AnimatedSection animation="slideUp" delay={0.3}>
                    <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-700">
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
                                className="px-3 py-1 rounded-full text-sm font-medium bg-blue-900 text-blue-200"
                            >
                                <Tag size={14} className="inline mr-1" />
                                {tag}
                            </span>
                        ))}
                    </StaggeredContainer>
                )}

                <AnimatedSection animation="fadeIn" delay={0.6}>
                    <div className="prose prose-invert prose-lg max-w-none">
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
