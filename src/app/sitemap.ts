import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = "https://www.bishnubk.com.np";

    // Static routes
    const routes = [
        "",
        "/projects",
        "/projects/professional",
        "/projects/personal",
        "/blog",
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: route === "" ? 1 : 0.8,
    }));

    // Fetch dynamic blog posts
    let blogPosts: any[] = [];
    try {
        const response = await fetch(`${baseUrl}/api/blog`, {
            next: { revalidate: 3600 },
        });
        if (response.ok) {
            blogPosts = await response.json();
        }
    } catch (error) {
        console.error("Error fetching blog posts for sitemap:", error);
    }

    const blogRoutes = blogPosts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    // Fetch dynamic projects
    let projects: any[] = [];
    try {
        const response = await fetch(`${baseUrl}/api/projects`, {
            next: { revalidate: 3600 },
        });
        if (response.ok) {
            projects = await response.json();
        }
    } catch (error) {
        console.error("Error fetching projects for sitemap:", error);
    }

    const projectRoutes = projects.map((project) => ({
        url: `${baseUrl}/projects/${project.id}`,
        lastModified: new Date(project.updated_at || project.created_at),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [...routes, ...blogRoutes, ...projectRoutes];
}
