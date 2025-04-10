"use client";
import React, { useState, useEffect } from "react";
import useStore from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useScrollPosition } from "@/hooks/useScrollPosition";

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    setIsScrolled(scrollPosition > 50);
  }, [scrollPosition]);

  const navItems = [
    { name: "Home", href: "/" },
    // { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? " backdrop-blur-md shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col">
            <motion.h1
              className={`text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              Bishnu Bk
            </motion.h1>
            <motion.p
              className={`text-sm font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Full Stack Developer
            </motion.p>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.a
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                href={item.href}
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                } hover:text-primary transition-colors relative group`}
              >
                {item.name}
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                  initial={false}
                />
              </motion.a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-200"
              }`}
            >
              {isDarkMode ? (
                <FiSun className="text-yellow-400" size={20} />
              ) : (
                <FiMoon className="text-gray-600" size={20} />
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="md:hidden p-2 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <FiX
                  className={isDarkMode ? "text-white" : "text-black"}
                  size={24}
                />
              ) : (
                <FiMenu
                  className={isDarkMode ? "text-white" : "text-black"}
                  size={24}
                />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`md:hidden mt-4 ${
                isDarkMode ? "bg-dark/95" : "bg-white/95"
              } backdrop-blur-md rounded-lg`}
            >
              <div className="flex flex-col space-y-4 p-4">
                {navItems.map((item) => (
                  <motion.a
                    key={item.name}
                    whileHover={{ x: 10 }}
                    href={item.href}
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } hover:text-primary transition-colors`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
