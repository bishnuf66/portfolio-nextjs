"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import useStore from "@/store/store";
import {
  ScrollReveal,
  ScrollFade,
  ParallaxText,
  SplitTextReveal,
  ScrollScale,
} from "./ScrollReveal";
import {
  Code2,
  Rocket,
  Database,
  Globe,
  Layers,
  Terminal,
  Smartphone,
  AppWindow,
} from "lucide-react";
import ThreeCanvas from "./ThreeCanvas";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import { GlowingStarsBackgroundCard } from "@/components/ui/GlowingStars";
import dynamic from "next/dynamic";
import { colorScheme } from "@/utils/colorUtils";

// Dynamically import the solar system to avoid SSR issues
const TechSolarSystem = dynamic(() => import("@/components/TechSolarSystem"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Loading Solar System...</p>
      </div>
    </div>
  ),
});

export default function UnifiedShowcase() {
  const { isDarkMode } = useStore();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div
      ref={containerRef}
      className={`relative ${colorScheme.page} overflow-x-hidden max-w-[100vw]`}
    >
      {/* Hero Section with Solar System */}
      <section
        className={`relative min-h-screen flex items-center justify-center overflow-hidden py-20 ${colorScheme.background.primary}`}
      >
        <motion.div style={{ y: backgroundY }} className="absolute inset-0 z-0">
          <div
            className={`absolute inset-0 blur-3xl ${colorScheme.background.secondary}`}
          ></div>
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="left">
            <div>
              <ParallaxText speed={0.3}>
                <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Craft
                </h2>
              </ParallaxText>
              <SplitTextReveal
                text="Building digital experiences that blend creativity with functionality. Every pixel matters. Every interaction counts."
                className={`text-xl md:text-2xl leading-relaxed ${
                  isDarkMode ? "opacity-80" : "text-gray-700"
                }`}
              />
            </div>
          </ScrollReveal>

          <ScrollScale>
            <div className="flex justify-center items-center">
              <ThreeCanvas />
            </div>
          </ScrollScale>
        </div>
      </section>

      {/* Skills & Expertise with Bento Grid */}
      <section className={`py-20 ${colorScheme.background.secondary}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollFade>
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Skills & Expertise
              </h2>
              <p className="text-xl opacity-70">
                Technologies and tools I work with
              </p>
            </div>
          </ScrollFade>

          <BentoGrid className="max-w-7xl mx-auto">
            <ScrollReveal direction="up" delay={0.1}>
              <BentoGridItem
                title="Frontend Development"
                description="Building responsive and interactive user interfaces with modern frameworks"
                header={
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                    <Code2 className="w-16 h-16 text-white" />
                  </div>
                }
                icon={<Globe className="w-6 h-6 text-blue-500" />}
                className="md:col-span-2"
              />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <BentoGridItem
                title="Mobile Development"
                description="Cross-platform mobile apps with React Native and Flutter for iOS and Android"
                header={
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                    <Smartphone className="w-16 h-16 text-white" />
                  </div>
                }
                icon={<AppWindow className="w-6 h-6 text-indigo-500" />}
              />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <BentoGridItem
                title="Backend Architecture"
                description="Scalable server-side solutions with Node.js, Express, and databases"
                header={
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                    <Database className="w-16 h-16 text-white" />
                  </div>
                }
                icon={<Layers className="w-6 h-6 text-purple-500" />}
              />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <BentoGridItem
                title="Mobile Development"
                description="Cross-platform mobile apps with React Native and Flutter for iOS and Android"
                header={
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg">
                    <Smartphone className="w-16 h-16 text-white" />
                  </div>
                }
                icon={<AppWindow className="w-6 h-6 text-indigo-500" />}
              />
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <BentoGridItem
                title="Modern Tooling"
                description="Git, Docker, CI/CD, and cloud platforms for efficient workflows"
                header={
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-500 to-teal-500 rounded-lg">
                    <Terminal className="w-16 h-16 text-white" />
                  </div>
                }
                icon={<Code2 className="w-6 h-6 text-green-500" />}
                className="md:col-span-2"
              />
            </ScrollReveal>
          </BentoGrid>
        </div>
      </section>

      {/* Tech Stack Showcase with Solar System */}
      <section className={`py-20 ${colorScheme.background.primary}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <ScrollFade>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Globe
                  size={40}
                  className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                />
                <h2 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                  Tech Stack
                </h2>
                <Rocket
                  size={40}
                  className={isDarkMode ? "text-cyan-400" : "text-cyan-600"}
                />
              </div>
              <p
                className={`text-xl ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Explore my technology universe - Interactive 3D solar system
              </p>
            </div>
          </ScrollFade>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="h-full">
                <GlowingStarsBackgroundCard>
                  <div className="text-center h-full flex flex-col justify-between min-h-[200px] py-6">
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
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <div className="h-full">
                <GlowingStarsBackgroundCard>
                  <div className="text-center h-full flex flex-col justify-between min-h-[200px] py-6">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Mobile
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "React Native",
                        "Flutter",
                        "iOS",
                        "Android",
                        "Expo",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlowingStarsBackgroundCard>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <div className="h-full">
                <GlowingStarsBackgroundCard>
                  <div className="text-center h-full flex flex-col justify-between min-h-[200px] py-6">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Backend
                    </h3>
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
              </div>
            </ScrollReveal>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <ScrollReveal direction="up" delay={0.4}>
              <div className="h-full">
                <GlowingStarsBackgroundCard>
                  <div className="text-center h-full flex flex-col justify-between min-h-[200px] py-6">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Tools
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["Git", "Docker", "Vercel", "AWS", "Figma"].map(
                        (tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm"
                          >
                            {tech}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </GlowingStarsBackgroundCard>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.5}>
              <div className="h-full">
                <GlowingStarsBackgroundCard>
                  <div className="text-center h-full flex flex-col justify-between min-h-[200px] py-6">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      DevOps
                    </h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "CI/CD",
                        "Kubernetes",
                        "Jenkins",
                        "Terraform",
                        "GitHub Actions",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlowingStarsBackgroundCard>
              </div>
            </ScrollReveal>
          </div>

          {/* Additional Tech Icons Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 mt-16">
            {[
              { name: "React", icon: "⚛️", color: "from-blue-400 to-cyan-400" },
              {
                name: "Next.js",
                icon: "▲",
                color: "from-gray-700 to-gray-900",
              },
              {
                name: "TypeScript",
                icon: "TS",
                color: "from-blue-600 to-blue-800",
              },
              {
                name: "Node.js",
                icon: "🟢",
                color: "from-green-500 to-green-700",
              },
              {
                name: "MongoDB",
                icon: "🍃",
                color: "from-green-600 to-green-800",
              },
              {
                name: "PostgreSQL",
                icon: "🐘",
                color: "from-blue-500 to-blue-700",
              },
              {
                name: "Tailwind",
                icon: "🎨",
                color: "from-cyan-400 to-blue-500",
              },
              {
                name: "Three.js",
                icon: "🎮",
                color: "from-purple-500 to-pink-500",
              },
            ].map((tech, index) => (
              <ScrollReveal key={tech.name} direction="up" delay={index * 0.05}>
                <div
                  className={`p-6 rounded-2xl ${colorScheme.background.secondary}/50 backdrop-blur-xl border ${colorScheme.border.primary} hover:scale-110 transition-transform duration-300 text-center`}
                >
                  <div className="text-4xl mb-2">{tech.icon}</div>
                  <h3
                    className={`text-sm font-bold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}
                  >
                    {tech.name}
                  </h3>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Interactive 3D Solar System */}
          <ScrollFade>
            <div className="mt-20">
              <TechSolarSystem />
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* Performance & Scale Section */}
      <section className={`py-20 ${colorScheme.background.secondary}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <ScrollReveal direction="left">
              <div>
                <ParallaxText speed={0.3}>
                  <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                    Speed
                  </h2>
                </ParallaxText>
                <SplitTextReveal
                  text="Optimized for performance. Built for scale. Delivering experiences that load instantly and run smoothly."
                  className="text-xl md:text-2xl leading-relaxed opacity-80"
                />
              </div>
            </ScrollReveal>

            <ScrollScale>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-30 rounded-full"></div>
                <div
                  className={`relative p-12 rounded-3xl ${colorScheme.background.secondary}/50 backdrop-blur-xl border ${colorScheme.border.primary}`}
                >
                  <Rocket size={80} className="text-purple-500 mb-6" />
                  <h3 className="text-3xl font-bold mb-4">Performance</h3>
                  <p className="text-lg opacity-70">
                    Lightning-fast load times and smooth interactions that keep
                    users engaged and coming back.
                  </p>
                </div>
              </div>
            </ScrollScale>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollScale>
              <div className="relative order-2 md:order-1">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 blur-3xl opacity-30 rounded-full"></div>
                <div
                  className={`relative p-12 rounded-3xl ${colorScheme.background.secondary}/50 backdrop-blur-xl border ${colorScheme.border.primary}`}
                >
                  <Database size={80} className="text-green-500 mb-6" />
                  <h3 className="text-3xl font-bold mb-4">Architecture</h3>
                  <p className="text-lg opacity-70">
                    Robust backend systems and scalable infrastructure that
                    handles millions of requests effortlessly.
                  </p>
                </div>
              </div>
            </ScrollScale>

            <ScrollReveal direction="right">
              <div className="order-1 md:order-2">
                <ParallaxText speed={0.3}>
                  <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                    Scale
                  </h2>
                </ParallaxText>
                <SplitTextReveal
                  text="From startup to enterprise. Building solutions that grow with your business and adapt to your needs."
                  className="text-xl md:text-2xl leading-relaxed opacity-80"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
