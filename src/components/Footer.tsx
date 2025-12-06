"use client";

import React from "react";
import useStore from "@/store/store";
import { Github, Linkedin, Mail, Heart, ArrowUp, Code2 } from "lucide-react";
import Design from "./Design";

const Footer = () => {
  const { isDarkMode } = useStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`relative ${isDarkMode ? "bg-black border-t border-gray-800" : "bg-white border-t border-gray-200"
        }`}
    >
      {/* Particles Background */}
      <Design id="tsparticles-footer" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Bishnu BK
            </h3>
            <p
              className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              Full Stack Developer crafting digital experiences with passion and
              precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Quick Links
            </h4>
            <ul className="space-y-2">
              {["Home", "Projects", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    className={`text-sm transition-colors ${isDarkMode
                      ? "text-gray-400 hover:text-blue-400"
                      : "text-gray-600 hover:text-blue-600"
                      }`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4
              className={`text-lg font-semibold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                }`}
            >
              Connect
            </h4>
            <div className="flex gap-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all ${isDarkMode
                  ? "bg-gray-800 hover:bg-blue-600"
                  : "bg-gray-100 hover:bg-blue-500 hover:text-white"
                  }`}
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all ${isDarkMode
                  ? "bg-gray-800 hover:bg-blue-600"
                  : "bg-gray-100 hover:bg-blue-500 hover:text-white"
                  }`}
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:your.email@example.com"
                className={`p-2 rounded-lg transition-all ${isDarkMode
                  ? "bg-gray-800 hover:bg-purple-600"
                  : "bg-gray-100 hover:bg-purple-500 hover:text-white"
                  }`}
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className={`pt-8 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"
            } flex flex-col sm:flex-row justify-between items-center gap-4`}
        >
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p
              className={`text-sm flex items-center gap-1 ${isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
            >
              © {currentYear} Bishnu BK. Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-red-500" /> and lots of
              coffee
            </p>

            <a
              href="https://github.com/bishnuf66"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-sm flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isDarkMode
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
            className={`p-2 rounded-lg transition-all ${isDarkMode
              ? "bg-gray-800 hover:bg-blue-600"
              : "bg-gray-100 hover:bg-blue-500 hover:text-white"
              }`}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>


    </footer>
  );
};

export default Footer;
