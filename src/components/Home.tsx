"use client";

import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import useStore from "@/store/store";
import Image from "next/image";
import Link from "next/link";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/Spotlight";
import { MovingBorder } from "@/components/ui/MovingBorder";
import { colorScheme } from "@/utils/colorUtils";
import { useSectionViewTracking } from "@/hooks/useSectionViewTracking";

const Home = () => {
  const { isDarkMode } = useStore();
  const [scrollY, setScrollY] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const heroRef = useSectionViewTracking("hero-section");
  const parallaxRef = useSectionViewTracking("parallax-mountain-section");
  const ctaRef = useSectionViewTracking("cta-section");

  useEffect(() => {
    let rafRef: number | null = null;
    let lastScrollY = 0;
    let ticking = false;
    let initialized = false;

    const handleScroll = () => {
      // Prevent multiple simultaneous updates
      if (ticking) return;
      ticking = true;

      // Cancel previous animation frame
      if (rafRef) {
        cancelAnimationFrame(rafRef);
      }

      rafRef = requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        // Only update if scroll position actually changed significantly
        if (Math.abs(currentScrollY - lastScrollY) > 1) {
          lastScrollY = currentScrollY;
          setScrollY(currentScrollY);
        }

        // Reset ticking flag
        ticking = false;
      });
    };

    // Set initial scroll position only once, using setTimeout to defer state update
    if (!initialized) {
      const initialScrollY = window.scrollY;
      setTimeout(() => {
        setScrollY(initialScrollY);
      }, 0);
      lastScrollY = initialScrollY;
      initialized = true;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef) {
        cancelAnimationFrame(rafRef);
      }
    };
  }, []);

  return (
    <>
      {/* Hero Section with 3D Spline */}
      <div
        id="home"
        ref={heroRef as React.RefObject<HTMLDivElement>}
        className="relative w-full min-h-screen overflow-hidden"
      >
        {/* Background with Spotlight */}
        <div className={`absolute inset-0 ${colorScheme.background.secondary}`}>
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill={isDarkMode ? "white" : "rgba(139, 92, 246, 0.3)"}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left: Text Content */}
              <div className="space-y-6 pt-20 lg:pt-0">
                <h1 className="font-display text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-500 to-pink-500">
                  <Typewriter
                    words={[
                      "Bishnu BK",
                      "Top Fullstack Developer Nepal",
                      "Best Frontend Developer Nepal",
                      "Expert Backend Developer Nepal",
                      "React.js Expert Nepal",
                      "Next.js Developer Nepal",
                    ]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={100}
                    deleteSpeed={80}
                    delaySpeed={2000}
                  />
                </h1>

                <p
                  className={`text-xl md:text-2xl leading-relaxed ${
                    isDarkMode ? "text-neutral-300" : "text-gray-700"
                  }`}
                >
                  Nepal&apos;s leading{" "}
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-blue-400" : "text-blue-600"
                    }`}
                  >
                    fullstack developer
                  </span>{" "}
                  specializing in{" "}
                  <span
                    className={`font-semibold ${
                      isDarkMode ? "text-purple-400" : "text-purple-600"
                    }`}
                  >
                    React, Next.js & Node.js
                  </span>
                  . Building modern web solutions in Kathmandu.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Link
                    href="#projects"
                    className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                    onClick={() => {
                      import("@/lib/analytics").then(
                        ({ trackSectionInteraction }) => {
                          trackSectionInteraction("hero-section", "click", {
                            action: "view-my-work",
                          });
                        }
                      );
                    }}
                  >
                    View My Work
                  </Link>

                  <Link
                    href="/#contact"
                    className={`px-8 py-3 border-2 rounded-full font-semibold transition-all duration-300 ${
                      isDarkMode
                        ? "border-neutral-500 text-neutral-300 hover:border-purple-500 hover:text-purple-400"
                        : "border-gray-300 text-gray-700 hover:border-purple-500 hover:text-purple-600"
                    }`}
                    onClick={() => {
                      import("@/lib/analytics").then(
                        ({ trackSectionInteraction }) => {
                          trackSectionInteraction("hero-section", "click", {
                            action: "hero-contact",
                          });
                        }
                      );
                    }}
                  >
                    Get In Touch
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        isDarkMode ? "text-blue-400" : "text-blue-600"
                      }`}
                    >
                      24+
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-neutral-400" : "text-gray-600"
                      }`}
                    >
                      Projects
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        isDarkMode ? "text-purple-400" : "text-purple-600"
                      }`}
                    >
                      3+
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-neutral-400" : "text-gray-600"
                      }`}
                    >
                      Years Exp
                    </div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-3xl font-bold ${
                        isDarkMode ? "text-pink-400" : "text-pink-600"
                      }`}
                    >
                      ∞
                    </div>
                    <div
                      className={`text-sm ${
                        isDarkMode ? "text-neutral-400" : "text-gray-600"
                      }`}
                    >
                      Ideas
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: 3D Spline Scene */}
              <div className="relative h-[400px] md:h-[600px] lg:h-[700px]">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full relative z-10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
          <div
            className={`w-6 h-10 border-2 rounded-full flex justify-center ${
              isDarkMode ? "border-neutral-400" : "border-gray-400"
            }`}
          >
            <div
              className={`w-1 h-3 rounded-full mt-2 ${
                isDarkMode ? "bg-neutral-400" : "bg-gray-400"
              }`}
            ></div>
          </div>
        </div>
      </div>

      {/* Parallax Mountain Section with Gradient Overlays */}
      <div
        ref={parallaxRef as React.RefObject<HTMLDivElement>}
        className="relative w-full h-screen overflow-hidden"
      >
        {/* Top gradient overlay - blends with hero section above */}
        <div
          className={`absolute top-0 left-0 right-0 h-32 z-20 pointer-events-none ${
            isDarkMode
              ? "bg-gradient-to-b from-black via-black/80 to-transparent"
              : "bg-gradient-to-b from-gray-50 via-gray-50/80 to-transparent"
          }`}
        ></div>

        {/* Bottom gradient overlay - blends with section below */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-32 z-20 pointer-events-none ${
            isDarkMode
              ? "bg-gradient-to-t from-black via-black/80 to-transparent"
              : "bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent"
          }`}
        ></div>

        <div
          className="w-full h-full origin-center transition-transform duration-100 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${Math.min(
              scrollY * 0.03,
              30
            )}deg) scale(${1 + scrollY * 0.0005}) translateZ(${
              -scrollY * 0.1
            }px)`,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/coding2.webp"
              alt="Coding workspace"
              fill
              className={`object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              priority
              loading="eager"
              onLoad={() => setImageLoaded(true)}
            />
            {/* Image overlay for better text contrast */}
            <div
              className={`absolute inset-0 ${
                isDarkMode
                  ? "bg-gradient-to-b from-black/60 via-black/40 to-black/60"
                  : "bg-gradient-to-b from-white/40 via-white/20 to-white/40"
              }`}
            ></div>
          </div>
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <h2
              className={`font-display text-4xl md:text-6xl font-bold mb-6 ${
                isDarkMode ? "text-white" : "text-gray-900"
              }`}
            >
              <Typewriter
                words={["Building the Future", "One Line at a Time"]}
                loop={0}
                cursor
                cursorStyle="_"
                typeSpeed={80}
                deleteSpeed={60}
                delaySpeed={2000}
              />
            </h2>
            <p
              className={`text-xl md:text-2xl ${
                isDarkMode ? "text-neutral-200" : "text-gray-700"
              }`}
            >
              Every project is a journey. Every challenge is an opportunity.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div
        ref={ctaRef as React.RefObject<HTMLDivElement>}
        className={`py-20 ${colorScheme.background.primary}`}
      >
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="font-display text-5xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Let&apos;s Build Something Amazing
          </h2>
          <p
            className={`text-xl mb-8 ${
              isDarkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Have a project in mind? Let&apos;s collaborate and create something
            extraordinary together.
          </p>
          <MovingBorder
            duration={3000}
            className="px-8 py-4 rounded-full"
            as={Link}
            href="#contact"
            onClick={() => {
              import("@/lib/analytics").then(({ trackSectionInteraction }) => {
                trackSectionInteraction("cta-section", "click", {
                  action: "cta-get-in-touch",
                });
              });
            }}
          >
            <span className="text-lg font-semibold">Get In Touch</span>
          </MovingBorder>
        </div>
      </div>
    </>
  );
};

export default Home;
