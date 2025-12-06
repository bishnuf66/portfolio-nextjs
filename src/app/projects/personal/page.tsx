"use client";
import React from "react";
import ProjectCard from "@/components/ProjectCard";
import { personalProjects } from "@/utils/projects";
import useStore from "@/store/store";
import Design from "@/components/Design";

const PersonalProjects = () => {
  const { isDarkMode } = useStore();

  return (
    <>
      <Design id="tsparticles-personal" />
      <div
        className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 pt-20 ${isDarkMode ? "bg-black" : "bg-white"
          } `}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1
              className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Personal Projects
            </h1>
            <p
              className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
            >
              A collection of my personal projects and experiments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {personalProjects.map((project, index) => (
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
    </>
  );
};

export default PersonalProjects;
