import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export interface CVDocument {
    id: string;
    filename: string;
    original_filename: string;
    file_url: string;
    file_size: number;
    mime_type: string;
    is_active: boolean;
    uploaded_at: string;
    updated_at: string;
}

// Hook for fetching all CV documents (dashboard)
export function useCVDocuments() {
    return useQuery({
        queryKey: ["cv", "documents"],
        queryFn: async () => {
            const response = await api.get("/cv");
            return response.data as CVDocument[];
        },
        staleTime: 0, // Always consider data stale to force fresh fetches
        gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
}

// Hook for fetching active CV (frontend)
export function useActiveCV() {
    return useQuery({
        queryKey: ["cv", "active"],
        queryFn: async () => {
            const response = await api.get("/cv/active");
            return response.data as CVDocument;
        },
        staleTime: 0, // Always consider data stale to force fresh fetches
        gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        retry: (failureCount, error: any) => {
            // Don't retry if CV not found (404)
            if (error?.response?.status === 404) {
                return false;
            }
            return failureCount < 3;
        },
    });
}

// Hook for uploading CV
export function useUploadCV() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const response = await api.post("/cv/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data as CVDocument;
        },
        onSuccess: () => {
            // Invalidate both CV queries
            queryClient.invalidateQueries({ queryKey: ["cv"] });
            // Force refetch immediately
            queryClient.refetchQueries({ queryKey: ["cv"] });
        },
        onError: (error: unknown) => {
            console.error("CV upload failed:", error);
        },
    });
}

// Hook for setting active CV
export function useSetActiveCV() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.patch(`/cv/${id}/activate`);
            return response.data as CVDocument;
        },
        onSuccess: () => {
            // Invalidate both CV queries
            queryClient.invalidateQueries({ queryKey: ["cv"] });
            // Force refetch immediately
            queryClient.refetchQueries({ queryKey: ["cv"] });
        },
        onError: (error: unknown) => {
            console.error("CV activation failed:", error);
        },
    });
}

// Hook for deleting CV
export function useDeleteCV() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const response = await api.delete(`/cv/${id}`);
            return id;
        },
        onSuccess: () => {
            // Invalidate both CV queries
            queryClient.invalidateQueries({ queryKey: ["cv"] });
            // Force refetch immediately
            queryClient.refetchQueries({ queryKey: ["cv"] });
        },
        onError: (error: unknown) => {
            console.error("CV deletion failed:", error);
        },
    });
}
