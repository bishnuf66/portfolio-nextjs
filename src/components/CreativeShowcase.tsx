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
import { Code2, Rocket, Sparkles, Zap, Globe, Database } from "lucide-react";

export default function CreativeShowcase() {
    const { isDarkMode } = useStore();
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);

    return (
        <div
            ref={containerRef}
            className={`relative ${isDarkMode ? "bg-black text-white" : "bg-white text-black"
                }`}
        >
            {/* Hero Section with Parallax */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    style={{ y: backgroundY, opacity }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl"></div>
                </motion.div>

                <div className="relative z-10 text-center px-4">
                    <ScrollFade>
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
                        >
                            <h1 className="text-7xl md:text-9xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Craft
                            </h1>
                        </motion.div>
                    </ScrollFade>

                    <SplitTextReveal
                        text="Building digital experiences that inspire and innovate"
                        className="text-2xl md:text-4xl font-light"
                        delay={0.5}
                    />
                </div>
            </section>

            {/* Feature Section 1 */}
            <section className="min-h-screen flex items-center justify-center py-20 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <ScrollReveal direction="left">
                        <div>
                            <ParallaxText speed={0.3}>
                                <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                                    Design
                                </h2>
                            </ParallaxText>
                            <SplitTextReveal
                                text="Every pixel matters. Every interaction counts. Creating interfaces that feel natural and look stunning."
                                className="text-xl md:text-2xl leading-relaxed opacity-80"
                            />
                        </div>
                    </ScrollReveal>

                    <ScrollScale>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 blur-3xl opacity-30 rounded-full"></div>
                            <div
                                className={`relative p-12 rounded-3xl ${isDarkMode ? "bg-gray-900/50" : "bg-gray-100/50"
                                    } backdrop-blur-xl border ${isDarkMode ? "border-gray-800" : "border-gray-200"
                                    }`}
                            >
                                <Code2 size={80} className="text-blue-500 mb-6" />
                                <h3 className="text-3xl font-bold mb-4">Clean Code</h3>
                                <p className="text-lg opacity-70">
                                    Writing maintainable, scalable, and performant code that
                                    stands the test of time.
                                </p>
                            </div>
                        </div>
                    </ScrollScale>
                </div>
            </section>

            {/* Feature Section 2 */}
            <section className="min-h-screen flex items-center justify-center py-20 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <ScrollScale>
                        <div className="relative order-2 md:order-1">
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-3xl opacity-30 rounded-full"></div>
                            <div
                                className={`relative p-12 rounded-3xl ${isDarkMode ? "bg-gray-900/50" : "bg-gray-100/50"
                                    } backdrop-blur-xl border ${isDarkMode ? "border-gray-800" : "border-gray-200"
                                    }`}
                            >
                                <Rocket size={80} className="text-purple-500 mb-6" />
                                <h3 className="text-3xl font-bold mb-4">Performance</h3>
                                <p className="text-lg opacity-70">
                                    Lightning-fast load times and smooth interactions that keep
                                    users engaged.
                                </p>
                            </div>
                        </div>
                    </ScrollScale>

                    <ScrollReveal direction="right">
                        <div className="order-1 md:order-2">
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
                </div>
            </section>

            {/* Feature Section 3 */}
            <section className="min-h-screen flex items-center justify-center py-20 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <ScrollReveal direction="left">
                        <div>
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

                    <ScrollScale>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-teal-500 blur-3xl opacity-30 rounded-full"></div>
                            <div
                                className={`relative p-12 rounded-3xl ${isDarkMode ? "bg-gray-900/50" : "bg-gray-100/50"
                                    } backdrop-blur-xl border ${isDarkMode ? "border-gray-800" : "border-gray-200"
                                    }`}
                            >
                                <Database size={80} className="text-green-500 mb-6" />
                                <h3 className="text-3xl font-bold mb-4">Architecture</h3>
                                <p className="text-lg opacity-70">
                                    Robust backend systems and scalable infrastructure that
                                    handles millions of requests.
                                </p>
                            </div>
                        </div>
                    </ScrollScale>
                </div>
            </section>

            {/* Tech Stack Showcase */}
            <section className="min-h-screen flex items-center justify-center py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <ScrollFade>
                        <h2 className="text-6xl md:text-8xl font-bold mb-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Tech Stack
                        </h2>
                    </ScrollFade>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-16">
                        {[
                            { name: "React", icon: "⚛️", color: "from-blue-400 to-cyan-400" },
                            { name: "Next.js", icon: "▲", color: "from-gray-700 to-gray-900" },
                            { name: "TypeScript", icon: "TS", color: "from-blue-600 to-blue-800" },
                            { name: "Node.js", icon: "🟢", color: "from-green-500 to-green-700" },
                            { name: "MongoDB", icon: "🍃", color: "from-green-600 to-green-800" },
                            { name: "PostgreSQL", icon: "🐘", color: "from-blue-500 to-blue-700" },
                            { name: "Tailwind", icon: "🎨", color: "from-cyan-400 to-blue-500" },
                            { name: "Three.js", icon: "🎮", color: "from-purple-500 to-pink-500" },
                        ].map((tech, index) => (
                            <ScrollReveal
                                key={tech.name}
                                direction="up"
                                delay={index * 0.1}
                            >
                                <div
                                    className={`p-8 rounded-2xl ${isDarkMode ? "bg-gray-900/50" : "bg-gray-100/50"
                                        } backdrop-blur-xl border ${isDarkMode ? "border-gray-800" : "border-gray-200"
                                        } hover:scale-110 transition-transform duration-300`}
                                >
                                    <div className="text-5xl mb-4">{tech.icon}</div>
                                    <h3
                                        className={`text-xl font-bold bg-gradient-to-r ${tech.color} bg-clip-text text-transparent`}
                                    >
                                        {tech.name}
                                    </h3>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="min-h-screen flex items-center justify-center py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <ScrollScale>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-30"></div>
                            <div className="relative">
                                <Sparkles size={80} className="mx-auto mb-8 text-purple-500" />
                                <h2 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                    Let's Create
                                </h2>
                                <SplitTextReveal
                                    text="Ready to build something amazing together? Let's turn your vision into reality."
                                    className="text-2xl md:text-3xl mb-12 opacity-80"
                                />
                                <ScrollReveal direction="up" delay={0.5}>
                                    <a
                                        href="#contact"
                                        className="inline-block px-12 py-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-xl font-bold rounded-full hover:scale-110 transition-transform duration-300 shadow-2xl"
                                    >
                                        Get In Touch
                                    </a>
                                </ScrollReveal>
                            </div>
                        </div>
                    </ScrollScale>
                </div>
            </section>
        </div>
    );
}
