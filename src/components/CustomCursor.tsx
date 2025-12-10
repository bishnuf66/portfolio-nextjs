"use client";

import React, { useEffect, useState, useRef } from "react";
import useStore from "@/store/store";

const CustomCursor = () => {
    const { isDarkMode } = useStore();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [cursorVariant, setCursorVariant] = useState("default");
    const cursorRef = useRef<HTMLDivElement>(null);
    const trailRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = () => {
            setIsClicking(true);
        };

        const handleMouseUp = () => {
            setIsClicking(false);
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for interactive elements
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.classList.contains("cursor-pointer") ||
                target.style.cursor === "pointer"
            ) {
                setIsHovering(true);
                setCursorVariant("pointer");
            } else if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.contentEditable === "true"
            ) {
                setCursorVariant("text");
            } else {
                setIsHovering(false);
                setCursorVariant("default");
            }
        };

        // Add event listeners
        document.addEventListener("mousemove", updateMousePosition);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseover", handleMouseEnter);

        // Hide default cursor
        document.body.style.cursor = "none";
        document.documentElement.style.cursor = "none";

        return () => {
            document.removeEventListener("mousemove", updateMousePosition);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseover", handleMouseEnter);

            // Restore default cursor
            document.body.style.cursor = "auto";
            document.documentElement.style.cursor = "auto";
        };
    }, []);

    // Don't render on mobile devices
    useEffect(() => {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        if (isMobile) {
            document.body.style.cursor = "auto";
            document.documentElement.style.cursor = "auto";
        }
    }, []);

    const getCursorSize = () => {
        switch (cursorVariant) {
            case "pointer":
                return isClicking ? 60 : 50;
            case "text":
                return 30;
            default:
                return isClicking ? 40 : 32;
        }
    };

    const getCursorColor = () => {
        if (isDarkMode) {
            switch (cursorVariant) {
                case "pointer":
                    return "rgba(59, 130, 246, 0.8)"; // Blue
                case "text":
                    return "rgba(34, 197, 94, 0.8)"; // Green
                default:
                    return "rgba(255, 255, 255, 0.8)";
            }
        } else {
            switch (cursorVariant) {
                case "pointer":
                    return "rgba(59, 130, 246, 0.8)"; // Blue
                case "text":
                    return "rgba(34, 197, 94, 0.8)"; // Green
                default:
                    return "rgba(0, 0, 0, 0.8)";
            }
        }
    };

    return (
        <>
            {/* Main Cursor */}
            <div
                ref={cursorRef}
                className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    transform: `translate(${mousePosition.x - getCursorSize() / 2}px, ${mousePosition.y - getCursorSize() / 2
                        }px)`,
                    transition: isClicking
                        ? "all 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                        : "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
            >
                <div
                    className="rounded-full border-2"
                    style={{
                        width: `${getCursorSize()}px`,
                        height: `${getCursorSize()}px`,
                        backgroundColor: getCursorColor(),
                        borderColor: isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
                        transform: isClicking ? "scale(0.8)" : "scale(1)",
                        transition: "all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                />
            </div>

            {/* Cursor Trail */}
            <div
                ref={trailRef}
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{
                    transform: `translate(${mousePosition.x - 4}px, ${mousePosition.y - 4}px)`,
                    transition: "all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                }}
            >
                <div
                    className="w-2 h-2 rounded-full"
                    style={{
                        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
                        transform: isClicking ? "scale(2)" : "scale(1)",
                        transition: "all 0.1s ease-out",
                    }}
                />
            </div>

            {/* Click Ripple Effect */}
            {isClicking && (
                <div
                    className="fixed top-0 left-0 pointer-events-none z-[9997]"
                    style={{
                        transform: `translate(${mousePosition.x - 25}px, ${mousePosition.y - 25}px)`,
                    }}
                >
                    <div
                        className="w-12 h-12 rounded-full border-2 animate-ping"
                        style={{
                            borderColor: getCursorColor(),
                            animationDuration: "0.6s",
                        }}
                    />
                </div>
            )}

            {/* Hover Glow Effect */}
            {isHovering && (
                <div
                    className="fixed top-0 left-0 pointer-events-none z-[9996]"
                    style={{
                        transform: `translate(${mousePosition.x - 30}px, ${mousePosition.y - 30}px)`,
                        transition: "all 0.3s ease-out",
                    }}
                >
                    <div
                        className="w-16 h-16 rounded-full opacity-30 animate-pulse"
                        style={{
                            background: `radial-gradient(circle, ${getCursorColor()} 0%, transparent 70%)`,
                            animationDuration: "2s",
                        }}
                    />
                </div>
            )}

            {/* Cursor Text Indicator */}
            {cursorVariant === "text" && (
                <div
                    className="fixed top-0 left-0 pointer-events-none z-[9999] text-xs font-medium"
                    style={{
                        transform: `translate(${mousePosition.x + 20}px, ${mousePosition.y - 10}px)`,
                        color: isDarkMode ? "white" : "black",
                        transition: "all 0.2s ease-out",
                    }}
                >
                    TEXT
                </div>
            )}

            {/* Cursor Pointer Indicator */}
            {cursorVariant === "pointer" && (
                <div
                    className="fixed top-0 left-0 pointer-events-none z-[9999]"
                    style={{
                        transform: `translate(${mousePosition.x - 8}px, ${mousePosition.y - 8}px)`,
                        transition: "all 0.2s ease-out",
                    }}
                >
                    <div
                        className="w-4 h-4 rounded-full"
                        style={{
                            backgroundColor: getCursorColor(),
                            transform: isClicking ? "scale(1.5)" : "scale(1)",
                            transition: "all 0.1s ease-out",
                        }}
                    />
                </div>
            )}

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