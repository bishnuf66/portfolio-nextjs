"use client";

import React from "react";
import useStore from "@/store/store";
import { useTestimonials } from "@/hooks/useTestimonials";
import { TestimonialCardSkeleton } from "./LoadingSkeleton";
import { Star, Quote } from "lucide-react";
import { AnimatedSection, StaggeredContainer } from "@/components/ui/AnimatedSection";
import { colorScheme } from "@/utils/colorUtils";

export default function Testimonials() {
    const { isDarkMode } = useStore();
    const { data: testimonials = [], isLoading } = useTestimonials(true);

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

                <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={0.15}>
                    {testimonials.map((testimonial) => (
                        <div
                            key={testimonial.id}
                            className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                                } rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative`}
                        >
                            <Quote
                                className={`absolute top-4 right-4 ${isDarkMode ? "text-gray-700" : "text-gray-200"
                                    }`}
                                size={48}
                            />

                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                {testimonial.avatar_url ? (
                                    <img
                                        src={testimonial.avatar_url}
                                        alt={testimonial.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                ) : (
                                    <div
                                        className={`w-16 h-16 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-200"
                                            } flex items-center justify-center text-2xl font-bold`}
                                    >
                                        {testimonial.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h3
                                        className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"
                                            }`}
                                    >
                                        {testimonial.name}
                                    </h3>
                                    <p
                                        className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                            }`}
                                    >
                                        {testimonial.role}
                                        {testimonial.company && ` at ${testimonial.company}`}
                                    </p>
                                </div>
                            </div>

                            {testimonial.rating && (
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={
                                                i < testimonial.rating!
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : isDarkMode
                                                        ? "text-gray-600"
                                                        : "text-gray-300"
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            <p
                                className={`${isDarkMode ? "text-gray-300" : "text-gray-700"
                                    } leading-relaxed relative z-10`}
                            >
                                {testimonial.content}
                            </p>
                        </div>
                    ))}
                </StaggeredContainer>
            </div>
        </section>
    );
}
