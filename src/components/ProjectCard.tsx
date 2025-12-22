"use client";

import React from "react";
import useStore from "@/store/store";
import Link from "next/link";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3DCard";
import { BackgroundGradient } from "@/components/ui/BackgroundGradient";
import { ExternalLink, Code, Star } from "lucide-react";
import Image from "next/image";
import { getSafeImageUrl, createImageErrorHandler } from "@/utils/imageUtils";
import { Button } from "@/components/ui/Button";

interface ProjectCardProps {
  id: string;
  slug: string;
  image: string;
  name: string;
  techStack: string;
  description: string;
  link: string;
  isFeatured?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  id,
  slug,
  image,
  name,
  techStack,
  description,
  link,
  isFeatured = false,
}) => {
  const { isDarkMode } = useStore();

  const safeImageUrl = getSafeImageUrl(image);
  const handleImageError = createImageErrorHandler();

  const handleProjectClick = () => {
    import("@/lib/analytics").then(({ trackProjectInteraction }) => {
      trackProjectInteraction("project-card", "click", {
        projectId: id,
        projectName: name,
        action: "view-live-project",
      });
    });
  };

  const handleDetailsClick = () => {
    import("@/lib/analytics").then(({ trackProjectInteraction }) => {
      trackProjectInteraction("project-card", "click", {
        projectId: id,
        projectName: name,
        action: "view-project-details",
      });
    });
  };

  return (
    <CardContainer className="inter-var max-w-120">
      <CardBody
        className={`relative group/card w-full max-w-120 mx-auto h-auto rounded-xl p-6 border ${
          isDarkMode
            ? "bg-black border-white/20 hover:shadow-2xl hover:shadow-emerald-500/10"
            : "bg-gray-50 border-black/10 hover:shadow-2xl hover:shadow-blue-500/10"
        }`}
      >
        {/* Project Title */}
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white flex items-center gap-2"
        >
          {name}
          {isFeatured && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-linear-to-r from-yellow-500 to-orange-500 text-white text-xs font-semibold rounded-full">
              <Star size={12} fill="currentColor" />
              Featured
            </span>
          )}
        </CardItem>

        {/* Description */}
        <CardItem
          as="div"
          translateZ="60"
          className={`text-sm max-w-sm mt-2 line-clamp-1 ${
            isDarkMode ? "text-neutral-300" : "text-neutral-500"
          } prose prose-sm max-w-none`}
          dangerouslySetInnerHTML={{ __html: description }}
        />

        {/* Project Image with Gradient Border */}
        <CardItem translateZ="100" className="w-full mt-4">
          <BackgroundGradient className="rounded-[22px] p-1 bg-white dark:bg-zinc-900">
            <div className="relative w-full h-60 rounded-2xl overflow-hidden">
              <Image
                src={safeImageUrl}
                alt={name}
                fill
                unoptimized
                className="object-cover group-hover/card:scale-110 transition-transform duration-500"
                onError={handleImageError}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <Code className="w-8 h-8 text-white" />
              </div>
            </div>
          </BackgroundGradient>
        </CardItem>

        {/* Tech Stack */}
        <CardItem translateZ="50" className="w-full mt-4">
          <div className="min-h-16 h-16 flex flex-wrap gap-2 overflow-hidden relative">
            {techStack.split(",").map((tech: string, index: number) => (
              <span
                key={index}
                className={`px-3 py-1 rounded-full text-xs font-medium h-fit ${
                  isDarkMode
                    ? "bg-linear-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30"
                    : "bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200"
                }`}
              >
                {tech.trim()}
              </span>
            ))}
            {/* Fade out effect for overflow */}
            <div
              className={`absolute bottom-0 right-0 w-8 h-8 bg-linear-to-l ${
                isDarkMode ? "from-gray-800" : "from-gray-50"
              } to-transparent pointer-events-none`}
            ></div>
          </div>
        </CardItem>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-6">
          <CardItem translateZ={20}>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleProjectClick}
            >
              <Button
                variant="primary"
                size="sm"
                icon={<ExternalLink className="w-4 h-4" />}
              >
                View Project
              </Button>
            </a>
          </CardItem>

          <CardItem translateZ={20}>
            <Link href={`/projects/${slug}`} onClick={handleDetailsClick}>
              <Button variant="outline" size="sm">
                Details →
              </Button>
            </Link>
          </CardItem>
        </div>
      </CardBody>
    </CardContainer>
  );
};

export default ProjectCard;
