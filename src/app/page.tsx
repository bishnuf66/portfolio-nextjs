import Home from "../components/Home";
import Contact from "../components/Contact";
import FeaturedProjects from "@/components/FeaturedProjects";
import FeaturedBlogs from "@/components/FeaturedBlogs";
import Testimonials from "@/components/Testimonials";
import SpaceShooterGame from "@/components/SpaceShooterGame";
import UnifiedShowcase from "@/components/UnifiedShowcase";
import TechStackGrid from "@/components/TechStackGrid";
import { BookOpen, Code2 } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";

export const revalidate = 3600; // Revalidate every hour

export default function HomePage() {
  return (
    <div className="min-h-screen w-full relative">
      {/* Main Content */}
      <div className="relative z-10">
        <Home />

        {/* Unified Showcase - Skills, Tech Stack, Solar System */}
        <UnifiedShowcase />

        {/* Technology Stack Section */}
        <div
          id="tech-stack"
          className={`py-20 bg-gray-900`}
        >
          <TechStackGrid />
        </div>

        {/* Featured Projects Section */}
        <div
          id="projects"
          className={`py-20 bg-black`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedSection animation="fadeIn" className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Code2 size={40} className="text-blue-500" />
                <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
              </div>
              <p className="text-xl text-gray-300">
                Showcasing my best work and technical expertise
              </p>
            </AnimatedSection>

            <FeaturedProjects />
          </div>
        </div>

        {/* Featured Blog Section */}
        <div
          id="blog"
          className={`py-20 bg-gray-900`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedSection animation="fadeIn" className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen size={40} className="text-purple-500" />
                <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Latest Articles
                </h2>
              </div>
              <p className="text-xl text-gray-300">
                Thoughts, tutorials, and insights on web development
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
