"use client";

import React, { useState } from "react";
import {
    Code,
    Cpu,
    Globe,
    Database,
    Terminal,
    Server,
    Cloud,
    Settings,
    TrendingUp,
    Layers,
    Smartphone,
    Palette,
    Zap,
    HardDrive,
    Image
} from "lucide-react";
import useStore from "@/store/store";

const TechShowcase = () => {
    const { isDarkMode } = useStore();
    const [activeCategory, setActiveCategory] = useState("all");

    const allTechnologies = [
        // Frontend
        { name: "React", icon: Code, color: "#61DAFB", category: "frontend", description: "UI Library for building user interfaces" },
        { name: "Next.js", icon: Layers, color: "#000000", category: "frontend", description: "React framework for production" },
        { name: "TypeScript", icon: Terminal, color: "#3178C6", category: "frontend", description: "Typed JavaScript at scale" },
        { name: "Tailwind CSS", icon: Palette, color: "#06B6D4", category: "frontend", description: "Utility-first CSS framework" },

        // Backend & Database
        { name: "Node.js", icon: Cpu, color: "#68A063", category: "backend", description: "JavaScript runtime environment" },
        { name: "Supabase", icon: Database, color: "#3ECF8E", category: "backend", description: "Open source Firebase alternative" },
        { name: "Edge Functions", icon: Zap, color: "#3ECF8E", category: "backend", description: "Serverless functions at the edge" },
        { name: "PostgreSQL", icon: Database, color: "#336791", category: "backend", description: "Advanced open source database" },
        { name: "MongoDB", icon: Database, color: "#47A248", category: "backend", description: "NoSQL document database" },

        // Cloud Infrastructure
        { name: "AWS EC2", icon: Server, color: "#FF9900", category: "cloud", description: "Scalable virtual servers in the cloud" },
        { name: "AWS S3", icon: HardDrive, color: "#FF9900", category: "cloud", description: "Object storage for the internet" },
        { name: "Azure", icon: Cloud, color: "#0078D4", category: "cloud", description: "Microsoft's cloud computing platform" },
        { name: "VPS Hosting", icon: Server, color: "#FF6B35", category: "cloud", description: "Virtual private server hosting" },

        // Storage & Media
        { name: "Supabase Storage", icon: HardDrive, color: "#3ECF8E", category: "storage", description: "File storage with CDN" },
        { name: "Cloudinary", icon: Image, color: "#3448C5", category: "storage", description: "Media management and optimization" },
        { name: "cPanel", icon: Settings, color: "#FF6C2C", category: "storage", description: "Web hosting control panel" },

        // Optimization
        { name: "SEO", icon: TrendingUp, color: "#34A853", category: "optimization", description: "Search engine optimization" },
        { name: "Performance", icon: Globe, color: "#FF9500", category: "optimization", description: "Web performance optimization" },
        { name: "PWA", icon: Smartphone, color: "#5A0FC8", category: "optimization", description: "Progressive web applications" },
    ];

    const categories = [
        { id: "all", name: "All Technologies", count: allTechnologies.length },
        { id: "frontend", name: "Frontend", count: allTechnologies.filter(t => t.category === "frontend").length },
        { id: "backend", name: "Backend", count: allTechnologies.filter(t => t.category === "backend").length },
        { id: "cloud", name: "Cloud", count: allTechnologies.filter(t => t.category === "cloud").length },
        { id: "storage", name: "Storage", count: allTechnologies.filter(t => t.category === "storage").length },
        { id: "optimization", name: "Optimization", count: allTechnologies.filter(t => t.category === "optimization").length },
    ];

    const filteredTechnologies = activeCategory === "all"
        ? allTechnologies
        : allTechnologies.filter(tech => tech.category === activeCategory);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Complete Tech Stack
                </h2>
                <p className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Comprehensive overview of all technologies and tools I work with
                </p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${activeCategory === category.id
                                ? "bg-blue-600 text-white shadow-lg scale-105"
                                : isDarkMode
                                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                    >
                        {category.name}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${activeCategory === category.id
                                ? "bg-white/20"
                                : isDarkMode
                                    ? "bg-gray-700"
                                    : "bg-gray-200"
                            }`}>
                            {category.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Technologies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredTechnologies.map((tech, index) => {
                    const Icon = tech.icon;
                    return (
                        <div
                            key={index}
                            className={`p-6 rounded-2xl ${isDarkMode ? "bg-gray-800/50" : "bg-white"
                                } border ${isDarkMode ? "border-gray-700" : "border-gray-200"
                                } hover:shadow-2xl hover:scale-105 transition-all duration-300 group`}
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div
                                    className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-300"
                                    style={{ backgroundColor: `${tech.color}20` }}
                                >
                                    <Icon
                                        size={24}
                                        style={{ color: tech.color }}
                                    />
                                </div>
                                <div>
                                    <h3 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                        {tech.name}
                                    </h3>
                                    <span
                                        className="text-xs px-2 py-1 rounded-full font-medium"
                                        style={{
                                            backgroundColor: `${tech.color}20`,
                                            color: tech.color
                                        }}
                                    >
                                        {tech.category}
                                    </span>
                                </div>
                            </div>
                            <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {tech.description}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Stats */}
            <div className={`mt-16 p-8 rounded-2xl ${isDarkMode ? "bg-gray-800/30" : "bg-gray-50"} border ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
                    {categories.slice(1).map((category, index) => (
                        <div key={category.id} className="space-y-2">
                            <div
                                className="text-3xl font-bold"
                                style={{ color: ["#61DAFB", "#3ECF8E", "#FF9900", "#3448C5", "#34A853"][index] }}
                            >
                                {category.count}
                            </div>
                            <div className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                {category.name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TechShowcase;