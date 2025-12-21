import { MetadataRoute } from "next";
import { getSupabase } from "@/lib/supabase";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
        "https://www.bishnubk.com.np";

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/projects`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
    ];

    // Dynamic blog pages
    const supabase = getSupabase();
    const { data: blogs } = await supabase
        .from("blogs")
        .select("slug, created_at, updated_at")
        .eq("published", true);

    const blogPages = blogs?.map((blog) => ({
        url: `${baseUrl}/blog/${blog.slug}`,
        lastModified: new Date(blog.updated_at || blog.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    })) || [];

    // Dynamic project pages
    const { data: projects } = await supabase
        .from("projects")
        .select("slug, created_at, updated_at");

    const projectPages = projects?.map((project) => ({
        url: `${baseUrl}/projects/${project.slug}`,
        lastModified: new Date(project.updated_at || project.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    })) || [];

    return [...staticPages, ...blogPages, ...projectPages];
}
