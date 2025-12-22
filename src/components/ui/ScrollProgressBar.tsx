"use client";

import React, { useState, useEffect, useRef } from "react";
import useStore from "@/store/store";

interface ScrollProgressBarProps {
  className?: string;
  height?: string;
  showPercentage?: boolean;
}

const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({
  className = "",
  height = "3px",
  showPercentage = false,
}) => {
  const { isDarkMode } = useStore();
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const lastProgressRef = useRef(0);
  const isUpdatingRef = useRef(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      // Prevent multiple simultaneous updates
      if (isUpdatingRef.current) return;

      // Cancel previous animation frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Only update if scroll position actually changed significantly
        if (Math.abs(currentScrollY - lastScrollY.current) < 2) {
          return;
        }

        lastScrollY.current = currentScrollY;

        const totalHeight =
          document.documentElement.scrollHeight - window.innerHeight;

        // Prevent division by zero
        if (totalHeight <= 0) {
          if (lastProgressRef.current !== 0) {
            lastProgressRef.current = 0;
            setScrollProgress(0);
          }
          return;
        }

        const progress = (currentScrollY / totalHeight) * 100;
        const clampedProgress = Math.min(100, Math.max(0, progress));

        // Only update state if progress actually changed significantly
        if (Math.abs(lastProgressRef.current - clampedProgress) > 0.5) {
          lastProgressRef.current = clampedProgress;
          setScrollProgress(clampedProgress);
        }
      });
    };

    // Add scroll listener with passive: true for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []); // Empty dependency array - this effect should only run once

  return (
    <div className={`fixed top-0 left-0 w-full z-50 ${className}`}>
      {/* Progress Bar Background */}
      <div
        className={`w-full ${
          isDarkMode ? "bg-gray-800/20" : "bg-gray-200/20"
        } backdrop-blur-sm`}
        style={{ height }}
      >
        {/* Progress Bar Fill */}
        <div
          className="h-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-150 ease-out relative overflow-hidden"
          style={{ width: `${scrollProgress}%` }}
        >
          {/* Animated Shine Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-pulse" />

          {/* Glowing Effect */}
          <div className="absolute inset-0 bg-linear-to-r from-blue-400/50 via-purple-400/50 to-pink-400/50 blur-sm" />
        </div>
      </div>

      {/* Optional Percentage Display */}
      {showPercentage && (
        <div
          className={`absolute top-full right-4 mt-2 px-2 py-1 rounded-md text-xs font-medium ${
            isDarkMode
              ? "bg-gray-800/80 text-gray-200"
              : "bg-white/80 text-gray-700"
          } backdrop-blur-sm`}
        >
          {Math.round(scrollProgress)}%
        </div>
      )}
    </div>
  );
};

export default ScrollProgressBar;
