"use client";
import useStore from "../store/store";
import Design from "../components/Design";
import Home from "../components/Home";
import Contact from "../components/Contact";
import ProjectShowcase from "@/components/ProjectShowcase";
import ThreeCanvas from "@/components/ThreeCanvas";
import Testimonials from "@/components/Testimonials";
import SpaceShooterGame from "@/components/SpaceShooterGame";
import ThreeJsShowcase from "@/components/ThreeJsShowcase";

export default function HomePage() {
  const { isDarkMode } = useStore();

  return (
    <div className="min-h-screen w-full relative">
      {/* Background Particles */}
      <Design />

      {/* Main Content */}
      <div className="relative z-10">
        <Home />

        {/* Projects Section */}
        <div
          id="projects"
          className={`py-20 ${isDarkMode ? "bg-black" : "bg-gray-50"}`}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Featured Projects
              </h2>
              <p
                className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                A showcase of my work and technical expertise
              </p>
            </div>

            <div className="flex justify-center items-center mb-12">
              <ThreeCanvas />
            </div>

            <ProjectShowcase />
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
