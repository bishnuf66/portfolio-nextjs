import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/lib/supabase";
import Link from "next/link";
import useStore from "@/store/store";

const ProjectShowcase = () => {
  const { isDarkMode } = useStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const professionalProjects = projects
    .filter((p) => p.category === "professional")
    .slice(0, 6);
  const personalProjects = projects
    .filter((p) => p.category === "personal")
    .slice(0, 6);

  if (loading) {
    return (
      <div id="projects" className="pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="text-xl">Loading projects...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="projects" className="pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Professional Projects Section */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Professional Projects
            </h2>
            <Link
              href="/projects/professional"
              className={`px-4 py-2 rounded-lg transition-colors duration-300  text-nowrap ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {professionalProjects.map((project) => (
              <ProjectCard
                key={project.id}
                image={
                  project.cover_image_url ?? "/project-images/placeholder.png"
                }
                name={project.name}
                techStack={project.tech_stack.join(", ")}
                description={project.description}
                link={project.url}
              />
            ))}
          </div>
        </div>

        {/* Personal Projects Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2
              className={`text-3xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Personal Projects
            </h2>
            <Link
              href="/projects/personal"
              className={`px-4 py-2 rounded-lg transition-colors duration-300 text-nowrap ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {personalProjects.map((project) => (
              <ProjectCard
                key={project.id}
                image={
                  project.cover_image_url ?? "/project-images/placeholder.png"
                }
                name={project.name}
                techStack={project.tech_stack.join(", ")}
                description={project.description}
                link={project.url}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;
