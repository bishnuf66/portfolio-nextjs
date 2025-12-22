"use client";

import Home from "../components/Home";
import Contact from "../components/Contact";
import FeaturedProjects from "@/components/FeaturedProjects";
import FeaturedBlogs from "@/components/FeaturedBlogs";
import Testimonials from "@/components/Testimonials";
import SpaceShooterGame from "@/components/SpaceShooterGame";
import UnifiedShowcase from "@/components/UnifiedShowcase";
import { BookOpen, Code2 } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { colorScheme } from "@/utils/colorUtils";
import SEOContent from "@/components/SEOContent";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full relative">
      {/* SEO Content */}
      <SEOContent page="home" />

      {/* Main Content */}
      <div className="relative z-10">
        <Home />

        {/* Unified Showcase - Skills, Tech Stack, Solar System */}
        <UnifiedShowcase />

        {/* Featured Projects Section */}
        <div
          id="projects"
          className={`py-20 ${colorScheme.background.primary}`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedSection animation="fadeIn" className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Code2 size={40} className="text-blue-500" />
                <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
              </div>
              <p className={`text-xl ${colorScheme.text.secondary}`}>
                Showcasing innovative web solutions by Nepal&apos;s top
                fullstack developer
              </p>
            </AnimatedSection>

            <FeaturedProjects />
          </div>
        </div>

        {/* Featured Blog Section */}
        <div id="blog" className={`py-20 ${colorScheme.background.secondary}`}>
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedSection animation="fadeIn" className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen size={40} className="text-purple-500" />
                <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Latest Articles
                </h2>
              </div>
              <p className={`text-xl ${colorScheme.text.secondary}`}>
                Expert insights on modern web development from Nepal&apos;s
                leading developer
              </p>
            </AnimatedSection>

            <FeaturedBlogs />
          </div>
        </div>

        <Testimonials />

        <SpaceShooterGame />

        <Contact />
      </div>
    </div>
  );
}
