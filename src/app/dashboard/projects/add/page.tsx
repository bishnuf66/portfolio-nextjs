"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { useCreateProject } from "@/hooks/useProjects";
import withAuth from "@/components/withAuth";
import ProjectFormPage from "@/components/dashboard/projects/ProjectFormPage";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Project } from "@/lib/supabase";

const AddProjectPage = () => {
  const router = useRouter();
  const { isDarkMode } = useStore();
  const createProject = useCreateProject();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (projectData: Partial<Project>) => {
    setUploading(true);
    try {
      await createProject.mutateAsync(projectData);
      toast.success("Project created successfully!");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Failed to create project:", error);

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
          toast.error("You are not authorized to create this project.");
        } else if (error.response?.status === 429) {
          toast.error("Too many requests. Please try again later.");
        } else {
          toast.error("Failed to create project. Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <ProjectFormPage
      onSubmit={handleSubmit}
      onCancel={() => router.push("/dashboard")}
      uploading={uploading}
      isDarkMode={isDarkMode}
    />
  );
};

export default withAuth(AddProjectPage);
