import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Testimonial } from "@/types/blog";

export const useTestimonials = (publishedOnly = true) => {
    return useQuery({
        queryKey: ["testimonials", publishedOnly],
        queryFn: async () => {
            let query = supabase
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
            const { data, error } = await supabase
                .from("testimonials")
                .insert([testimonialData])
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
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
            const { data, error } = await supabase
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
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
};

export const useDeleteTestimonial = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase
                .from("testimonials")
                .delete()
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["testimonials"] });
        },
    });
};
