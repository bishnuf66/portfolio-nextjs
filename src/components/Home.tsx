"use client";

import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import useStore from "@/store/store";
import Image from "next/image";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/Spotlight";

const Home = () => {
  const { isDarkMode } = useStore();
  const [scrollY, setScrollY] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Hero Section with 3D Spline */}
      <div
        id="home"
        className="relative w-full min-h-screen overflow-hidden"
      >
        {/* Background with Spotlight */}
        <div className="absolute inset-0 bg-black/[0.96]">
          <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 min-h-screen flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Left: Text Content */}
              <div className="space-y-6 pt-20 lg:pt-0">
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                  <Typewriter
                    words={["Bishnu BK", "Full Stack Developer", "Creative Coder"]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={100}
                    deleteSpeed={80}
                    delaySpeed={2000}
                  />
                </h1>

                <p className="text-xl md:text-2xl text-neutral-300 leading-relaxed">
                  Crafting digital experiences that blend{" "}
                  <span className="text-blue-400 font-semibold">creativity</span> with{" "}
                  <span className="text-purple-400 font-semibold">functionality</span>.
                  Building solutions that tell a story.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="#projects"
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  >
                    View My Work
                  </a>
                  <a
                    href="#contact"
                    className="px-8 py-3 border-2 border-neutral-500 rounded-full text-neutral-300 font-semibold hover:border-purple-500 hover:text-purple-400 transition-all duration-300"
                  >
                    Get In Touch
                  </a>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">24+</div>
                    <div className="text-sm text-neutral-400">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">3+</div>
                    <div className="text-sm text-neutral-400">Years Exp</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-400">∞</div>
                    <div className="text-sm text-neutral-400">Ideas</div>
                  </div>
                </div>
              </div>

              {/* Right: 3D Spline Scene */}
              <div className="relative h-[400px] md:h-[600px] lg:h-[700px]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-3xl blur-3xl"></div>
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
          <div className="w-6 h-10 border-2 border-neutral-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-neutral-400 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Parallax Mountain Section */}
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <div
          className="w-full h-full origin-center transition-transform duration-100 ease-out"
          style={{
            transform: `perspective(1000px) rotateX(${Math.min(scrollY * 0.03, 30)}deg) scale(${1 + scrollY * 0.0005}) translateZ(${-scrollY * 0.1}px)`,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div className="relative w-full h-full">
            <Image
              src="/mountain.jpg"
              alt="Mountain landscape"
              fill
              unoptimized
              className={`object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              priority
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80"></div>
          </div>
        </div>

        {/* Overlay Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="text-center px-4 max-w-4xl">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
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
            <p className="text-xl md:text-2xl text-neutral-200">
              Every project is a journey. Every challenge is an opportunity.
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div
        className={`py-20 ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"
          }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                My Journey
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                From lines of code to impactful applications, my journey has been
                about transforming ideas into reality. Each project is a new
                chapter in my story of growth and innovation.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I specialize in building full-stack applications with modern
                technologies like React, Next.js, Node.js, and more. My passion
                lies in creating seamless user experiences backed by robust
                architecture.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                My Approach
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I combine technical expertise with creative problem-solving to
                build applications that are not just functional, but also
                delightful to use.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                  <h3 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
                    Innovation
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Cutting-edge tech
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
                  <h3 className="text-xl font-semibold mb-2 text-purple-600 dark:text-purple-400">
                    Precision
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Attention to detail
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-pink-500/20">
                  <h3 className="text-xl font-semibold mb-2 text-pink-600 dark:text-pink-400">
                    Passion
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Love for coding
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20">
                  <h3 className="text-xl font-semibold mb-2 text-green-600 dark:text-green-400">
                    Quality
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Excellence first
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
