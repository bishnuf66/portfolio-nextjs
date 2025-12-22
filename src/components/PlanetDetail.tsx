"use client";

import React from "react";
import { colorScheme, getCardClasses } from "@/utils/colorUtils";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

interface PlanetDetailProps {
  category: {
    title: string;
    gradient: string;
    technologies: Array<{
      name: string;
      icon: React.ComponentType<{ size?: number; className?: string }>;
      color: string;
      description: string;
    }>;
  };
  isDarkMode: boolean;
  onClose: () => void;
}

const PlanetDetail: React.FC<PlanetDetailProps> = ({
  category,
  isDarkMode,
  onClose,
}) => {
  return (
    <AnimatedSection
      animation="fadeIn"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div className="max-w-4xl mx-4 w-full max-h-[90vh] overflow-y-auto">
        <div
          className={`${getCardClasses(
            "rounded-2xl p-8 border shadow-2xl relative"
          )}`}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full ${colorScheme.background.tertiary} hover:scale-110 transition-transform`}
          >
            <svg
              className={`w-6 h-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Category Header */}
          <div className="mb-8 text-center">
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 bg-linear-to-r ${category.gradient} bg-clip-text text-transparent`}
            >
              {category.title}
            </h2>
            <p
              className={`text-lg ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Explore the technologies in this category
            </p>
          </div>

          {/* Technologies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.technologies.map((tech, techIndex) => {
              const Icon = tech.icon;
              return (
                <div
                  key={techIndex}
                  className={`p-6 rounded-xl ${colorScheme.background.tertiary} hover:scale-105 transition-all duration-300 group cursor-pointer border`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${tech.color}20` }}
                    >
                      <div style={{ color: tech.color }}>
                        <Icon size={24} />
                      </div>
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold ${
                          isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {tech.name}
                      </h3>
                    </div>
                  </div>
                  <p
                    className={`text-base ${
                      isDarkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    {tech.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Close Button at Bottom */}
          <div className="mt-8 text-center">
            <button
              onClick={onClose}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};

export default PlanetDetail;
