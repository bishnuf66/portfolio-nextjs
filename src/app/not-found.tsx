"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, Compass } from "lucide-react";

export default function NotFound() {
  const { isDarkMode } = useStore();
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  // Generate random values once on component mount
  const [floatingShapes] = useState(() => {
    return [...Array(20)].map(() => ({
      width: Math.random() * 300 + 50,
      height: Math.random() * 300 + 50,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animateX: Math.random() * 100 - 50,
      animateY: Math.random() * 100 - 50,
      duration: Math.random() * 10 + 10,
    }));
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  };

  const glitchAnimation = {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 3,
    },
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center relative overflow-hidden ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingShapes.map((shape, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${
              isDarkMode ? "bg-blue-500/10" : "bg-blue-500/5"
            }`}
            style={{
              width: shape.width,
              height: shape.height,
              left: shape.left,
              top: shape.top,
            }}
            animate={{
              x: [0, shape.animateX],
              y: [0, shape.animateY],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* 404 Number with Glitch Effect */}
        <motion.div animate={glitchAnimation} className="mb-8">
          <h1
            className={`text-[150px] md:text-[200px] lg:text-[250px] font-black leading-none ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
            style={{
              textShadow: isDarkMode
                ? "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)"
                : "0 0 20px rgba(59, 130, 246, 0.3)",
            }}
          >
            404
          </h1>
        </motion.div>

        {/* Floating Icon */}
        <motion.div
          animate={floatingAnimation}
          className="mb-8 flex justify-center"
        >
          <div
            className={`p-6 rounded-full ${
              isDarkMode
                ? "bg-gradient-to-br from-blue-600 to-purple-600"
                : "bg-gradient-to-br from-blue-500 to-purple-500"
            } shadow-2xl`}
          >
            <Compass size={64} className="text-white" />
          </div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Page Not Found
          </h2>
          <p
            className={`text-xl md:text-2xl mb-2 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Oops! Looks like you&apos;ve ventured into uncharted territory.
          </p>
          <p
            className={`text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </motion.div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div
            className={`inline-block px-6 py-3 rounded-full ${
              isDarkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            } shadow-lg`}
          >
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Redirecting to home in{" "}
              <span
                className={`font-bold text-2xl ${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {countdown}
              </span>{" "}
              seconds
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white shadow-lg transition-all ${
                isDarkMode
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-blue-500/50"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:shadow-blue-500/50"
              }`}
            >
              <Home size={20} />
              Go Home
            </motion.button>
          </Link>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all ${
              isDarkMode
                ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                : "bg-white text-gray-900 hover:bg-gray-100 border border-gray-200"
            } shadow-lg`}
          >
            <ArrowLeft size={20} />
            Go Back
          </motion.button>

          <Link href="/blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-all ${
                isDarkMode
                  ? "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                  : "bg-white text-gray-900 hover:bg-gray-100 border border-gray-200"
              } shadow-lg`}
            >
              <Search size={20} />
              Browse Blog
            </motion.button>
          </Link>
        </motion.div>

        {/* Suggested Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <p
            className={`text-sm mb-4 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Or explore these pages:
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { name: "Projects", href: "/#projects" },
              { name: "Blog", href: "/blog" },
              { name: "Contact", href: "/#contact" },
            ].map((link, index) => (
              <Link key={link.name} href={link.href}>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className={`inline-block px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:text-gray-900"
                  }`}
                >
                  {link.name}
                </motion.span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 hidden lg:block">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`w-20 h-20 rounded-full border-4 ${
              isDarkMode ? "border-blue-500/30" : "border-blue-500/20"
            }`}
          />
        </div>

        <div className="absolute bottom-1/4 right-10 hidden lg:block">
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear",
            }}
            className={`w-16 h-16 rounded-full border-4 ${
              isDarkMode ? "border-purple-500/30" : "border-purple-500/20"
            }`}
          />
        </div>
      </div>

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isDarkMode
            ? "bg-gradient-to-b from-transparent via-transparent to-gray-900/50"
            : "bg-gradient-to-b from-transparent via-transparent to-gray-50/50"
        }`}
      />
    </div>
  );
}
