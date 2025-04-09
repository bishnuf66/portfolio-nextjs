import React from "react";
import ProjectCard from "./ProjectCard";
import { professionalProjects } from "@/utils/projects";
import useStore from "@/store/store";

const Projects = () => {
  const { isDarkMode } = useStore();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className={`text-4xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            My Projects
          </h2>
          <p
            className={`text-xl ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            A showcase of my work and technical expertise
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {professionalProjects.map((project, index) => (
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
  );
};

export default Projects;
