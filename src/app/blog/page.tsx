import Link from "next/link";
import { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import { Calendar, User, BookOpen } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/AnimatedSection";
import { Blog } from "@/types/blog";

export const revalidate = 3600; // Revalidate every hour

export const metadata: Metadata = {
    title: "Blog | Articles on Web Development",
    description: "Read my latest articles, tutorials, and insights on web development, Next.js, React, and modern web technologies. Stay updated with the latest trends and best practices.",
    keywords: [
        "blog",
        "web development",
        "Next.js",
        "React",
        "JavaScript",
        "TypeScript",
        "tutorials",
        "programming articles",
        "tech blog",
        "development insights",
        "coding tutorials",
        "frontend development",
        "backend development",
        "full-stack development"
    ],
    authors: [{ name: "Bishnu BK", url: "https://www.bishnubk.com.np" }],
    creator: "Bishnu BK",
    publisher: "Bishnu BK",
    openGraph: {
        title: "Blog | Articles on Web Development",
        description: "Read my latest articles, tutorials, and insights on web development, Next.js, React, and modern web technologies. Stay updated with the latest trends and best practices.",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/blog`,
        type: "website",
        locale: "en_US",
        siteName: "Bishnu BK Portfolio",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/coding2.png`,
                width: 1200,
                height: 630,
                alt: "Bishnu BK Blog - Web Development Articles and Tutorials",
                type: "image/png",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog | Articles on Web Development",
        description: "Read my latest articles, tutorials, and insights on web development, Next.js, React, and modern web technologies.",
        creator: "@bishnubk",
        site: "@bishnubk",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/coding2.png`,
                alt: "Bishnu BK Blog - Web Development Articles",
            }
        ],
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
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/blog`,
        types: {
            "application/rss+xml": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/blog/rss.xml`,
        },
    },
};

async function getBlogs(): Promise<Blog[]> {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to fetch blogs:", error);
        return [];
    }

    return data as Blog[];
}

export default async function BlogPage() {
    const blogs = await getBlogs();

    return (
        <div className="min-h-screen bg-gray-900 text-white pt-20">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <AnimatedSection animation="fadeIn" className="text-center mb-16">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <BookOpen size={40} className="text-purple-500" />
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Blog
                        </h1>
                    </div>
                    <p className="text-xl text-gray-300">
                        Thoughts, tutorials, and insights on web development
                    </p>
                </AnimatedSection>

                {blogs.length === 0 ? (
                    <AnimatedSection animation="fadeIn" className="text-center py-20">
                        <BookOpen size={64} className="mx-auto mb-4 text-gray-600" />
                        <p className="text-xl text-gray-400">
                            No blog posts yet. Check back soon!
                        </p>
                    </AnimatedSection>
                ) : (
                    <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.15}>
                        {blogs.map((blog) => (
                            <Link
                                key={blog.id}
                                href={`/blog/${blog.slug}`}
                                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group"
                            >
                                {blog.cover_image_url && (
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={blog.cover_image_url}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    </div>
                                )}
                                <div className="p-6">
                                    <h2 className="text-2xl font-bold mb-3 group-hover:text-blue-500 transition-colors text-white">
                                        {blog.title}
                                    </h2>
                                    <p className="mb-4 line-clamp-3 text-gray-300">
                                        {blog.excerpt}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm mb-4 text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <User size={16} />
                                            <span>{blog.author}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar size={16} />
                                            <span>
                                                {new Date(blog.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>

                                    {blog.tags && blog.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {blog.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 rounded-full text-xs font-medium bg-blue-900 text-blue-200"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </StaggeredContainer>
                )}
            </div>
        </div>
    );
}
