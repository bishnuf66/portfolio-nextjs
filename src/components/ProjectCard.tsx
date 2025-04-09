import React from "react";
import useStore from "@/store/store";

interface ProjectCardProps {
  image: string;
  name: string;
  techStack: string;
  description: string;
  link: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  image,
  name,
  techStack,
  description,
  link,
}) => {
  const { isDarkMode } = useStore();

  return (
    <div className="group relative">
      <div
        className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        {/* Project Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className={`p-6 ${isDarkMode ? "text-white" : "text-gray-800"}`}>
          <h3 className="text-xl font-bold mb-2">{name}</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {techStack.split(",").map((tech: string, index: number) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-sm ${
                  isDarkMode
                    ? "bg-gray-700 text-gray-200"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {tech.trim()}
              </span>
            ))}
          </div>
          <p
            className={`text-sm mb-4 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {description}
          </p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-300 ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            View Project
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
