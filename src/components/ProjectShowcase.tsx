import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/lib/supabase";
import Link from "next/link";
import useStore from "@/store/store";
import { ProjectCardSkeleton } from "./LoadingSkeleton";

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
          <div className="mb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-bold mb-2 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Professional Projects
                </h2>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Client work and production applications
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
              {[1, 2, 3].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-bold mb-2 bg-linear-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Personal Projects
                </h2>
                <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Side projects and experiments
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
              {[1, 2, 3].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="projects" className="pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Professional Projects Section */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h2
                className={`text-4xl font-bold mb-2 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent`}
              >
                Professional Projects
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Client work and production applications
              </p>
            </div>
            <Link
              href="/projects/professional"
              className={`px-6 py-3 rounded-full transition-all duration-300 text-nowrap font-semibold ${isDarkMode
                ? "bg-linear-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 text-white"
                : "bg-linear-to-r from-blue-500 to-purple-500 hover:shadow-lg hover:shadow-blue-500/50 text-white"
                }`}
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
            {professionalProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-4">
            <div>
              <h2
                className={`text-4xl font-bold mb-2 bg-linear-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent`}
              >
                Personal Projects
              </h2>
              <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Side projects and experiments
              </p>
            </div>
            <Link
              href="/projects/personal"
              className={`px-6 py-3 rounded-full transition-all duration-300 text-nowrap font-semibold ${isDarkMode
                ? "bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-pink-500/50 text-white"
                : "bg-linear-to-r from-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 text-white"
                }`}
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
            {personalProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
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
