import { Suspense } from "react";
import { getSupabase } from "@/lib/supabase";
import { Blog } from "@/types/blog";
import { BlogPageClient } from "@/components/BlogPageClient";

export const revalidate = 3600; // Revalidate every hour

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
        <Suspense fallback={
            <div className="min-h-screen pt-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-300">Loading articles...</p>
                    </div>
                </div>
            </div>
        }>
            <BlogPageClient blogs={blogs} />
        </Suspense>
    );
}
