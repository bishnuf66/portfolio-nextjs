"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useStore from "@/store/store";
import { useProjects, useUpdateProject } from "@/hooks/useProjects";
import withAuth from "@/components/withAuth";
import ProjectFormPage from "@/components/dashboard/projects/ProjectFormPage";

const EditProjectPage = () => {
    const router = useRouter();
    const params = useParams();
    const { isDarkMode } = useStore();
    const { data: projects = [] } = useProjects();
    const updateProject = useUpdateProject();
    const [uploading, setUploading] = useState(false);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        const project = projects.find((p) => p.id === params.id);
        if (project) {
            setInitialData(project);
        }
    }, [projects, params.id]);

    const handleSubmit = async (projectData: any) => {
        setUploading(true);
        try {
            await updateProject.mutateAsync({
                id: params.id as string,
                projectData,
            });
            router.push("/dashboard");
        } catch (error) {
            console.error("Failed to update project:", error);
            alert("Failed to update project");
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
