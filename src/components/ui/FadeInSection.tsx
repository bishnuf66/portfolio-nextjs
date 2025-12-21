"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface FadeInSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export const FadeInSection: React.FC<FadeInSectionProps> = ({
    children,
    className = '',
    delay = 0,
    duration = 0.6,
    direction = 'up',
}) => {
    const { elementRef, isIntersecting } = useIntersectionObserver({ threshold: 0.1 });

    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { opacity: 0, y: 30 };
            case 'down':
                return { opacity: 0, y: -30 };
            case 'left':
                return { opacity: 0, x: -30 };
            case 'right':
                return { opacity: 0, x: 30 };
            default:
                return { opacity: 0 };
        }
    };

    const getAnimatePosition = () => {
        switch (direction) {
            case 'up':
            case 'down':
                return { opacity: 1, y: 0 };
            case 'left':
            case 'right':
                return { opacity: 1, x: 0 };
            default:
                return { opacity: 1 };
        }
    };

    return (
        <motion.div
            ref={elementRef}
            className={className}
            initial={getInitialPosition()}
            animate={isIntersecting ? getAnimatePosition() : getInitialPosition()}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            {children}
        </motion.div>
    );
};