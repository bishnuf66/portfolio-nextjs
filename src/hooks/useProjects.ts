import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Project } from "@/lib/supabase";

interface PaginatedResponse {
    data: Project[];
    pagination: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalItems: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}

interface ProjectsQueryParams {
    category?: "all" | "professional" | "personal";
    search?: string;
    sortBy?: "name" | "created_at" | "is_featured" | "category" | "updated_at";
    sortOrder?: "asc" | "desc";
    page?: number;
    limit?: number;
    featured?: boolean;
}

// Hook for fetching all projects (no pagination)
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

// Hook for fetching projects with filters and pagination
export function useProjectsFiltered(params: ProjectsQueryParams) {
    const {
        category,
        search,
        sortBy,
        sortOrder,
        page = 1,
        limit = 10,
        featured,
    } = params;

    return useQuery({
        queryKey: [
            "projects",
            "filtered",
            category || "all",
            search || "",
            sortBy || "",
            sortOrder || "",
            page,
            limit,
            featured,
        ],
        queryFn: async () => {
            const queryParams = new URLSearchParams();

            // Always append category for clarity, even if it's "all"
            if (category && category !== "all") {
                queryParams.append("category", category);
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
            if (featured !== undefined) {
                queryParams.append("featured", featured.toString());
            }
            queryParams.append("page", page.toString());
            queryParams.append("limit", limit.toString());

            const response = await api.get(
                `/projects?${queryParams.toString()}`,
            );
            return response.data as PaginatedResponse;
        },
        staleTime: 1000, // 1 second
        gcTime: 1000 * 60 * 5,
        refetchOnMount: true,
        refetchOnWindowFocus: false,
    });
}

// Hook for getting project counts by category
export function useProjectCounts() {
    return useQuery({
        queryKey: ["projects", "counts"],
        queryFn: async () => {
            const [
                allResponse,
                professionalResponse,
                personalResponse,
                featuredResponse,
            ] = await Promise.all([
                api.get("/projects"),
                api.get("/projects?category=professional"),
                api.get("/projects?category=personal"),
                api.get("/projects?featured=true"),
            ]);

            // Handle both array and paginated response formats
            const getLength = (data: unknown) => {
                if (Array.isArray(data)) {
                    return data.length;
                }
                if (
                    data && typeof data === "object" && "data" in data &&
                    Array.isArray((data as { data: unknown }).data)
                ) {
                    return (data as { data: unknown[] }).data.length;
                }
                return 0;
            };

            return {
                all: getLength(allResponse.data),
                professional: getLength(professionalResponse.data),
                personal: getLength(personalResponse.data),
                featured: getLength(featuredResponse.data),
            };
        },
        staleTime: 30 * 1000, // Cache for 30 seconds
        gcTime: 1000 * 60 * 5,
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
            // Invalidate all project-related queries with proper query key patterns
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({
                queryKey: ["projects", "featured"],
            });
            queryClient.invalidateQueries({
                queryKey: ["projects", "filtered"],
            });
            queryClient.invalidateQueries({ queryKey: ["projects", "counts"] });

            // Force immediate refetch to ensure UI updates
            queryClient.refetchQueries({ queryKey: ["projects"] });
            queryClient.refetchQueries({ queryKey: ["projects", "featured"] });
            queryClient.refetchQueries({ queryKey: ["projects", "filtered"] });
            queryClient.refetchQueries({ queryKey: ["projects", "counts"] });
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
            queryClient.invalidateQueries({
                queryKey: ["projects", "filtered"],
            });
            queryClient.invalidateQueries({ queryKey: ["projects", "counts"] });

            // Force refetch immediately
            queryClient.refetchQueries({ queryKey: ["projects"] });
            queryClient.refetchQueries({ queryKey: ["projects", "featured"] });
            queryClient.refetchQueries({ queryKey: ["projects", "filtered"] });
            queryClient.refetchQueries({ queryKey: ["projects", "counts"] });
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
            try {
                const response = await api.delete(`/projects/${id}`);
                console.log("Delete response:", response.status, response.data);
                return id;
            } catch (error: unknown) {
                // If the project is not found (404), treat it as already deleted
                if (
                    error && typeof error === "object" && "response" in error &&
                    (error as { response?: { status?: number } }).response
                            ?.status === 404
                ) {
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

            // Invalidate all project-related queries with proper query key patterns
            queryClient.invalidateQueries({ queryKey: ["projects"] });
            queryClient.invalidateQueries({
                queryKey: ["projects", "featured"],
            });
            queryClient.invalidateQueries({
                queryKey: ["projects", "filtered"],
            });
            queryClient.invalidateQueries({ queryKey: ["projects", "counts"] });

            // Force immediate refetch to ensure UI updates
            queryClient.refetchQueries({ queryKey: ["projects"] });
            queryClient.refetchQueries({ queryKey: ["projects", "featured"] });
            queryClient.refetchQueries({ queryKey: ["projects", "filtered"] });
            queryClient.refetchQueries({ queryKey: ["projects", "counts"] });

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
        onError: (error: unknown) => {
            console.error("Delete mutation failed:", error);
        },
    });
}
