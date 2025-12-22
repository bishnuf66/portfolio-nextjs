import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import { api } from "@/lib/axios";
import { Blog } from "@/types/blog";

interface PaginatedResponse {
    data: Blog[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

interface BlogsQueryParams {
    published?: "all" | "published" | "draft";
    search?: string;
    sortBy?: "title" | "created_at" | "updated_at" | "published" | "author";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
    author?: string;
}

export const useBlogs = (publishedOnly = true) => {
    return useQuery({
        queryKey: ["blogs", publishedOnly],
        queryFn: async () => {
            let query = getSupabase()
                .from("blogs")
                .select("*")
                .order("created_at", { ascending: false });

            if (publishedOnly) {
                query = query.eq("published", true);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as Blog[];
        },
    });
};

// Hook for fetching blogs with filters and pagination
export function useBlogsFiltered(params: BlogsQueryParams) {
    const {
        published,
        search,
        sortBy,
        sortOrder,
        page = 1,
        limit = 10,
        author,
    } = params;

    return useQuery({
        queryKey: [
            "blogs",
            "filtered",
            published,
            search,
            sortBy,
            sortOrder,
            page,
            limit,
            author,
        ],
        queryFn: async () => {
            const queryParams = new URLSearchParams();

            if (published && published !== "all") {
                queryParams.append(
                    "published",
                    published === "published" ? "true" : "false",
                );
            }
            if (search) {
                queryParams.append("search", search);
            }
            if (sortBy) {
                queryParams.append("sortBy", sortBy);
            }
            if (sortOrder) {
                queryParams.append("sortOrder", sortOrder);
            }
            if (author) {
                queryParams.append("author", author);
            }
            queryParams.append("page", page.toString());
            queryParams.append("limit", limit.toString());

            const response = await api.get(`/blogs?${queryParams.toString()}`);

            // Handle both array and object response formats
            return Array.isArray(response.data)
                ? { data: response.data, pagination: null }
                : response.data as PaginatedResponse;
        },
        staleTime: 0,
        gcTime: 1000 * 60 * 5,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}

// Hook for getting blog counts by status
export function useBlogCounts() {
    return useQuery({
        queryKey: ["blogs", "counts"],
        queryFn: async () => {
            const [
                allResponse,
                publishedResponse,
                draftResponse,
            ] = await Promise.all([
                api.get("/blogs"),
                api.get("/blogs?published=true"),
                api.get("/blogs?published=false"),
            ]);

            const allData = Array.isArray(allResponse.data)
                ? allResponse.data
                : allResponse.data.data;
            const publishedData = Array.isArray(publishedResponse.data)
                ? publishedResponse.data
                : publishedResponse.data.data;
            const draftData = Array.isArray(draftResponse.data)
                ? draftResponse.data
                : draftResponse.data.data;

            return {
                all: allData.length,
                published: publishedData.length,
                draft: draftData.length,
            };
        },
        staleTime: 30 * 1000, // Cache for 30 seconds
        gcTime: 1000 * 60 * 5,
    });
}

export const useBlog = (slug: string) => {
    return useQuery({
        queryKey: ["blog", slug],
        queryFn: async () => {
            const { data, error } = await getSupabase()
                .from("blogs")
                .select("*")
                .eq("slug", slug)
                .maybeSingle(); // Use maybeSingle() instead of single() to handle empty results

            if (error) throw error;
            if (!data) return null; // Return null if no blog found
            return data as Blog;
        },
        enabled: !!slug,
    });
};

export const useCreateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            blogData: Omit<Blog, "id" | "created_at" | "updated_at">,
        ) => {
            const { data, error } = await getSupabase()
                .from("blogs")
                .insert([blogData])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            // Invalidate all blog-related queries with proper query key patterns
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            queryClient.invalidateQueries({ queryKey: ["blogs", "filtered"] });
            queryClient.invalidateQueries({ queryKey: ["blogs", "counts"] });

            // Force immediate refetch to ensure UI updates
            queryClient.refetchQueries({ queryKey: ["blogs"] });
            queryClient.refetchQueries({ queryKey: ["blogs", "filtered"] });
            queryClient.refetchQueries({ queryKey: ["blogs", "counts"] });
        },
    });
};

export const useUpdateBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            blogData,
        }: {
            id: string;
            blogData: Partial<Blog>;
        }) => {
            const { data, error } = await getSupabase()
                .from("blogs")
                .update({ ...blogData, updated_at: new Date().toISOString() })
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            // Invalidate all blog-related queries with proper query key patterns
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            queryClient.invalidateQueries({ queryKey: ["blogs", "filtered"] });
            queryClient.invalidateQueries({ queryKey: ["blogs", "counts"] });

            // Force immediate refetch to ensure UI updates
            queryClient.refetchQueries({ queryKey: ["blogs"] });
            queryClient.refetchQueries({ queryKey: ["blogs", "filtered"] });
            queryClient.refetchQueries({ queryKey: ["blogs", "counts"] });
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await getSupabase().from("blogs").delete().eq(
                "id",
                id,
            );
            if (error) throw error;
        },
        onSuccess: () => {
            // Invalidate all blog-related queries with proper query key patterns
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            queryClient.invalidateQueries({ queryKey: ["blogs", "filtered"] });
            queryClient.invalidateQueries({ queryKey: ["blogs", "counts"] });

            // Force immediate refetch to ensure UI updates
            queryClient.refetchQueries({ queryKey: ["blogs"] });
            queryClient.refetchQueries({ queryKey: ["blogs", "filtered"] });
            queryClient.refetchQueries({ queryKey: ["blogs", "counts"] });
        },
    });
};
