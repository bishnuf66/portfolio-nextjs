"use client";

import { useEffect, useRef, ReactNode } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

interface ScrollRevealProps {
    children: ReactNode;
    direction?: "up" | "down" | "left" | "right";
    delay?: number;
    duration?: number;
    className?: string;
}

export function ScrollReveal({
    children,
    direction = "up",
    delay = 0,
    duration = 0.8,
    className = "",
}: ScrollRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });

    const directions = {
        up: { y: 100, x: 0 },
        down: { y: -100, x: 0 },
        left: { y: 0, x: 100 },
        right: { y: 0, x: -100 },
    };

    return (
        <motion.div
            ref={ref}
            initial={{
                opacity: 0,
                ...directions[direction],
            }}
            animate={
                isInView
                    ? { opacity: 1, y: 0, x: 0 }
                    : { opacity: 0, ...directions[direction] }
            }
            transition={{
                duration,
                delay,
                ease: [0.25, 0.4, 0.25, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface ScrollFadeProps {
    children: ReactNode;
    className?: string;
}

export function ScrollFade({ children, className = "" }: ScrollFadeProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.8, 1, 1, 0.8]);

    return (
        <motion.div
            ref={ref}
            style={{ opacity, scale }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface ParallaxTextProps {
    children: ReactNode;
    speed?: number;
    className?: string;
}

export function ParallaxText({
    children,
    speed = 0.5,
    className = "",
}: ParallaxTextProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], [100 * speed, -100 * speed]);

    return (
        <motion.div ref={ref} style={{ y }} className={className}>
            {children}
        </motion.div>
    );
}

interface SplitTextRevealProps {
    text: string;
    className?: string;
    delay?: number;
}

export function SplitTextReveal({
    text,
    className = "",
    delay = 0,
}: SplitTextRevealProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-50px" });
    const words = text.split(" ");

    return (
        <div ref={ref} className={className}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                    transition={{
                        duration: 0.5,
                        delay: delay + i * 0.05,
                        ease: [0.25, 0.4, 0.25, 1],
                    }}
                    className="inline-block mr-2"
                >
                    {word}
                </motion.span>
            ))}
        </div>
    );
}

interface ScrollScaleProps {
    children: ReactNode;
    className?: string;
}

export function ScrollScale({ children, className = "" }: ScrollScaleProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.1, 0.8]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    return (
        <motion.div
            ref={ref}
            style={{ scale, opacity }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
