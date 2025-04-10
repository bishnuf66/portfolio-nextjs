import React from "react";
import ProjectCard from "./ProjectCard";
import { professionalProjects, personalProjects } from "@/utils/projects";
import Link from "next/link";
import useStore from "@/store/store";

const ProjectShowcase = () => {
  const { isDarkMode } = useStore();
  const displayedProfessionalProjects = professionalProjects.slice(0, 6);
  const displayedPersonalProjects = personalProjects.slice(0, 6);

  return (
    <div id="projects" className="py-12 px-4 sm:px-6 lg:px-8">
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
            {displayedProfessionalProjects.map((project, index) => (
              <ProjectCard
                key={index}
                image={project.image}
                name={project.name}
                techStack={project.techStack.join(", ")}
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
            {displayedPersonalProjects.map((project, index) => (
              <ProjectCard
                key={index}
                image={project.image}
                name={project.name}
                techStack={project.techStack.join(", ")}
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
