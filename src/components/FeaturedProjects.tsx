"use client";

import React from "react";
import ProjectCard from "./ProjectCard";
import Link from "next/link";
import useStore from "@/store/store";
import { ProjectCardSkeleton } from "./LoadingSkeleton";
import { Sparkles } from "lucide-react";
import { getSafeImageUrl } from "@/utils/imageUtils";
import {
  AnimatedSection,
  StaggeredContainer,
} from "@/components/ui/AnimatedSection";
import { useFeaturedProjects } from "@/hooks/useProjects";
import { Button } from "@/components/ui/Button";

const FeaturedProjects = () => {
  const { isDarkMode } = useStore();
  const { data: projects = [], isLoading: loading } = useFeaturedProjects();

  // Track featured projects section view
  React.useEffect(() => {
    if (!loading && projects.length > 0) {
      import("@/lib/analytics").then(({ trackSectionInteraction }) => {
        trackSectionInteraction("featured-projects", "view", {
          projectCount: projects.length,
          featuredCount: projects.filter((p) => p.is_featured).length,
        });
      });
    }
  }, [loading, projects]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <p
          className={`text-xl ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          No featured projects yet.
        </p>
      </div>
    );
  }

  return (
    <AnimatedSection animation="fadeIn" duration={0.8}>
      <StaggeredContainer
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        staggerDelay={0.15}
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            slug={project.slug}
            image={getSafeImageUrl(project.cover_image_url)}
            name={project.name}
            techStack={project.tech_stack.join(", ")}
            description={project.description}
            link={project.url}
          />
        ))}
      </StaggeredContainer>

      <AnimatedSection
        animation="slideUp"
        delay={0.4}
        className="text-center mt-12"
      >
        <Link href="/projects">
          <Button
            variant="gradient"
            size="lg"
            icon={<Sparkles size={20} />}
            iconPosition="left"
            className="transform hover:scale-105"
          >
            View All Projects
          </Button>
        </Link>
      </AnimatedSection>
    </AnimatedSection>
  );
};

export default FeaturedProjects;
