"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getPageClasses,
  getCardClasses,
  colorScheme,
} from "@/utils/colorUtils";
import {
  AnimatedSection,
  StaggeredContainer,
} from "@/components/ui/AnimatedSection";
import useStore from "@/store/store";
import {
  Code2,
  Database,
  Palette,
  Rocket,
  Shield,
  Smartphone,
  Zap,
  Workflow,
  Search,
  Globe,
  Settings,
  Layers,
  X,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import SEOContent from "@/components/SEOContent";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/Button";

type Service = {
  title: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  tags: string[];
};

const services: Service[] = [
  {
    title: "Full Stack Development",
    subtitle: "End-to-end delivery",
    description:
      "Design, build, and ship complete web applications with clean UX, robust APIs, and production-ready deployments.",
    icon: Layers,
    gradient: "from-blue-500 to-cyan-500",
    tags: ["Next.js", "React", "Node.js", "TypeScript"],
  },
  {
    title: "Frontend Development",
    subtitle: "Fast, responsive UI",
    description:
      "Modern interfaces with accessible components, smooth animations, and performance-focused rendering.",
    icon: Code2,
    gradient: "from-purple-500 to-blue-500",
    tags: ["React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Backend & APIs",
    subtitle: "Scalable architecture",
    description:
      "Secure REST APIs, authentication flows, and backend services built to scale with your product.",
    icon: Database,
    gradient: "from-pink-500 to-purple-500",
    tags: ["Node.js", "Express", "PostgreSQL", "Supabase"],
  },
  {
    title: "UI/UX & Design Systems",
    subtitle: "Design that feels premium",
    description:
      "Pixel-clean layouts, consistent design systems, and user-first flows that convert visitors into customers.",
    icon: Palette,
    gradient: "from-amber-500 to-orange-500",
    tags: ["Figma", "shadcn/ui", "Tailwind CSS", "Responsive Design"],
  },
  {
    title: "Performance Optimization",
    subtitle: "Speed & Core Web Vitals",
    description:
      "Improve load time, reduce bundle size, and optimize images, caching, and rendering for a snappy experience.",
    icon: Zap,
    gradient: "from-emerald-500 to-green-500",
    tags: ["Lighthouse", "Caching", "Code Splitting", "Image Optimization"],
  },
  {
    title: "SEO & Technical SEO",
    subtitle: "Search-ready foundation",
    description:
      "Metadata, structured data, sitemap/robots, and content structure improvements that help your site rank.",
    icon: Search,
    gradient: "from-indigo-500 to-blue-500",
    tags: ["Metadata", "Schema", "Sitemap", "Indexing"],
  },
  {
    title: "3D & Interactive Experiences",
    subtitle: "Stand-out visuals",
    description:
      "Interactive 3D and creative UI effects to make your portfolio, landing pages, and products memorable.",
    icon: Globe,
    gradient: "from-cyan-500 to-teal-500",
    tags: ["Three.js", "WebGL", "Animations", "Creative UI"],
  },
  {
    title: "Deployment & Maintenance",
    subtitle: "Reliable shipping",
    description:
      "Deployments, monitoring basics, bug fixes, and ongoing improvements so your product stays healthy.",
    icon: Settings,
    gradient: "from-slate-500 to-gray-600",
    tags: ["Vercel", "CI/CD", "Monitoring", "Updates"],
  },
];

const processSteps = [
  {
    title: "Discover",
    description: "Clarify goals, scope, timeline, and success metrics.",
    icon: Workflow,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Design",
    description: "Wireframes, UI direction, and a clean component system.",
    icon: Smartphone,
    gradient: "from-purple-500 to-blue-500",
  },
  {
    title: "Build",
    description: "Iterative development with clean code and great UX.",
    icon: Rocket,
    gradient: "from-pink-500 to-purple-500",
  },
  {
    title: "Launch",
    description: "Deployment, QA, and handoff with support.",
    icon: Shield,
    gradient: "from-emerald-500 to-green-500",
  },
];

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "What type of projects do you take?",
    answer:
      "Web apps, portfolio and business websites, dashboards, APIs, and custom solutions. If you have an idea, I can help you validate and build it.",
  },
  {
    question: "Do you work with existing codebases?",
    answer:
      "Yes. I can improve UI/UX, add features, refactor, fix bugs, and optimize performance in existing React/Next.js projects.",
  },
  {
    question: "How do you estimate cost and timeline?",
    answer:
      "After understanding scope and requirements, I provide a clear estimate and milestone plan. Smaller sites can take days; full apps typically take weeks depending on complexity.",
  },
  {
    question: "Do you provide ongoing support?",
    answer:
      "Yes. I can help with maintenance, updates, performance improvements, and new feature iterations after launch.",
  },
  {
    question: "What stack do you use?",
    answer:
      "I work with React, Next.js, TypeScript, Tailwind CSS, Node.js, PostgreSQL/MongoDB, Supabase, and modern deployment platforms like Vercel.",
  },
];

export default function ServicesPage() {
  const { isDarkMode } = useStore();

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [quoteForm, setQuoteForm] = useState({
    name: "",
    email: "",
    service: "",
    budget: "",
    timeline: "",
    message: "",
  });

  const isModalOpen = !!selectedService;

  const closeModal = useCallback(() => {
    setSelectedService(null);
  }, []);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, closeModal]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  const modalServiceHighlights = useMemo(() => {
    if (!selectedService) return [];
    const map: Record<string, string[]> = {
      "Full Stack Development": [
        "Product-focused implementation",
        "Frontend + backend + database",
        "Deployment-ready delivery",
      ],
      "Frontend Development": [
        "Modern UI components",
        "Responsive design",
        "Smooth animations",
      ],
      "Backend & APIs": [
        "Secure REST APIs",
        "Auth + rate limiting",
        "Clean data models",
      ],
      "UI/UX & Design Systems": [
        "Reusable design system",
        "Consistent components",
        "User-friendly flows",
      ],
      "Performance Optimization": [
        "Core Web Vitals improvements",
        "Bundle and image optimization",
        "Caching strategies",
      ],
      "SEO & Technical SEO": [
        "Metadata and schema",
        "Sitemap/robots setup",
        "SEO-friendly content structure",
      ],
      "3D & Interactive Experiences": [
        "Three.js experiences",
        "Interactive UI effects",
        "Performance-aware visuals",
      ],
      "Deployment & Maintenance": [
        "Reliable deployments",
        "Bug fixes and updates",
        "Ongoing improvements",
      ],
    };

    return (
      map[selectedService.title] || [
        "Clear deliverables",
        "Modern stack",
        "Quality-first delivery",
      ]
    );
  }, [selectedService]);

  const handleQuoteChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setQuoteForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!quoteForm.name || !quoteForm.email || !quoteForm.message) {
      toast.error("Name, email, and message are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const composedMessage = [
        quoteForm.service ? `Service: ${quoteForm.service}` : "",
        quoteForm.budget ? `Budget: ${quoteForm.budget}` : "",
        quoteForm.timeline ? `Timeline: ${quoteForm.timeline}` : "",
        "",
        quoteForm.message,
      ]
        .filter(Boolean)
        .join("\n");

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: quoteForm.name,
          email: quoteForm.email,
          message: composedMessage,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Request sent! I’ll get back to you soon.");
        setQuoteForm({
          name: "",
          email: "",
          service: "",
          budget: "",
          timeline: "",
          message: "",
        });
      } else {
        toast.error(data.error || "Failed to send request. Please try again.");
      }
    } catch (error) {
      console.error("Error sending quote request:", error);
      toast.error("Failed to send request. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={getPageClasses()}>
      <SEOContent page="services" />

      <section
        className={`relative overflow-hidden ${colorScheme.background.primary}`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute top-32 -right-24 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="absolute top-16 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
          <div className="absolute top-32 right-16 w-1 h-1 bg-purple-400 rounded-full animate-ping" />
          <div className="absolute bottom-24 left-1/3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 relative">
          <AnimatedSection animation="fadeIn" className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-500 via-purple-600 to-cyan-500 bg-clip-text text-transparent">
              Services
            </h1>
            <p
              className={`mt-5 text-xl max-w-3xl mx-auto ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              What I can build for you — from UI to APIs to performance, with a
              focus on quality and modern experience.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/#contact"
                className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-95 transition"
              >
                Start a project
              </Link>
              <Link
                href="/projects"
                className={`${getCardClasses(
                  "px-6 py-3 rounded-lg border shadow-sm hover:shadow-md transition"
                )}`}
              >
                See my work
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section
        className={`py-16 ${colorScheme.background.secondary} relative overflow-hidden`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection animation="slideUp" className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">What I provide</h2>
            <p
              className={`mt-3 ${colorScheme.text.secondary} max-w-3xl mx-auto`}
            >
              Clear deliverables, modern stack, and polished UI with thoughtful
              animations.
            </p>
          </AnimatedSection>

          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.12}
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} className="h-full">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedService(service);
                      setQuoteForm((prev) => ({
                        ...prev,
                        service: service.title,
                      }));
                    }}
                    className={`
                      block w-full text-left h-full rounded-2xl p-6
                      bg-linear-to-br from-slate-900/80 to-slate-800/60
                      border border-slate-700/50
                      hover:border-blue-500/30
                      transition-all duration-300 ease-out
                      hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10
                      before:absolute before:inset-0 before:rounded-2xl
                      before:bg-linear-to-br before:from-blue-500/10 before:to-purple-500/10
                      before:opacity-0 hover:before:opacity-100 before:transition-opacity
                      before:z-[-1]
                      overflow-hidden relative group
                    `}
                  >
                    {/* Top gradient accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 group-hover:opacity-100 transition-opacity" />

                    {/* Icon */}
                    <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-linear-to-br from-blue-500/20 to-purple-500/20 mb-4">
                      <Icon className="w-7 h-7 text-blue-400" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-2">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.tags.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-slate-700/60 text-slate-300 rounded-md text-xs font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center text-blue-400 text-sm font-medium group-hover:text-blue-300 transition-colors">
                      <span>View details</span>
                      <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              );
            })}
          </StaggeredContainer>
        </div>
      </section>

      <AnimatePresence>
        {selectedService &&
          (() => {
            const service = selectedService;
            if (!service) return null;
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-1000"
              >
                <div
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                  onClick={closeModal}
                />
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden ${
                      isDarkMode
                        ? "bg-gray-900 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 p-6 border-b border-black/10 dark:border-white/10">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-xl bg-linear-to-r ${service.gradient} text-white shadow-md`}
                          >
                            <service.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold leading-tight">
                              {service.title}
                            </h3>
                            <p
                              className={`text-sm mt-1 ${
                                isDarkMode ? "text-gray-300" : "text-gray-600"
                              }`}
                            >
                              {service.subtitle}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={closeModal}
                        className={`p-2 rounded-lg transition-colors ${
                          isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
                        }`}
                        aria-label="Close"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6">
                      <p
                        className={`${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {service.description}
                      </p>

                      <div className="mt-6">
                        <h4 className="font-semibold">What you get</h4>
                        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {modalServiceHighlights.map((item) => (
                            <div
                              key={item}
                              className={`flex items-center gap-2 rounded-lg px-3 py-2 ${
                                isDarkMode ? "bg-gray-800" : "bg-gray-50"
                              }`}
                            >
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold">Tech stack</h4>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {service.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-1 rounded-full text-xs border ${
                                isDarkMode
                                  ? "bg-gray-800 border-gray-700 text-gray-200"
                                  : "bg-gray-50 border-gray-200 text-gray-700"
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-8 flex flex-col sm:flex-row gap-3">
                        <Link
                          href="/#contact"
                          onClick={closeModal}
                          className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-95 transition text-center"
                        >
                          Start a project
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            const el = document.getElementById("request-quote");
                            if (el)
                              el.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            closeModal();
                          }}
                          className={`${getCardClasses(
                            "px-6 py-3 rounded-lg border shadow-sm hover:shadow-md transition text-center"
                          )}`}
                        >
                          Request a quote
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })()}
      </AnimatePresence>

      <section className={`py-16 ${colorScheme.background.primary}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection animation="slideUp" className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">How I work</h2>
            <p
              className={`mt-3 ${colorScheme.text.secondary} max-w-3xl mx-auto`}
            >
              Simple, transparent process — so you always know what’s happening.
            </p>
          </AnimatedSection>

          <StaggeredContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            staggerDelay={0.12}
          >
            {processSteps.map((step) => (
              <div
                key={step.title}
                className={`${getCardClasses(
                  "rounded-xl border p-6 shadow-sm hover:shadow-md transition"
                )}`}
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-linear-to-r ${step.gradient} text-white shadow-md`}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className={`mt-2 text-sm ${colorScheme.text.secondary}`}>
                  {step.description}
                </p>
              </div>
            ))}
          </StaggeredContainer>
        </div>
      </section>

      <section className={`py-16 ${colorScheme.background.secondary}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection
            animation="scaleIn"
            className={`${getCardClasses(
              "rounded-2xl border p-8 md:p-10 shadow-lg overflow-hidden relative"
            )}`}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-purple-500/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-blue-500/20 blur-3xl" />
            </div>

            <div className="relative">
              <div className="flex items-center justify-center gap-3">
                <Rocket className="text-purple-500" />
                <h2 className="text-2xl md:text-3xl font-bold">
                  Ready to build something great?
                </h2>
              </div>
              <p
                className={`mt-3 text-center max-w-3xl mx-auto ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Tell me about your idea and I’ll help you turn it into a fast,
                modern, and scalable product.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  href="/#contact"
                  className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:opacity-95 transition"
                >
                  Contact me
                </Link>
                <Link
                  href="/projects"
                  className={`${getCardClasses(
                    "px-6 py-3 rounded-lg border shadow-sm hover:shadow-md transition"
                  )}`}
                >
                  View projects
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section
        id="request-quote"
        className={`py-16 ${colorScheme.background.primary}`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <AnimatedSection animation="slideUp" className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Request a quote</h2>
            <p
              className={`mt-3 ${colorScheme.text.secondary} max-w-3xl mx-auto`}
            >
              Share a few details and I’ll reply with questions, suggestions,
              and an estimate.
            </p>
          </AnimatedSection>

          <AnimatedSection
            animation="fadeIn"
            className={`${getCardClasses(
              "rounded-2xl border p-6 md:p-8 shadow-lg"
            )}`}
          >
            <form
              onSubmit={handleQuoteSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div>
                <label
                  className={`text-sm font-medium ${colorScheme.text.secondary}`}
                  htmlFor="quote-name"
                >
                  Name
                </label>
                <input
                  id="quote-name"
                  name="name"
                  value={quoteForm.name}
                  onChange={handleQuoteChange}
                  className={`mt-2 w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                  placeholder="Your name"
                  required
                />
              </div>

              <div>
                <label
                  className={`text-sm font-medium ${colorScheme.text.secondary}`}
                  htmlFor="quote-email"
                >
                  Email
                </label>
                <input
                  id="quote-email"
                  name="email"
                  type="email"
                  value={quoteForm.email}
                  onChange={handleQuoteChange}
                  className={`mt-2 w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label
                  className={`text-sm font-medium ${colorScheme.text.secondary}`}
                  htmlFor="quote-service"
                >
                  Service
                </label>
                <div className="relative">
                  <select
                    id="quote-service"
                    name="service"
                    value={quoteForm.service}
                    onChange={handleQuoteChange}
                    className={`mt-2 w-full px-4 py-3 rounded-lg border transition-all appearance-none cursor-pointer pr-10 ${
                      isDarkMode
                        ? "bg-gray-900 border-gray-700 text-white"
                        : "bg-white border-gray-300 text-gray-900"
                    } focus:ring-2 focus:ring-pink-500/20 focus:outline-none`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: "right 0.5rem center",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "1.5em 1.5em",
                    }}
                  >
                    <option value="" className="bg-white text-gray-900">
                      Select a service
                    </option>
                    {services.map((s) => (
                      <option
                        key={s.title}
                        value={s.title}
                        className="bg-white text-gray-900"
                      >
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label
                  className={`text-sm font-medium ${colorScheme.text.secondary}`}
                  htmlFor="quote-budget"
                >
                  Budget (optional)
                </label>
                <input
                  id="quote-budget"
                  name="budget"
                  value={quoteForm.budget}
                  onChange={handleQuoteChange}
                  className={`mt-2 w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-blue-500/20 focus:outline-none`}
                  placeholder="e.g. $300 - $800"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className={`text-sm font-medium ${colorScheme.text.secondary}`}
                  htmlFor="quote-timeline"
                >
                  Timeline (optional)
                </label>
                <input
                  id="quote-timeline"
                  name="timeline"
                  value={quoteForm.timeline}
                  onChange={handleQuoteChange}
                  className={`mt-2 w-full px-4 py-3 rounded-lg border transition-all ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                  placeholder="e.g. 1 week / 2-3 weeks"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  className={`text-sm font-medium ${colorScheme.text.secondary}`}
                  htmlFor="quote-message"
                >
                  Message
                </label>
                <textarea
                  id="quote-message"
                  name="message"
                  rows={5}
                  value={quoteForm.message}
                  onChange={handleQuoteChange}
                  className={`mt-2 w-full px-4 py-3 rounded-lg border transition-all resize-none ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-700 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:ring-2 focus:ring-pink-500/20 focus:outline-none`}
                  placeholder="Tell me what you want to build, features, pages, and any references..."
                  required
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <Button
                  type="submit"
                  variant="gradient"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Send request
                </Button>
              </div>
            </form>
          </AnimatedSection>
        </div>
      </section>

      <section className={`py-16 ${colorScheme.background.secondary}`}>
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <AnimatedSection animation="slideUp" className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">FAQ</h2>
            <p className={`mt-3 ${colorScheme.text.secondary}`}>
              Quick answers to common questions.
            </p>
          </AnimatedSection>

          <div className="space-y-3">
            {faqItems.map((item, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={item.question}
                  className={`${getCardClasses(
                    "rounded-xl border overflow-hidden"
                  )}`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaqIndex((prev) => (prev === index ? null : index))
                    }
                    className="w-full flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <span className="text-left font-semibold">
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown className="w-5 h-5" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div
                          className={`px-5 pb-5 ${colorScheme.text.secondary}`}
                        >
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
