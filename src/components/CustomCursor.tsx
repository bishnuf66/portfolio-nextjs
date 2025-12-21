"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import useStore from "@/store/store";

const CustomCursor = () => {
    const { isDarkMode } = useStore();
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const [isEnabled, setIsEnabled] = useState(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem("customCursorEnabled");
            return stored !== null ? JSON.parse(stored) : true;
        }
        return true;
    });

    // Use refs for position to avoid re-renders
    const mousePositionRef = useRef({ x: 0, y: 0 });
    const targetPositionRef = useRef({ x: 0, y: 0 });
    const cursorVariantRef = useRef("default");

    // Listen for cursor toggle events
    useEffect(() => {
        const handleCursorToggle = (e: CustomEvent) => {
            setIsEnabled(e.detail.enabled);
        };

        window.addEventListener('cursorToggle', handleCursorToggle as EventListener);
        return () => {
            window.removeEventListener('cursorToggle', handleCursorToggle as EventListener);
        };
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        mousePositionRef.current.x = e.clientX;
        mousePositionRef.current.y = e.clientY;
    }, []);

    const handleMouseDown = useCallback(() => {
        if (cursorRef.current) {
            cursorRef.current.style.transform += ' scale(0.8)';
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        if (cursorRef.current) {
            cursorRef.current.style.transform = cursorRef.current.style.transform.replace(' scale(0.8)', '');
        }
    }, []);

    const handleMouseOver = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        let newVariant = "default";

        // Simplified element checking
        if (target.closest("button, a, [role='button']") || target.classList.contains("cursor-pointer")) {
            newVariant = "pointer";
        } else if (target.closest("input, textarea, [contenteditable='true']")) {
            newVariant = "text";
        }

        if (newVariant !== cursorVariantRef.current) {
            cursorVariantRef.current = newVariant;

            if (cursorRef.current) {
                const cursor = cursorRef.current;

                switch (newVariant) {
                    case "pointer":
                        cursor.style.width = "50px";
                        cursor.style.height = "50px";
                        cursor.style.backgroundColor = "rgba(59, 130, 246, 0.8)";
                        cursor.style.borderColor = "rgba(59, 130, 246, 0.5)";
                        break;
                    case "text":
                        cursor.style.width = "30px";
                        cursor.style.height = "30px";
                        cursor.style.backgroundColor = "rgba(34, 197, 94, 0.8)";
                        cursor.style.borderColor = "rgba(34, 197, 94, 0.5)";
                        break;
                    default:
                        cursor.style.width = "40px";
                        cursor.style.height = "40px";
                        cursor.style.backgroundColor = isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)";
                        cursor.style.borderColor = isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)";
                        break;
                }
            }
        }
    }, [isDarkMode]);

    useEffect(() => {
        // Check if mobile or cursor is disabled
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile || !isEnabled) {
            // Restore default cursor
            document.body.style.cursor = "auto";
            document.documentElement.style.cursor = "auto";
            return;
        }

        // Animation loop function
        const animate = () => {
            if (!cursorRef.current || !cursorDotRef.current) return;

            // Smooth interpolation for main cursor
            targetPositionRef.current.x += (mousePositionRef.current.x - targetPositionRef.current.x) * 0.15;
            targetPositionRef.current.y += (mousePositionRef.current.y - targetPositionRef.current.y) * 0.15;

            // Update main cursor position
            cursorRef.current.style.transform = `translate3d(${targetPositionRef.current.x - 20}px, ${targetPositionRef.current.y - 20}px, 0)`;

            // Update dot position (faster follow)
            cursorDotRef.current.style.transform = `translate3d(${mousePositionRef.current.x - 4}px, ${mousePositionRef.current.y - 4}px, 0)`;

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Hide default cursor
        document.body.style.cursor = "none";
        document.documentElement.style.cursor = "none";

        // Add event listeners with passive option for better performance
        document.addEventListener("mousemove", handleMouseMove, { passive: true });
        document.addEventListener("mousedown", handleMouseDown, { passive: true });
        document.addEventListener("mouseup", handleMouseUp, { passive: true });
        document.addEventListener("mouseover", handleMouseOver, { passive: true });

        // Start animation loop
        animate();

        return () => {
            // Cleanup
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseover", handleMouseOver);

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            // Restore default cursor
            document.body.style.cursor = "auto";
            document.documentElement.style.cursor = "auto";
        };
    }, [handleMouseMove, handleMouseDown, handleMouseUp, handleMouseOver, isEnabled]);

    // Don't render on mobile or when disabled
    const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile || !isEnabled) return null;

    return (
        <>
            {/* Main Cursor */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-9999 rounded-full border-2 mix-blend-difference"
                style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)",
                    borderColor: isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                    transition: "width 0.2s ease, height 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, transform 0.1s ease",
                    willChange: "transform",
                }}
            />

            {/* Cursor Dot */}
            <div
                ref={cursorDotRef}
                className="fixed top-0 left-0 pointer-events-none z-9998 w-2 h-2 rounded-full"
                style={{
                    backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
                    willChange: "transform",
                }}
            />

            <style jsx global>{`
                * {
                    cursor: none !important;
                }
                
                @media (max-width: 768px) {
                    * {
                        cursor: auto !important;
                    }
                }
            `}</style>
        </>
    );
};

export default CustomCursor;