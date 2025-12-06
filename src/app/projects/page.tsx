"use client";

import React, { useState } from "react";
import Link from "next/link";
import useStore from "@/store/store";
import { Briefcase, Code, Sparkles } from "lucide-react";
import { TextGenerateEffect } from "@/components/ui/TextGenerateEffect";

export default function ProjectsPage() {
    const { isDarkMode } = useStore();

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                } pt-20`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4">
                        <TextGenerateEffect words="My Projects" />
                    </h1>
                    <p
                        className={`text-xl max-w-3xl mx-auto ${isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                    >
                        Explore my work across professional client projects and personal experiments
                    </p>
                </div>

                {/* Project Categories */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Professional Projects */}
                    <Link
                        href="/projects/professional"
                        className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 ${isDarkMode
                                ? "bg-gradient-to-br from-blue-900/50 to-purple-900/50 hover:shadow-2xl hover:shadow-blue-500/30"
                                : "bg-gradient-to-br from-blue-100 to-purple-100 hover:shadow-2xl hover:shadow-blue-500/30"
                            }`}
                    >
                        <div className="relative z-10">
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDarkMode ? "bg-blue-500/20" : "bg-blue-500/30"
                                    }`}
                            >
                                <Briefcase
                                    size={32}
                                    className={isDarkMode ? "text-blue-400" : "text-blue-600"}
                                />
                            </div>
                            <h2
                                className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                Professional Projects
                            </h2>
                            <p
                                className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                            >
                                Client work, production applications, and commercial projects that solve real-world problems
                            </p>
                            <div
                                className={`inline-flex items-center gap-2 font-semibold group-hover:gap-4 transition-all ${isDarkMode ? "text-blue-400" : "text-blue-600"
                                    }`}
                            >
                                View Projects
                                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                    </Link>

                    {/* Personal Projects */}
                    <Link
                        href="/projects/personal"
                        className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 ${isDarkMode
                                ? "bg-gradient-to-br from-purple-900/50 to-pink-900/50 hover:shadow-2xl hover:shadow-purple-500/30"
                                : "bg-gradient-to-br from-purple-100 to-pink-100 hover:shadow-2xl hover:shadow-purple-500/30"
                            }`}
                    >
                        <div className="relative z-10">
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ${isDarkMode ? "bg-purple-500/20" : "bg-purple-500/30"
                                    }`}
                            >
                                <Code
                                    size={32}
                                    className={isDarkMode ? "text-purple-400" : "text-purple-600"}
                                />
                            </div>
                            <h2
                                className={`text-3xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"
                                    }`}
                            >
                                Personal Projects
                            </h2>
                            <p
                                className={`text-lg mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"
                                    }`}
                            >
                                Side projects, experiments, and passion projects where I explore new technologies and ideas
                            </p>
                            <div
                                className={`inline-flex items-center gap-2 font-semibold group-hover:gap-4 transition-all ${isDarkMode ? "text-purple-400" : "text-purple-600"
                                    }`}
                            >
                                View Projects
                                <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500"></div>
                    </Link>
                </div>

                {/* Stats Section */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                    {[
                        { label: "Total Projects", value: "24+", color: "blue" },
                        { label: "Technologies", value: "15+", color: "purple" },
                        { label: "Years Experience", value: "3+", color: "pink" },
                        { label: "Happy Clients", value: "10+", color: "cyan" },
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className={`text-center p-6 rounded-xl ${isDarkMode ? "bg-gray-800/50" : "bg-white"
                                } border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
                        >
                            <div
                                className={`text-4xl font-bold mb-2 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 bg-clip-text text-transparent`}
                            >
                                {stat.value}
                            </div>
                            <div
                                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                    }`}
                            >
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
