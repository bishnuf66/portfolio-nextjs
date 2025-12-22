"use client";

import React from "react";
import useStore from "@/store/store";
import { Mail, Heart, ArrowUp, Code2, Github, Linkedin } from "lucide-react";
import Design from "./Design";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { scrollToTop } from "@/utils/scrollUtils";
import DownloadCVButton from "./DownloadCVButton";
import { colorScheme } from "@/utils/colorUtils";

const Footer = () => {
  const { isDarkMode } = useStore();
  const router = useRouter();
  const pathname = usePathname();

  const currentYear = new Date().getFullYear();

  // Create navigation handler for sections on homepage
  const handleSectionClick =
    (sectionId: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (pathname === "/") {
        // Already on home page, just scroll to section
        const section = document.getElementById(sectionId);
        if (section) {
          const headerOffset = 80;
          const elementPosition = section.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      } else {
        // Navigate to home page with section hash
        router.push(`/#${sectionId}`);
      }
    };

  return (
    <footer
      className={`relative ${colorScheme.background.primary} border-t ${colorScheme.border.primary}`}
    >
      {/* Particles Background */}
      <Design id="tsparticles-footer" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Bishnu BK
            </h3>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Full Stack Developer crafting digital experiences with passion and
              precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className={`text-lg font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#home"
                  className={`text-sm transition-colors hover:underline ${
                    isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={handleSectionClick("home")}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#projects"
                  className={`text-sm transition-colors hover:underline ${
                    isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={handleSectionClick("projects")}
                >
                  Featured Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className={`text-sm transition-colors hover:underline ${
                    isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  All Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/#blog"
                  className={`text-sm transition-colors hover:underline ${
                    isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={handleSectionClick("blog")}
                >
                  Latest Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className={`text-sm transition-colors hover:underline ${
                    isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  All Articles
                </Link>
              </li>
              <li>
                <Link
                  href="/#contact"
                  className={`text-sm transition-colors hover:underline ${
                    isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={handleSectionClick("contact")}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Sections */}
          <div>
            <h4
              className={`text-lg font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Explore
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/#tech-stack"
                  className={`text-sm transition-colors hover:underline ${
                    isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={handleSectionClick("tech-stack")}
                >
                  Tech Stack
                </Link>
              </li>
              <li>
                <Link
                  href="/#testimonials"
                  className={`text-sm transition-colors hover:underline ${
                    isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={handleSectionClick("testimonials")}
                >
                  Testimonials
                </Link>
              </li>
              <li>
                <Link
                  href="/#game"
                  className={`text-sm transition-colors hover:underline ${
                    isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                  onClick={handleSectionClick("game")}
                >
                  Space Game
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className={`text-sm transition-colors hover:underline ${
                    isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4
              className={`text-lg font-semibold mb-4 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Connect
            </h4>
            <div className="space-y-4">
              {/* CV Download Button */}
              <div>
                <DownloadCVButton />
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                <a
                  href={
                    process.env.NEXT_PUBLIC_GITHUB_URL ||
                    "https://github.com/bishnuf66"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all hover:scale-110 ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                  title="GitHub Profile"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href={
                    process.env.NEXT_PUBLIC_LINKEDIN_URL ||
                    "https://linkedin.com/in/bishnubk"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-all hover:scale-110 ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white"
                      : "bg-gray-100 hover:bg-blue-500 text-gray-600 hover:text-white"
                  }`}
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href={`mailto:${
                    process.env.NEXT_PUBLIC_MY_EMAIL ||
                    "contact@bishnubk.com.np"
                  }`}
                  className={`p-2 rounded-lg transition-all hover:scale-110 ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-purple-600 text-gray-300 hover:text-white"
                      : "bg-gray-100 hover:bg-purple-500 text-gray-600 hover:text-white"
                  }`}
                  title="Send Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 border-t ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          } flex flex-col sm:flex-row justify-between items-center gap-4`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p
              className={`text-sm flex items-center gap-1 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              © {currentYear} Bishnu BK. Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-red-500" /> and lots
              of coffee
            </p>

            <a
              href="https://github.com/bishnuf66/portfolio-nextjs"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-linear-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white"
              }`}
            >
              <Code2 className="w-4 h-4" />
              View Source Code
            </a>
          </div>

          <button
            onClick={scrollToTop}
            className={`p-2 rounded-lg transition-all ${
              isDarkMode
                ? "bg-gray-800 hover:bg-blue-600"
                : "bg-gray-100 hover:bg-blue-500 hover:text-white"
            }`}
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
