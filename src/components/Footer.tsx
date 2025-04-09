"use client";
import { useState } from "react";
import Link from "next/link";

import useStore from "@/store/store";
import DownloadCVButton from "./DownloadCVButton";
import { toast } from "react-toastify";

const Footer = () => {
  const { isDarkMode } = useStore();
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Subscribed Successfully");
  };

  return (
    <footer
      className={`relative overflow-hidden ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-1/2 left-0 w-full h-full transform rotate-12 ${
            isDarkMode ? "bg-blue-900/20" : "bg-blue-50"
          }`}
        ></div>
        <div
          className={`absolute -bottom-1/2 right-0 w-full h-full transform -rotate-12 ${
            isDarkMode ? "bg-purple-900/20" : "bg-purple-50"
          }`}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Bishnu BK
            </h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Crafting digital experiences that make a difference. Let's build
              something amazing together.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/bishnuf66"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-white hover:bg-gray-100 text-gray-600"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/bishnu-bk-820b09243/"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-white hover:bg-gray-100 text-gray-600"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/bishnu.bk.315"
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-white hover:bg-gray-100 text-gray-600"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-900"
              }`}
            >
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/professional"
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Professional Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/projects/personal"
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Personal Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3
              className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-900"
              }`}
            >
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:bishowkarmabishnu2024@gmail.com"
                  className={`text-sm transition-colors duration-300 ${
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  bishowkarmabishnu2024@gmail.com
                </a>
              </li>
              <li>
                <div>
                  <h3
                    className={`text-sm transition-colors duration-300 mb-2 ${
                      isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Download CV
                  </h3>
                  <DownloadCVButton />
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              className={`text-sm font-semibold uppercase tracking-wider mb-4 ${
                isDarkMode ? "text-gray-300" : "text-gray-900"
              }`}
            >
              Stay Updated
            </h3>
            <p
              className={`text-sm mb-4 ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Subscribe to my newsletter for the latest updates and insights.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className={`flex-1 px-4 py-2 rounded-lg text-sm ${
                  isDarkMode
                    ? "bg-gray-800 text-white placeholder-gray-400"
                    : "bg-white text-gray-900 placeholder-gray-500"
                }`}
              />
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div
          className={`mt-12 pt-8 border-t ${
            isDarkMode ? "border-gray-800" : "border-gray-200"
          }`}
        >
          <p
            className={`text-center text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            © {new Date().getFullYear()} Bishnu BK. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
