import React from "react";
import ProjectCard from "./ProjectCard";
import { professionalProjects } from "@/utils/projects";

const Projects = () => {
  professionalProjects;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-6 w-full">
      {professionalProjects.map((project, index) => (
        <ProjectCard
          key={index}
          image={project.image}
          name={project.name}
          techStack={project.techStack}
          description={project.description}
          link={project.url}
        />
      ))}
    </div>
  );
};

export default Projects;
