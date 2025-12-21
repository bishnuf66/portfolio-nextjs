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
import {
  useProjects,
  useDeleteProject,
} from "@/hooks/useProjects";
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
  const { data: projects = [], isLoading } = useProjects();
  const deleteProject = useDeleteProject();

  const [activeTab, setActiveTab] = useState<
    "projects" | "analytics" | "blogs" | "testimonials" | "cv"
  >((searchParams?.get("tab") as any) || "projects");




  const handleEdit = (project: Project) => {
    router.push(`/dashboard/projects/edit/${project.id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleAddProject = () => {
    router.push("/dashboard/projects/add");
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${colorScheme.page} p-8`}
    >
      <div className="max-w-7xl mx-auto pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            {activeTab === "projects" && (
              <button
                onClick={handleAddProject}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} />
                Add Project
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 font-medium ${activeTab === "projects"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
          >
            <div className="flex items-center gap-2">
              <FolderKanban size={18} />
              Projects
            </div>
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-4 py-2 font-medium ${activeTab === "analytics"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 size={18} />
              Analytics
            </div>
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-4 py-2 font-medium ${activeTab === "blogs"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              Blog Posts
            </div>
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`px-4 py-2 font-medium ${activeTab === "testimonials"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              Testimonials
            </div>
          </button>
          <button
            onClick={() => setActiveTab("cv")}
            className={`px-4 py-2 font-medium ${activeTab === "cv"
              ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              CV Management
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
            projects={projects}
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
