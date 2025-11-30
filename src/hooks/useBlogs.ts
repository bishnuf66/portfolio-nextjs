import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Blog } from "@/types/blog";

export const useBlogs = (publishedOnly = true) => {
    return useQuery({
        queryKey: ["blogs", publishedOnly],
        queryFn: async () => {
            let query = supabase
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

export const useBlog = (slug: string) => {
    return useQuery({
        queryKey: ["blog", slug],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("blogs")
                .select("*")
                .eq("slug", slug)
                .single();

            if (error) throw error;
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
            const { data, error } = await supabase
                .from("blogs")
                .insert([blogData])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
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
            const { data, error } = await supabase
                .from("blogs")
                .update({ ...blogData, updated_at: new Date().toISOString() })
                .eq("id", id)
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from("blogs").delete().eq(
                "id",
                id,
            );
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
        },
    });
};
