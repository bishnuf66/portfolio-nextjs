"use client";
import useStore from "../store/store"; // Import the Zustand store
import Design from "../components/Design";
import Header from "../components/Header";
import Home from "../components/Home";

import Projects from "../components/Projects";
import Contact from "../components/Contact"; // Import Contact component
import Footer from "../components/Footer";
export default function HomePage() {
  const { isDarkMode } = useStore(); // Access state and toggle function

  return (
    <div
      className={`min-h-screen w-full ${
        isDarkMode ? "bg-black" : "bg-gray-50"
      }`}
    >
      <Design />
      <div
        className={`w-full p-0 sm:px-10 sm:py-4 ${
          isDarkMode ? "text-white" : "text-black"
        }`}
      >
        <Header />
      </div>
      <div className="">
        <Home />
        <Projects />
        <Contact />
      </div>
      <Footer />
    </div>
  );
}
