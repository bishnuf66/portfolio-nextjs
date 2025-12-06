"use client";

import React, { useEffect, useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import useStore from "@/store/store";
import Image from "next/image";
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/Spotlight";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { MovingBorder } from "@/components/ui/MovingBorder";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";
import { GlowingStarsBackgroundCard } from "@/components/ui/GlowingStars";
import {
  Code2,
  Rocket,
  Sparkles,
  Zap,
  Globe,
  Database,
  Layers,
  Terminal,
} from "lucide-react";

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
      <div id="home" className="relative w-full min-h-screen overflow-hidden">
        {/* Background with Spotlight */}
        <div className="absolute inset-0 bg-black/96">
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
                <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 via-purple-500 to-pink-500">
                  <Typewriter
                    words={[
                      "Bishnu BK",
                      "Full Stack Developer",
                      "Creative Coder",
                    ]}
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
                  <span className="text-blue-400 font-semibold">
                    creativity
                  </span>{" "}
                  with{" "}
                  <span className="text-purple-400 font-semibold">
                    functionality
                  </span>
                  . Building solutions that tell a story.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="#projects"
                    className="px-8 py-3 bg-linear-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
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
                    <div className="text-3xl font-bold text-purple-400">
                      3+
                    </div>
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
              src="/coding2.png"
              alt="Coding workspace"
              fill
              unoptimized
              className={`object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              priority
              onLoad={() => setImageLoaded(true)}
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/50 via-transparent to-black/80"></div>
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

      {/* Skills & Expertise Section with Bento Grid */}
      <div
        className={`py-20 ${isDarkMode ? "bg-black text-white" : "bg-gray-50 text-black"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">
              <TextGenerateEffect words="Skills & Expertise" />
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Technologies and tools I work with
            </p>
          </div>

          <BentoGrid className="max-w-7xl mx-auto">
            <BentoGridItem
              title="Frontend Development"
              description="Building responsive and interactive user interfaces with modern frameworks"
              header={
                <div className="flex items-center justify-center h-full bg-linear-to-br from-blue-500 to-cyan-500 rounded-lg">
                  <Code2 className="w-16 h-16 text-white" />
                </div>
              }
              icon={<Globe className="w-6 h-6 text-blue-500" />}
              className="md:col-span-2"
            />
            <BentoGridItem
              title="Backend Architecture"
              description="Scalable server-side solutions with Node.js, Express, and databases"
              header={
                <div className="flex items-center justify-center h-full bg-linear-to-br from-purple-500 to-pink-500 rounded-lg">
                  <Database className="w-16 h-16 text-white" />
                </div>
              }
              icon={<Layers className="w-6 h-6 text-purple-500" />}
            />
            <BentoGridItem
              title="Full Stack Magic"
              description="End-to-end application development from concept to deployment"
              header={
                <div className="flex items-center justify-center h-full bg-linear-to-br from-orange-500 to-red-500 rounded-lg">
                  <Rocket className="w-16 h-16 text-white" />
                </div>
              }
              icon={<Zap className="w-6 h-6 text-orange-500" />}
            />
            <BentoGridItem
              title="Modern Tooling"
              description="Git, Docker, CI/CD, and cloud platforms for efficient workflows"
              header={
                <div className="flex items-center justify-center h-full bg-linear-to-br from-green-500 to-teal-500 rounded-lg">
                  <Terminal className="w-16 h-16 text-white" />
                </div>
              }
              icon={<Sparkles className="w-6 h-6 text-green-500" />}
              className="md:col-span-2"
            />
          </BentoGrid>
        </div>
      </div>

      {/* Tech Stack Section */}
      <div className={`py-20 ${isDarkMode ? "bg-neutral-950" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Tech Stack
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Technologies I use to bring ideas to life
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <GlowingStarsBackgroundCard>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Frontend
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Tailwind CSS",
                    "Framer Motion",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </GlowingStarsBackgroundCard>

            <GlowingStarsBackgroundCard>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Backend</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    "Node.js",
                    "Express",
                    "MongoDB",
                    "PostgreSQL",
                    "Supabase",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </GlowingStarsBackgroundCard>

            <GlowingStarsBackgroundCard>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Tools</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["Git", "Docker", "Vercel", "AWS", "Figma"].map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </GlowingStarsBackgroundCard>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={`py-20 ${isDarkMode ? "bg-black" : "bg-gray-50"}`}>
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-5xl font-bold mb-6 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Let's Build Something Amazing
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Have a project in mind? Let's collaborate and create something
            extraordinary together.
          </p>
          <MovingBorder
            duration={3000}
            className="px-8 py-4 rounded-full"
            as="a"
            href="#contact"
          >
            <span className="text-lg font-semibold">Get In Touch</span>
          </MovingBorder>
        </div>
      </div>
    </>
  );
};

export default Home;
