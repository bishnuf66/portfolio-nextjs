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
        staleTime: 0, // Always consider data stale to force fresh fetches
        gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
    });
}

// Hook for fetching featured projects
export function useFeaturedProjects() {
    return useQuery({
        queryKey: ["projects", "featured"],
        queryFn: async () => {
            const response = await api.get("/projects?featured=true&limit=6");
            return response.data as Project[];
        },
        staleTime: 0, // Always consider data stale to force fresh fetches
        gcTime: 1000 * 60 * 5, // Keep in cache for 5 minutes
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
            queryClient.invalidateQueries({
                queryKey: ["projects", "featured"],
            });
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
        onSuccess: (updatedProject) => {
            console.log(
                "Update mutation successful, updating cache with:",
                updatedProject,
            );

            // Update the specific project in both caches immediately
            queryClient.setQueryData(
                ["projects"],
                (oldData: Project[] | undefined) => {
                    if (!oldData) return oldData;
                    return oldData.map((project) =>
                        project.id === updatedProject.id
                            ? updatedProject
                            : project
                    );
                },
            );

            // Also update the featured projects cache if this project is featured
            queryClient.setQueryData(
                ["projects", "featured"],
                (oldData: Project[] | undefined) => {
                    if (!oldData) return oldData;

                    // If the updated project is featured, add/update it in featured cache
                    if (updatedProject.is_featured) {
                        const existingIndex = oldData.findIndex((p) =>
                            p.id === updatedProject.id
                        );
                        if (existingIndex >= 0) {
                            // Update existing featured project
                            return oldData.map((project) =>
                                project.id === updatedProject.id
                                    ? updatedProject
                                    : project
                            );
                        } else {
                            // Add new featured project (limit to 6)
                            return [updatedProject, ...oldData].slice(0, 6);
                        }
                    } else {
                        // Remove from featured cache if no longer featured
                        return oldData.filter((p) =>
                            p.id !== updatedProject.id
                        );
                    }
                },
            );

            // Force invalidate and refetch to ensure consistency
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({
                queryKey: ["projects", "featured"],
            });

            // Force refetch immediately
            queryClient.refetchQueries({ queryKey: ["projects"] });
            queryClient.refetchQueries({ queryKey: ["projects", "featured"] });
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
            try {
                const response = await api.delete(`/projects/${id}`);
                console.log("Delete response:", response.status, response.data);
                return id;
            } catch (error: any) {
                // If the project is not found (404), treat it as already deleted
                if (error.response?.status === 404) {
                    console.log(
                        "Project already deleted or not found, treating as success",
                    );
                    return id;
                }
                throw error;
            }
        },
        onSuccess: (deletedId) => {
            console.log("Delete mutation successful, invalidating cache");
            // Invalidate and refetch projects
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({
                queryKey: ["projects", "featured"],
            });

            // Also remove the specific project from cache immediately for better UX
            queryClient.setQueryData(
                ["projects"],
                (oldData: Project[] | undefined) => {
                    if (!oldData) return oldData;
                    return oldData.filter((project) =>
                        project.id !== deletedId
                    );
                },
            );
        },
        onError: (error) => {
            console.error("Delete mutation failed:", error);
        },
    });
}
