import React from "react";
import useStore from "@/store/store";
const ProjectCard = ({ image, name, techStack, description, link }) => {
  const { isDarkMode } = useStore();
  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative w-72 h-96 transform-style-preserve-3d transition-all duration-700 hover:rotate-y-180 group">
        {/* Front of the card */}
        <div
          className={`absolute inset-0 backface-hidden rounded-lg shadow-lg transition-all duration-700 ${
            isDarkMode ? "bg-gray-800" : "bg-gray-100"
          }`}
        >
          <img
            src={image}
            alt={name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          <div
            className={`flex flex-col justify-center items-center p-4 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            <h3 className="text-xl font-bold">{name}</h3>
            <p className="text-sm">{techStack}</p>
          </div>
        </div>

        {/* Back of the card */}
        <div
          className={`absolute inset-0 backface-hidden rounded-lg shadow-lg p-6 flex flex-col justify-between rotate-y-180 transition-all duration-700 ${
            isDarkMode ? "bg-gray-900 text-white" : "bg-gray-200 text-black"
          }`}
        >
          <p className="text-base text-center">{description}</p>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-center mt-4 hover:underline"
          >
            View Project
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
