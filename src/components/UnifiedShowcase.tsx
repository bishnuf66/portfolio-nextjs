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
} from "lucide-react";
import ThreeCanvas from "./ThreeCanvas";
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
                <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
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

      {/* Skills & Expertise with Enhanced Solar System Theme */}
      <section
        className={`py-20 ${colorScheme.background.secondary} relative overflow-hidden`}
      >
        {/* Animated star background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-10 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-10 w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
        </div>

        {/* Skills & Expertise Title */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 mb-12">
          <ScrollFade>
            <div className="text-center">
              <h2 className="font-display text-3xl md:text-5xl font-bold mb-4 bg-linear-to-r from-blue-500 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Skills & Expertise
              </h2>
              <p className="text-xl opacity-70">
                Technologies and tools I work with across the digital universe
              </p>
            </div>
          </ScrollFade>
        </div>

        {/* Unified Skills Cards - Merging GlowingStars and BentoGrid */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Frontend Development Card */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="h-full">
                <GlowingStarsBackgroundCard glowingStarsCount={8}>
                  <div className="text-center h-full flex flex-col justify-between min-h-[280px] py-8 px-4 relative">
                    {/* Icon and Title */}
                    <div className="flex flex-col items-center">
                      <Code2 className="w-14 h-14 text-blue-300 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Frontend Development
                      </h3>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full mb-4">
                        React Expert
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-sm mb-6 leading-relaxed">
                      Building responsive and interactive user interfaces with
                      modern frameworks
                    </p>

                    {/* Tech Tags */}
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
                          className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlowingStarsBackgroundCard>
              </div>
            </ScrollReveal>

            {/* Backend Development Card */}
            <ScrollReveal direction="up" delay={0.2}>
              <div className="h-full">
                <GlowingStarsBackgroundCard glowingStarsCount={6}>
                  <div className="text-center h-full flex flex-col justify-between min-h-[280px] py-8 px-4 relative">
                    {/* Icon and Title */}
                    <div className="flex flex-col items-center">
                      <Database className="w-14 h-14 text-purple-300 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Backend Architecture
                      </h3>
                      <span className="text-xs bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full mb-4">
                        Scalable
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-sm mb-6 leading-relaxed">
                      Scalable server-side solutions with Node.js, Express, and
                      databases
                    </p>

                    {/* Tech Tags */}
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
                          className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlowingStarsBackgroundCard>
              </div>
            </ScrollReveal>

            {/* Database Systems Card */}
            <ScrollReveal direction="up" delay={0.3}>
              <div className="h-full">
                <GlowingStarsBackgroundCard glowingStarsCount={5}>
                  <div className="text-center h-full flex flex-col justify-between min-h-[280px] py-8 px-4 relative">
                    {/* Icon and Title */}
                    <div className="flex flex-col items-center">
                      <Layers className="w-14 h-14 text-orange-300 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Database Systems
                      </h3>
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full mb-4">
                        Performance
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-sm mb-6 leading-relaxed">
                      High-performance database solutions for modern
                      applications
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        "MongoDB",
                        "MySQL",
                        "PostgreSQL",
                        "Redis",
                        "Elasticsearch",
                      ].map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlowingStarsBackgroundCard>
              </div>
            </ScrollReveal>

            {/* Mobile Development Card */}
            <ScrollReveal direction="up" delay={0.4}>
              <div className="h-full">
                <GlowingStarsBackgroundCard glowingStarsCount={4}>
                  <div className="text-center h-full flex flex-col justify-between min-h-[280px] py-8 px-4 relative">
                    {/* Icon and Title */}
                    <div className="flex flex-col items-center">
                      <Smartphone className="w-14 h-14 text-indigo-300 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Mobile Development
                      </h3>
                      <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full mb-4">
                        Cross-Platform
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-sm mb-6 leading-relaxed">
                      Cross-platform mobile apps with React Native and Flutter
                    </p>

                    {/* Tech Tags */}
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
                          className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlowingStarsBackgroundCard>
              </div>
            </ScrollReveal>

            {/* Cloud Infrastructure Card */}
            <ScrollReveal direction="up" delay={0.5}>
              <div className="h-full">
                <GlowingStarsBackgroundCard glowingStarsCount={7}>
                  <div className="text-center h-full flex flex-col justify-between min-h-[280px] py-8 px-4 relative">
                    {/* Icon and Title */}
                    <div className="flex flex-col items-center">
                      <Terminal className="w-14 h-14 text-cyan-300 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Cloud Infrastructure
                      </h3>
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full mb-4">
                        DevOps
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-sm mb-6 leading-relaxed">
                      Cloud platforms and deployment solutions for scalability
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["AWS", "Azure", "Vercel", "Netlify", "CDN"].map(
                        (tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs"
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

            {/* Modern Tooling Card */}
            <ScrollReveal direction="up" delay={0.6}>
              <div className="h-full">
                <GlowingStarsBackgroundCard glowingStarsCount={5}>
                  <div className="text-center h-full flex flex-col justify-between min-h-[280px] py-8 px-4 relative">
                    {/* Icon and Title */}
                    <div className="flex flex-col items-center">
                      <Globe className="w-14 h-14 text-green-300 mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">
                        Modern Tooling
                      </h3>
                      <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full mb-4">
                        CI/CD
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-white/70 text-sm mb-6 leading-relaxed">
                      Git, Docker, CI/CD, and cloud platforms for efficient
                      workflows
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["Git", "Docker", "CI/CD", "AWS", "Vercel"].map(
                        (tech) => (
                          <span
                            key={tech}
                            className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs"
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
          </div>
        </div>
      </section>

      {/*  Solar System */}
      <section className={`py-20 ${colorScheme.background.primary}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 mb-16"></div>

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
                    className={`text-sm font-bold bg-linear-to-r ${tech.color} bg-clip-text text-transparent`}
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
                  <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-linear-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
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
                <div className="absolute inset-0 bg-linear-to-r from-purple-500 to-pink-500 blur-3xl opacity-30 rounded-full"></div>
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
                <div className="absolute inset-0 bg-linear-to-r from-green-500 to-teal-500 blur-3xl opacity-30 rounded-full"></div>
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
                  <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-linear-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
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
