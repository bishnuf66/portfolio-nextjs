"use client";
import useStore from "../store/store";
import Design from "../components/Design";
import Home from "../components/Home";
import Contact from "../components/Contact";
import ProjectShowcase from "@/components/ProjectShowcase";
import ThreeCanvas from "@/components/ThreeCanvas";
export default function HomePage() {
  const { isDarkMode } = useStore();

  return (
    <div
      className={`min-h-screen w-full ${isDarkMode ? "bg-black" : "bg-gray-50"
        }`}
    >
      <Design />
      <Home />
      <div className="max-w-7xl mx-auto">
        <div className="text-center ">
          <h2
            className={`text-4xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
              }`}
          >
            My Projects
          </h2>
          <p
            className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
          >
            A showcase of my work and technical expertise
          </p>
        </div>
      </div>
      <div className="flex justify-center items-center ">
        <ThreeCanvas />
      </div>

      <ProjectShowcase />
      <Contact />
    </div>
  );
}
