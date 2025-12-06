"use client";
import useStore from "../store/store";
import Design from "../components/Design";
import Home from "../components/Home";
import Contact from "../components/Contact";
import FeaturedProjects from "@/components/FeaturedProjects";
import FeaturedBlogs from "@/components/FeaturedBlogs";
import Testimonials from "@/components/Testimonials";
import SpaceShooterGame from "@/components/SpaceShooterGame";
import ThreeJsShowcase from "@/components/ThreeJsShowcase";
import UnifiedShowcase from "@/components/UnifiedShowcase";
import { BookOpen, Code2 } from "lucide-react";

export default function HomePage() {
  const { isDarkMode } = useStore();

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Particles */}
      <Design />

      {/* Main Content */}
      <div className="relative z-10">
        <Home />

        {/* Unified Showcase - Skills, Tech Stack, Solar System */}
        <UnifiedShowcase />

        {/* Featured Projects Section */}
        <div
          id="projects"
          className={`py-20 ${isDarkMode ? "bg-black" : "bg-gray-50"}`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Code2 size={40} className="text-blue-500" />
                <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Featured Projects
                </h2>
              </div>
              <p
                className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                Showcasing my best work and technical expertise
              </p>
            </div>

            <FeaturedProjects />
          </div>
        </div>

        {/* Featured Blog Section */}
        <div
          id="blog"
          className={`py-20 ${isDarkMode ? "bg-gray-900" : "bg-white"}`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <BookOpen size={40} className="text-purple-500" />
                <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Latest Articles
                </h2>
              </div>
              <p
                className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                Thoughts, tutorials, and insights on web development
              </p>
            </div>

            <FeaturedBlogs />
          </div>
        </div>

        <Testimonials />

        <SpaceShooterGame />

        <ThreeJsShowcase />

        <Contact />
      </div>
    </div>
  );
}
