"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useStore from "@/store/store";
import { useProjects, useUpdateProject } from "@/hooks/useProjects";
import withAuth from "@/components/withAuth";
import ProjectFormPage, { ProjectData } from "@/components/dashboard/projects/ProjectFormPage";
import { Project } from "@/lib/supabase";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

const EditProjectPage = () => {
  const router = useRouter();
  const params = useParams();
  const { isDarkMode } = useStore();
  const { data: projects = [] } = useProjects();
  const updateProject = useUpdateProject();
  const [uploading, setUploading] = useState(false);
  const [initialData, setInitialData] = useState<(ProjectData & { id?: string }) | null>(null);

  useEffect(() => {
    const project = projects.find((p) => p.id === params.id);
    if (project) {
      // Convert Project type to match ProjectData expectations
      const projectData = {
        ...project,
        is_featured: project.is_featured ?? false, // Convert null/undefined to false
        cover_image_url: project.cover_image_url ?? "", // Convert null to empty string
        gallery_images: project.gallery_images ?? [], // Convert null to empty array
      };
      setInitialData(projectData);
    }
  }, [projects, params.id]);

  const handleSubmit = async (projectData: Partial<Project>) => {
    setUploading(true);
    try {
      await updateProject.mutateAsync({
        id: params.id as string,
        projectData,
      });
      toast.success("Project updated successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Failed to update project:", error);

      // Handle different error types
      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          const errorData = error.response.data;
          if (errorData.details && Array.isArray(errorData.details)) {
            toast.error(`Validation failed: ${errorData.details.join(", ")}`);
          } else {
            toast.error(
              errorData.error || "Validation failed. Please check your input."
            );
          }
        } else if (error.response?.status === 401) {
          toast.error("You are not authorized to update this project.");
        } else if (error.response?.status === 429) {
          toast.error("Too many requests. Please try again later.");
        } else {
          toast.error("Failed to update project. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <ProjectFormPage
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/dashboard")}
      uploading={uploading}
      isDarkMode={isDarkMode}
    />
  );
};

export default withAuth(EditProjectPage);
