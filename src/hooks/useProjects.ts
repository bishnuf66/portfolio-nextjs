import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Project } from "@/lib/supabase";

// Hook for fetching all projects
export function useProjects() {
    return useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await api.get("/projects");
            return response.data as Project[];
        },
    });
}

// Hook for creating a project
export function useCreateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (projectData: Partial<Project>) => {
            const response = await api.post("/projects", projectData);
            return response.data as Project;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error: unknown) => {
            console.error("Project creation failed:", error);
            // Let the component handle the toast notification
        },
    });
}

// Hook for updating a project
export function useUpdateProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            { id, projectData }: { id: string; projectData: Partial<Project> },
        ) => {
            const response = await api.put(`/projects/${id}`, projectData);
            return response.data as Project;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error: unknown) => {
            console.error("Project update failed:", error);
            // Let the component handle the toast notification
        },
    });
}

// Hook for deleting a project
export function useDeleteProject() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            console.log("Attempting to delete project:", id);
            const response = await api.delete(`/projects/${id}`);
            console.log("Delete response:", response.status, response.data);
            return id;
        },
        onSuccess: () => {
            console.log("Delete mutation successful, invalidating cache");
            queryClient.invalidateQueries({ queryKey: ["projects"] });
        },
        onError: (error) => {
            console.error("Delete mutation failed:", error);
        },
    });
}
