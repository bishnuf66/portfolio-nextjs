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
            description: "The requested blog post could not be found.",
            robots: {
                index: false,
                follow: false,
            },
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np";
    const blogUrl = `${baseUrl}/blog/${slug}`;

    // Truncate description to optimal length
    const description = blog.excerpt && blog.excerpt.length > 160
        ? blog.excerpt.substring(0, 157) + "..."
        : blog.excerpt || "Read this insightful article on web development and programming.";

    return {
        title: `${blog.title} | Blog`,
        description,
        keywords: [
            ...(blog.tags || []),
            "blog",
            "article",
            "web development",
            "programming",
            "tutorial"
        ],
        authors: [{ name: blog.author, url: baseUrl }],
        creator: blog.author,
        publisher: "Bishnu BK",
        category: "Technology",
        openGraph: {
            title: blog.title,
            description,
            url: blogUrl,
            type: "article",
            locale: "en_US",
            siteName: "Bishnu BK Portfolio",
            publishedTime: blog.created_at,
            modifiedTime: blog.updated_at || blog.created_at,
            authors: [blog.author],
            section: "Technology",
            tags: blog.tags || [],
            images: blog.cover_image_url ? [
                {
                    url: blog.cover_image_url,
                    width: 1200,
                    height: 630,
                    alt: `${blog.title} - Cover Image`,
                    type: "image/jpeg",
                }
            ] : [
                {
                    url: `${baseUrl}/coding2.png`,
                    width: 1200,
                    height: 630,
                    alt: blog.title,
                    type: "image/png",
                }
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description,
            creator: "@bishnubk",
            site: "@bishnubk",
            images: blog.cover_image_url ? [
                {
                    url: blog.cover_image_url,
                    alt: `${blog.title} - Cover Image`,
                }
            ] : [
                {
                    url: `${baseUrl}/coding2.png`,
                    alt: blog.title,
                }
            ],
        },
        alternates: {
            canonical: blogUrl,
        },
        robots: {
            index: true,
            follow: true,
            nocache: true,
            googleBot: {
                index: true,
                follow: true,
                "max-snippet": -1,
                "max-image-preview": "large",
                "max-video-preview": -1,
            },
        },
        other: {
            "article:author": blog.author,
            "article:published_time": blog.created_at,
            "article:modified_time": blog.updated_at || blog.created_at,
            "article:section": "Technology",
            "article:tag": blog.tags?.join(", ") || "",
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

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np";
    const blogUrl = `${baseUrl}/blog/${slug}`;

    // Structured data for the blog article
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.excerpt,
        image: blog.cover_image_url || `${baseUrl}/coding2.png`,
        author: {
            "@type": "Person",
            name: blog.author,
            url: baseUrl,
        },
        publisher: {
            "@type": "Person",
            name: "Bishnu BK",
            url: baseUrl,
        },
        datePublished: blog.created_at,
        dateModified: blog.updated_at || blog.created_at,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": blogUrl,
        },
        url: blogUrl,
        keywords: blog.tags?.join(", ") || "blog, article, web development",
        articleSection: "Technology",
        wordCount: blog.content ? blog.content.replace(/<[^>]*>/g, '').split(' ').length : 0,
        inLanguage: "en-US",
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
                name: "Blog",
                item: `${baseUrl}/blog`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: blog.title,
                item: blogUrl,
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />

            <div className="min-h-screen bg-gray-900 text-white pt-20">
                <article className="max-w-4xl mx-auto px-4 md:px-8 py-16">
                    <AnimatedSection animation="slideRight">
                        <nav aria-label="Breadcrumb">
                            <Link
                                href="/blog"
                                className="flex items-center gap-2 mb-8 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={20} />
                                Back to blog
                            </Link>
                        </nav>
                    </AnimatedSection>

                    <AnimatedSection animation="fadeIn" delay={0.2}>
                        <header>
                            <h1 className="text-5xl font-bold mb-6">{blog.title}</h1>
                        </header>
                    </AnimatedSection>

                    <AnimatedSection animation="slideUp" delay={0.3}>
                        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-700">
                            <div className="flex items-center gap-2">
                                <User size={20} />
                                <span className="font-medium">{blog.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
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
                                <img
                                    src={blog.cover_image_url}
                                    alt={`Cover image for ${blog.title}`}
                                    className="w-full h-auto"
                                />
                            </figure>
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
        </>
    );
}
