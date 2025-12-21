"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import useStore from "@/store/store";
import { useTestimonials } from "@/hooks/useTestimonials";
import { TestimonialCardSkeleton } from "./LoadingSkeleton";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { colorScheme } from "@/utils/colorUtils";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
    const { isDarkMode } = useStore();
    const { data: testimonials = [], isLoading } = useTestimonials(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) =>
            prev === 0 ? testimonials.length - 1 : prev - 1
        );
        setIsAutoPlaying(false);
    }, [testimonials.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setIsAutoPlaying(false);
    }, [testimonials.length]);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    }, []);

    // Auto-play functionality
    useEffect(() => {
        if (!isAutoPlaying || testimonials.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, testimonials.length, currentIndex]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (testimonials.length <= 1) return;

            if (event.key === 'ArrowLeft') {
                goToPrevious();
            } else if (event.key === 'ArrowRight') {
                goToNext();
            } else if (event.key === ' ') {
                event.preventDefault();
                setIsAutoPlaying(!isAutoPlaying);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isAutoPlaying, testimonials.length, goToNext, goToPrevious]);

    if (isLoading) {
        return (
            <section
                id="testimonials"
                className={`py-20 ${colorScheme.background.secondary}`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <AnimatedSection animation="fadeIn" className="text-center mb-16">
                        <h2 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            Testimonials
                        </h2>
                        <p
                            className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                }`}
                        >
                            What people say about working with me
                        </p>
                    </AnimatedSection>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <TestimonialCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (testimonials.length === 0) {
        return null;
    }

    return (
        <section
            id="testimonials"
            className={`py-20 ${colorScheme.background.secondary}`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <AnimatedSection animation="fadeIn" className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Testimonials
                    </h2>
                    <p
                        className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                    >
                        What people say about working with me
                    </p>
                </AnimatedSection>

                {/* Carousel Container */}
                <div className="relative max-w-4xl mx-auto px-4 sm:px-16">
                    {/* Main Carousel */}
                    <div className="relative overflow-hidden rounded-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, x: 300 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -300 }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0.25, 0.46, 0.45, 0.94]
                                }}
                                drag="x"
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={(_, info) => {
                                    if (info.offset.x > 100) {
                                        goToPrevious();
                                    } else if (info.offset.x < -100) {
                                        goToNext();
                                    }
                                }}
                                className={`${isDarkMode ? "bg-gray-800/50" : "bg-white/50"
                                    } backdrop-blur-md rounded-2xl p-6 md:p-12 shadow-2xl border ${isDarkMode ? "border-gray-700" : "border-gray-200"
                                    } cursor-grab active:cursor-grabbing min-h-[400px] flex items-center`}
                            >
                                <div className="flex flex-col items-center text-center w-full">
                                    {/* Quote Icon */}
                                    <Quote
                                        className={`mb-6 ${isDarkMode ? "text-blue-400" : "text-blue-500"
                                            }`}
                                        size={48}
                                    />

                                    {/* Testimonial Content - Fixed height with scrolling if needed */}
                                    <div className="min-h-[120px] max-h-[200px] overflow-y-auto mb-8 w-full flex items-center justify-center">
                                        <blockquote
                                            className={`text-lg md:text-xl leading-relaxed ${isDarkMode ? "text-gray-200" : "text-gray-700"
                                                } max-w-3xl`}
                                        >
                                            &ldquo;{testimonials[currentIndex]?.content}&rdquo;
                                        </blockquote>
                                    </div>

                                    {/* Rating */}
                                    {testimonials[currentIndex]?.rating && (
                                        <div className="flex gap-1 mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={20}
                                                    className={
                                                        i < testimonials[currentIndex].rating!
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : isDarkMode
                                                                ? "text-gray-600"
                                                                : "text-gray-300"
                                                    }
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* Author Info */}
                                    <div className="flex items-center gap-4">
                                        {testimonials[currentIndex]?.avatar_url ? (
                                            <div className="relative">
                                                <Image
                                                    src={testimonials[currentIndex].avatar_url}
                                                    alt={testimonials[currentIndex].name}
                                                    width={64}
                                                    height={64}
                                                    className="rounded-full object-cover ring-4 ring-blue-500/20"
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className={`w-16 h-16 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                                    } flex items-center justify-center text-2xl font-bold ring-4 ring-blue-500/20`}
                                            >
                                                {testimonials[currentIndex]?.name.charAt(0)}
                                            </div>
                                        )}
                                        <div className="text-left">
                                            <h3
                                                className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"
                                                    }`}
                                            >
                                                {testimonials[currentIndex]?.name}
                                            </h3>
                                            <p
                                                className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                                    }`}
                                            >
                                                {testimonials[currentIndex]?.role}
                                                {testimonials[currentIndex]?.company &&
                                                    ` at ${testimonials[currentIndex].company}`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation Buttons - Positioned outside the card, hidden on mobile */}
                    {testimonials.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className={`absolute -left-6 top-1/2 -translate-y-1/2 p-3 rounded-full ${isDarkMode
                                    ? "bg-gray-800/90 hover:bg-gray-700 text-white"
                                    : "bg-white/90 hover:bg-white text-gray-900"
                                    } backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 border ${isDarkMode ? "border-gray-700" : "border-gray-200"
                                    } z-10 hidden sm:flex items-center justify-center`}
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={goToNext}
                                className={`absolute -right-6 top-1/2 -translate-y-1/2 p-3 rounded-full ${isDarkMode
                                    ? "bg-gray-800/90 hover:bg-gray-700 text-white"
                                    : "bg-white/90 hover:bg-white text-gray-900"
                                    } backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 border ${isDarkMode ? "border-gray-700" : "border-gray-200"
                                    } z-10 hidden sm:flex items-center justify-center`}
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </>
                    )}

                    {/* Mobile Navigation Buttons - Below the carousel */}
                    {testimonials.length > 1 && (
                        <div className="flex justify-center gap-4 mt-6 sm:hidden">
                            <button
                                onClick={goToPrevious}
                                className={`p-3 rounded-full ${isDarkMode
                                    ? "bg-gray-800/90 hover:bg-gray-700 text-white"
                                    : "bg-white/90 hover:bg-white text-gray-900"
                                    } backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 border ${isDarkMode ? "border-gray-700" : "border-gray-200"
                                    }`}
                                aria-label="Previous testimonial"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={goToNext}
                                className={`p-3 rounded-full ${isDarkMode
                                    ? "bg-gray-800/90 hover:bg-gray-700 text-white"
                                    : "bg-white/90 hover:bg-white text-gray-900"
                                    } backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110 border ${isDarkMode ? "border-gray-700" : "border-gray-200"
                                    }`}
                                aria-label="Next testimonial"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    )}

                    {/* Dots Indicator */}
                    {testimonials.length > 1 && (
                        <div className="flex justify-center gap-3 mt-8 sm:mt-8">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? "bg-blue-500 scale-125"
                                        : isDarkMode
                                            ? "bg-gray-600 hover:bg-gray-500"
                                            : "bg-gray-300 hover:bg-gray-400"
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Auto-play indicator */}
                    {testimonials.length > 1 && (
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                                className={`text-sm px-4 py-2 rounded-full transition-all ${isAutoPlaying
                                    ? isDarkMode
                                        ? "bg-blue-500/20 text-blue-400"
                                        : "bg-blue-500/20 text-blue-600"
                                    : isDarkMode
                                        ? "bg-gray-700 text-gray-400"
                                        : "bg-gray-200 text-gray-600"
                                    }`}
                            >
                                {isAutoPlaying ? "Auto-playing" : "Paused"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
