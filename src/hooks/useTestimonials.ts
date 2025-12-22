import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import { api } from "@/lib/axios";
import { Testimonial } from "@/types/blog";

interface PaginatedResponse {
    data: Testimonial[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

interface TestimonialsQueryParams {
    published?: "all" | "published" | "draft";
    search?: string;
    sortBy?: "name" | "created_at" | "updated_at" | "published" | "rating";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
    rating?: number;
}

// Hook for fetching testimonials with filters and pagination
export function useTestimonialsFiltered(params: TestimonialsQueryParams) {
    const {
        published,
        search,
        sortBy,
        sortOrder,
        page = 1,
        limit = 10,
        rating,
    } = params;

    return useQuery({
        queryKey: [
            "testimonials",
            "filtered",
            published,
            search,
            sortBy,
            sortOrder,
            page,
            limit,
            rating,
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
            if (rating) {
                queryParams.append("rating", rating.toString());
            }
            queryParams.append("page", page.toString());
            queryParams.append("limit", limit.toString());

            const response = await api.get(
                `/testimonials?${queryParams.toString()}`,
            );

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

// Hook for getting testimonial counts by status and rating
export function useTestimonialCounts() {
    return useQuery({
        queryKey: ["testimonials", "counts"],
        queryFn: async () => {
            const [
                allResponse,
                publishedResponse,
                draftResponse,
                fiveStarResponse,
            ] = await Promise.all([
                api.get("/testimonials"),
                api.get("/testimonials?published=true"),
                api.get("/testimonials?published=false"),
                api.get("/testimonials?rating=5"),
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
            const fiveStarData = Array.isArray(fiveStarResponse.data)
                ? fiveStarResponse.data
                : fiveStarResponse.data.data;

            return {
                all: allData.length,
                published: publishedData.length,
                draft: draftData.length,
                fiveStar: fiveStarData.length,
            };
        },
        staleTime: 30 * 1000, // Cache for 30 seconds
        gcTime: 1000 * 60 * 5,
    });
}

export const useTestimonials = (publishedOnly = true) => {
    return useQuery({
        queryKey: ["testimonials", publishedOnly],
        queryFn: async () => {
            let query = getSupabase()
                .from("testimonials")
                .select("*")
                .order("created_at", { ascending: false });

            if (publishedOnly) {
                query = query.eq("published", true);
            }

            const { data, error } = await query;
            if (error) throw error;
            return data as Testimonial[];
        },
    });
};

export const useCreateTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            testimonialData: Omit<
                Testimonial,
                "id" | "created_at" | "updated_at"
            >,
        ) => {
            const { data, error } = await getSupabase()
                .from("testimonials")
                .insert([testimonialData])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            // Invalidate all testimonial-related queries with proper query key patterns
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            queryClient.invalidateQueries({
                queryKey: ["testimonials", "filtered"],
            });
            queryClient.invalidateQueries({
                queryKey: ["testimonials", "counts"],
            });

            // Force immediate refetch to ensure UI updates
            queryClient.refetchQueries({ queryKey: ["testimonials"] });
            queryClient.refetchQueries({
                queryKey: ["testimonials", "filtered"],
            });
            queryClient.refetchQueries({
                queryKey: ["testimonials", "counts"],
            });
        },
    });
};

export const useUpdateTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            id,
            testimonialData,
        }: {
            id: string;
            testimonialData: Partial<Testimonial>;
        }) => {
            const { data, error } = await getSupabase()
                .from("testimonials")
                .update({
                    ...testimonialData,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            // Invalidate all testimonial-related queries with proper query key patterns
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            queryClient.invalidateQueries({
                queryKey: ["testimonials", "filtered"],
            });
            queryClient.invalidateQueries({
                queryKey: ["testimonials", "counts"],
            });

            // Force immediate refetch to ensure UI updates
            queryClient.refetchQueries({ queryKey: ["testimonials"] });
            queryClient.refetchQueries({
                queryKey: ["testimonials", "filtered"],
            });
            queryClient.refetchQueries({
                queryKey: ["testimonials", "counts"],
            });
        },
    });
};

export const useDeleteTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await getSupabase()
                .from("testimonials")
                .delete()
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            // Invalidate all testimonial-related queries with proper query key patterns
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
            queryClient.invalidateQueries({
                queryKey: ["testimonials", "filtered"],
            });
            queryClient.invalidateQueries({
                queryKey: ["testimonials", "counts"],
            });

            // Force immediate refetch to ensure UI updates
            queryClient.refetchQueries({ queryKey: ["testimonials"] });
            queryClient.refetchQueries({
                queryKey: ["testimonials", "filtered"],
            });
            queryClient.refetchQueries({
                queryKey: ["testimonials", "counts"],
            });
        },
    });
};
