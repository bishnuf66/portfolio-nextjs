"use client";

import React from "react";
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
import { AnimatedSection, StaggeredContainer } from "@/components/ui/AnimatedSection";
import { colorScheme, getCardClasses } from "@/utils/colorUtils";

const TechStackGrid = () => {
    const { isDarkMode } = useStore();

    const techCategories = [
        {
            title: "Frontend Development",
            gradient: "from-blue-500 to-cyan-500",
            technologies: [
                { name: "React", icon: Code, color: "#61DAFB", description: "UI Library" },
                { name: "Next.js", icon: Layers, color: "#000000", description: "React Framework" },
                { name: "TypeScript", icon: Terminal, color: "#3178C6", description: "Type Safety" },
                { name: "Tailwind CSS", icon: Palette, color: "#06B6D4", description: "Styling" },
            ]
        },
        {
            title: "Backend & Database",
            gradient: "from-green-500 to-emerald-500",
            technologies: [
                { name: "Node.js", icon: Cpu, color: "#68A063", description: "Runtime" },
                { name: "Supabase", icon: Database, color: "#3ECF8E", description: "Backend as a Service" },
                { name: "Edge Functions", icon: Zap, color: "#3ECF8E", description: "Serverless Functions" },
                { name: "PostgreSQL", icon: Database, color: "#336791", description: "SQL Database" },
            ]
        },
        {
            title: "Cloud Infrastructure",
            gradient: "from-purple-500 to-pink-500",
            technologies: [
                { name: "AWS EC2", icon: Server, color: "#FF9900", description: "Virtual Servers" },
                { name: "AWS S3", icon: HardDrive, color: "#FF9900", description: "Object Storage" },
                { name: "Azure", icon: Cloud, color: "#0078D4", description: "Microsoft Cloud" },
                { name: "VPS Hosting", icon: Server, color: "#FF6B35", description: "Virtual Private Server" },
            ]
        },
        {
            title: "Storage & Media",
            gradient: "from-indigo-500 to-purple-500",
            technologies: [
                { name: "Supabase Storage", icon: HardDrive, color: "#3ECF8E", description: "File Storage" },
                { name: "Cloudinary", icon: Image, color: "#3448C5", description: "Media Management" },
                { name: "MongoDB", icon: Database, color: "#47A248", description: "NoSQL Database" },
                { name: "cPanel", icon: Settings, color: "#FF6C2C", description: "Hosting Management" },
            ]
        },
        {
            title: "Optimization & Analytics",
            gradient: "from-orange-500 to-red-500",
            technologies: [
                { name: "SEO", icon: TrendingUp, color: "#34A853", description: "Search Optimization" },
                { name: "Performance", icon: Globe, color: "#FF9500", description: "Speed Optimization" },
                { name: "Analytics", icon: TrendingUp, color: "#4285F4", description: "Data Insights" },
                { name: "PWA", icon: Smartphone, color: "#5A0FC8", description: "Progressive Web App" },
            ]
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8">
            <AnimatedSection animation="fadeIn" className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Technology Stack
                </h2>
                <p className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                    Modern tools and technologies I use to build exceptional web experiences
                </p>
            </AnimatedSection>

            <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.15}>
                {techCategories.map((category, categoryIndex) => (
                    <div
                        key={categoryIndex}
                        className={`${getCardClasses("rounded-2xl p-8 border hover:shadow-2xl transition-all duration-300")}`}
                    >
                        <div className="mb-6">
                            <h3 className={`text-2xl font-bold mb-2 bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                                {category.title}
                            </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {category.technologies.map((tech, techIndex) => {
                                const Icon = tech.icon;
                                return (
                                    <div
                                        key={techIndex}
                                        className={`p-4 rounded-xl ${colorScheme.background.tertiary} hover:scale-105 transition-all duration-300 group cursor-pointer`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div
                                                className="p-2 rounded-lg"
                                                style={{ backgroundColor: `${tech.color}20` }}
                                            >
                                                <Icon
                                                    size={20}
                                                    style={{ color: tech.color }}
                                                />
                                            </div>
                                            <div>
                                                <h4 className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                                                    {tech.name}
                                                </h4>
                                            </div>
                                        </div>
                                        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                                            {tech.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </StaggeredContainer>

            {/* Additional Skills */}
            <AnimatedSection
                animation="slideUp"
                delay={0.6}
                className={`mt-12 p-8 rounded-2xl ${getCardClasses("border")}`}
            >
                <h3 className={`text-xl font-bold mb-4 text-center ${colorScheme.text.primary}`}>
                    Additional Expertise
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        "Responsive Design", "API Integration", "Database Design", "Performance Optimization",
                        "Security Best Practices", "CI/CD", "Testing", "Code Review", "Agile Development",
                        "Version Control (Git)", "Docker", "Linux Administration", "AWS Lambda", "Serverless Architecture",
                        "CDN Configuration", "SSL/TLS", "Load Balancing", "Auto Scaling", "Backup Strategies",
                        "Monitoring & Logging", "DevOps", "Infrastructure as Code"
                    ].map((skill, index) => (
                        <span
                            key={index}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${isDarkMode
                                ? "bg-blue-900/50 text-blue-200 border border-blue-700"
                                : "bg-blue-100 text-blue-800 border border-blue-200"
                                } hover:scale-105 transition-transform duration-200`}
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </AnimatedSection>
        </div>
    );
};

export default TechStackGrid;