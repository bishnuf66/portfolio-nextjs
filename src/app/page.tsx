"use client";
import useStore from "../store/store"; // Import the Zustand store
import Design from "../components/Design";
import Header from "../components/Header";
import Home from "../components/Home";

import Projects from "../components/Projects";
import Contact from "../components/Contact"; // Import Contact component

export default function HomePage() {
  const { isDarkMode, toggleDarkMode } = useStore(); // Access state and toggle function

  return (
    <div
      className={`min-h-screen w-full ${
        isDarkMode ? "bg-black" : "bg-gray-50"
      }`}
    >
      <Design isDarkMode={isDarkMode} />
      <div
        className={`w-full p-0 sm:px-10 sm:py-4 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>
      <div className="flex-grow flex justify-start items-start p-4 flex-col">
        <Home />
        <Projects />
        <Contact isDarkMode={isDarkMode} />
      </div>
    </div>
  );
}
