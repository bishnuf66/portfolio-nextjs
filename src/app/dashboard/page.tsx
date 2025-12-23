"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Project } from "@/lib/supabase";
import useStore from "@/store/store";
import {
  Plus,
  LogOut,
  BarChart3,
  FolderKanban,
  BookOpen,
  MessageSquare,
  FileText,
} from "lucide-react";
import withAuth from "@/components/withAuth";
import { useAuth } from "@/components/AuthProvider";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { useDeleteProject } from "@/hooks/useProjects";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import BlogManager from "@/components/dashboard/BlogManager";
import TestimonialManager from "@/components/dashboard/TestimonialManager";
import ProjectList from "@/components/dashboard/projects/ProjectList";
import CVManager from "@/components/dashboard/CVManager";
import { colorScheme } from "@/utils/colorUtils";

const Dashboard = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isDarkMode } = useStore();
  const { signOut } = useAuth();

  // TanStack Query hooks
  const deleteProject = useDeleteProject();
  const confirm = useConfirm();

  const [activeTab, setActiveTab] = useState<
    "projects" | "analytics" | "blogs" | "testimonials" | "cv"
  >(
    (searchParams?.get("tab") as
      | "projects"
      | "analytics"
      | "blogs"
      | "testimonials"
      | "cv") || "projects"
  );

  const handleEdit = (project: Project) => {
    router.push(`/dashboard/projects/edit/${project.id}`);
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm({
      title: "Delete project",
      message:
        "Are you sure you want to delete this project? This action cannot be undone.",
      confirmText: "Delete",
      confirmVariant: "danger",
    });
    if (!ok) return;
    try {
      await deleteProject.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleAddProject = () => {
    router.push("/dashboard/projects/add");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (false) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${colorScheme.page} p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto pt-16 md:pt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 md:mb-8 gap-4">
          <h1 className="text-2xl md:text-4xl font-bold">Dashboard</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            {activeTab === "projects" && (
              <button
                onClick={handleAddProject}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Project</span>
                <span className="sm:hidden">Add</span>
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors w-full sm:w-auto"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Sign Out</span>
              <span className="sm:hidden">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row border-b border-gray-200 dark:border-gray-700 mb-6 gap-2 sm:gap-0">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base ${
              activeTab === "projects"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <FolderKanban size={16} className="sm:size-18" />
              <span className="hidden sm:inline">Projects</span>
              <span className="sm:hidden">Projects</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base ${
              activeTab === "analytics"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={16} className="sm:size-18" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base ${
              activeTab === "blogs"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="sm:size-18" />
              <span className="hidden sm:inline">Blog Posts</span>
              <span className="sm:hidden">Blog</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base ${
              activeTab === "testimonials"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="sm:size-18" />
              <span className="hidden sm:inline">Testimonials</span>
              <span className="sm:hidden">Reviews</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("cv")}
            className={`px-3 sm:px-4 py-2 font-medium text-sm sm:text-base ${
              activeTab === "cv"
                ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={16} className="sm:size-18" />
              <span className="hidden sm:inline">CV Management</span>
              <span className="sm:hidden">CV</span>
            </div>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "analytics" ? (
          <AnalyticsDashboard />
        ) : activeTab === "blogs" ? (
          <BlogManager />
        ) : activeTab === "testimonials" ? (
          <TestimonialManager />
        ) : activeTab === "cv" ? (
          <CVManager />
        ) : (
          <ProjectList
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};

export default withAuth(Dashboard);
