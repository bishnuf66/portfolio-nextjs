"use client";
import React, { useEffect, useState } from "react";

export const GlowingStarsBackgroundCard = ({
  className,
  children,
  glowingStarsCount = 5, // Allow customization of how many stars glow
}: {
  className?: string;
  children?: React.ReactNode;
  glowingStarsCount?: number;
}) => {
  const [mouseEnter, setMouseEnter] = useState(false);

  // Handle both mouse and touch events
  const handleEnter = () => setMouseEnter(true);
  const handleLeave = () => setMouseEnter(false);

  useEffect(() => {
    // Defer state updates to avoid cascading renders
    requestAnimationFrame(() => {
      // Default to hovered state on mobile/touch devices
      if (typeof window !== "undefined") {
        const isMobile = window.innerWidth < 768 || "ontouchstart" in window;
        setMouseEnter(isMobile);
      }
    });
  }, []);

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
      className={`relative bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] p-8 rounded-xl border border-[#2a2e37] overflow-hidden h-full ${className}`}
    >
      <div className="flex justify-center items-center">
        <Illustration
          mouseEnter={mouseEnter}
          glowingStarsCount={glowingStarsCount}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Illustration = ({
  mouseEnter,
  glowingStarsCount,
}: {
  mouseEnter: boolean;
  glowingStarsCount: number;
}) => {
  const stars = 24; // Further reduced from 48
  const columns = 8; // Further reduced from 12

  const [glowingStars, setGlowingStars] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Generate random star indices to glow
      const randomStars = Array.from({ length: glowingStarsCount }, () =>
        Math.floor(Math.random() * stars)
      );
      setGlowingStars(randomStars);
    }, 3000);

    return () => clearInterval(interval);
  }, [glowingStarsCount, stars]);

  return (
    <div
      className="h-48 p-1 w-full max-w-full overflow-hidden"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      }}
    >
      {[...Array(stars)].map((_, starIdx) => {
        const isGlowing = glowingStars.includes(starIdx);
        const delay = (starIdx % 10) * 0.1;
        return (
          <div
            key={`matrix-col-${starIdx}}`}
            className="relative flex items-center justify-center"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={`transition-all duration-300 shrink-0 ${
                mouseEnter
                  ? isGlowing
                    ? "fill-white opacity-100"
                    : "fill-gray-700 opacity-50"
                  : "fill-gray-700 opacity-30"
              }`}
              style={{
                animationDelay: `${delay}s`,
              }}
            >
              <path d="M12 0.587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
