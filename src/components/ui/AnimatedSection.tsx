"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scaleIn' | 'rotateIn';
    delay?: number;
    duration?: number;
    threshold?: number;
}

const animations = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
    },
    slideUp: {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
    },
    slideLeft: {
        initial: { opacity: 0, x: -50 },
        animate: { opacity: 1, x: 0 },
    },
    slideRight: {
        initial: { opacity: 0, x: 50 },
        animate: { opacity: 1, x: 0 },
    },
    scaleIn: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
    },
    rotateIn: {
        initial: { opacity: 0, rotate: -10, scale: 0.8 },
        animate: { opacity: 1, rotate: 0, scale: 1 },
    },
};

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
    children,
    className = '',
    animation = 'fadeIn',
    delay = 0,
    duration = 0.6,
    threshold = 0.1,
}) => {
    const { elementRef, isIntersecting } = useIntersectionObserver({ threshold });

    const selectedAnimation = animations[animation];

    return (
        <motion.div
            ref={elementRef}
            className={className}
            initial={selectedAnimation.initial}
            animate={isIntersecting ? selectedAnimation.animate : selectedAnimation.initial}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for smooth animation
            }}
        >
            {children}
        </motion.div>
    );
};

// Staggered children animation component
interface StaggeredContainerProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
    threshold?: number;
}

export const StaggeredContainer: React.FC<StaggeredContainerProps> = ({
    children,
    className = '',
    staggerDelay = 0.1,
    threshold = 0.1,
}) => {
    const { elementRef, isIntersecting } = useIntersectionObserver({ threshold });

    return (
        <motion.div
            ref={elementRef}
            className={className}
            initial="hidden"
            animate={isIntersecting ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
        >
            {React.Children.map(children, (child, index) => (
                <motion.div
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    {child}
                </motion.div>
            ))}
        </motion.div>
    );
};

// Card hover animation component
interface AnimatedCardProps {
    children: React.ReactNode;
    className?: string;
    hoverScale?: number;
    hoverRotate?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
    children,
    className = '',
    hoverScale = 1.05,
    hoverRotate = 0,
}) => {
    return (
        <motion.div
            className={className}
            whileHover={{
                scale: hoverScale,
                rotate: hoverRotate,
                transition: { duration: 0.3, ease: "easeOut" },
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {children}
        </motion.div>
    );
};