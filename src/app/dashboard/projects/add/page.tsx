"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { useCreateProject } from "@/hooks/useProjects";
import withAuth from "@/components/withAuth";
import ProjectFormPage from "@/components/dashboard/projects/ProjectFormPage";

const AddProjectPage = () => {
    const router = useRouter();
    const { isDarkMode } = useStore();
    const createProject = useCreateProject();
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (projectData: any) => {
        setUploading(true);
        try {
            await createProject.mutateAsync(projectData);
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Failed to create project");
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
