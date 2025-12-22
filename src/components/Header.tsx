"use client";
import React, { useState, useEffect } from "react";
import useStore from "@/store/store";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import CursorToggle from "@/components/CursorToggle";
import { Button } from "@/components/ui/Button";

const Header = () => {
  const { isDarkMode, toggleDarkMode } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const themeIsDark = mounted ? isDarkMode : false;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rafId = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  // Track scroll locally for header glass/blur effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle hash navigation on page load
  useEffect(() => {
    if (pathname === "/" && window.location.hash === "#contact") {
      setTimeout(() => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [pathname]);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Contact", href: "/#contact" },
  ];

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (pathname === "/") {
      // Already on home page, just scroll to contact
      const contactSection = document.getElementById("contact");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Navigate to home page with contact hash
      router.push("/#contact");
    }
    setIsMenuOpen(false);
  };

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
          <Link href={"/"}>
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col">
              <motion.h1
                className={`font-display text-2xl font-bold ${
                  themeIsDark ? "text-white" : "text-black"
                }`}
              >
                Bishnu Bk
              </motion.h1>
              <motion.p
                className={`text-sm font-medium ${
                  themeIsDark ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Full Stack Developer
              </motion.p>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href={item.href}
                  onClick={
                    item.name === "Contact" ? handleContactClick : undefined
                  }
                  className={`${
                    themeIsDark ? "text-gray-300" : "text-gray-600"
                  } hover:text-primary transition-colors relative group`}
                >
                  {item.name}
                  <motion.span
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"
                    initial={false}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* Cursor Toggle */}
            {mounted && <CursorToggle />}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              icon={
                themeIsDark ? (
                  <FiSun className="text-yellow-400" size={20} />
                ) : (
                  <FiMoon className="text-gray-600" size={20} />
                )
              }
            >
              {themeIsDark ? "Light Mode" : "Dark Mode"}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              icon={isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            >
              {isMenuOpen ? "Close Menu" : "Open Menu"}
            </Button>
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
                themeIsDark ? "bg-dark/95" : "bg-white/95"
              } backdrop-blur-md rounded-lg`}
            >
              <div className="flex flex-col space-y-4 p-4">
                {navItems.map((item) => (
                  <motion.div key={item.name} whileHover={{ x: 10 }}>
                    <Link
                      href={item.href}
                      className={`${
                        themeIsDark ? "text-gray-300" : "text-gray-600"
                      } hover:text-primary transition-colors`}
                      onClick={
                        item.name === "Contact"
                          ? handleContactClick
                          : () => setIsMenuOpen(false)
                      }
                    >
                      {item.name}
                    </Link>
                  </motion.div>
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
