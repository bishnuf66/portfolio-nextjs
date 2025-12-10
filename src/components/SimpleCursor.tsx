"use client";

import React, { useEffect, useState, useRef } from "react";
import useStore from "@/store/store";

const SimpleCursor = () => {
    const { isDarkMode } = useStore();
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [cursorType, setCursorType] = useState("default");
    const [clickRipples, setClickRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

    const rippleIdRef = useRef(0);
    const cursorRef = useRef<HTMLDivElement>(null);

    // Check if device supports hover (not touch-only)
    const [supportsHover, setSupportsHover] = useState(true);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
        setSupportsHover(mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
            setSupportsHover(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    useEffect(() => {
        if (!supportsHover) return;

        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Detect cursor type based on target element
            const target = e.target as HTMLElement;
            if (
                target.tagName === "BUTTON" ||
                target.tagName === "A" ||
                target.closest("button") ||
                target.closest("a") ||
                target.classList.contains("cursor-pointer") ||
                getComputedStyle(target).cursor === "pointer"
            ) {
                setCursorType("pointer");
                setIsHovering(true);
            } else if (
                target.tagName === "INPUT" ||
                target.tagName === "TEXTAREA" ||
                target.contentEditable === "true"
            ) {
                setCursorType("text");
                setIsHovering(false);
            } else {
                setCursorType("default");
                setIsHovering(false);
            }
        };

        const handleMouseDown = (e: MouseEvent) => {
            setIsClicking(true);

            // Create ripple effect
            const rippleId = rippleIdRef.current++;
            const newRipple = { id: rippleId, x: e.clientX, y: e.clientY };
            setClickRipples(prev => [...prev, newRipple]);

            // Remove ripple after animation
            setTimeout(() => {
                setClickRipples(prev => prev.filter(ripple => ripple.id !== rippleId));
            }, 600);
        };

        const handleMouseUp = () => {
            setIsClicking(false);
        };

        // Hide default cursor
        document.body.style.cursor = "none";
        document.documentElement.style.cursor = "none";

        // Add global cursor none style
        const style = document.createElement('style');
        style.textContent = `
      * { cursor: none !important; }
      @media (hover: none) and (pointer: coarse) {
        * { cursor: auto !important; }
      }
    `;
        document.head.appendChild(style);

        document.addEventListener("mousemove", updatePosition);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);

        return () => {
            document.removeEventListener("mousemove", updatePosition);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);

            // Restore default cursor
            document.body.style.cursor = "auto";
            document.documentElement.style.cursor = "auto";
            document.head.removeChild(style);
        };
    }, [supportsHover]);

    if (!supportsHover) return null;

    const getCursorSize = () => {
        switch (cursorType) {
            case "pointer":
                return isClicking ? 45 : 35;
            case "text":
                return 20;
            default:
                return isClicking ? 30 : 24;
        }
    };

    const getCursorColor = () => {
        const baseColor = isDarkMode ? "#ffffff" : "#000000";
        const hoverColor = isDarkMode ? "#60a5fa" : "#3b82f6";
        const textColor = isDarkMode ? "#34d399" : "#10b981";

        switch (cursorType) {
            case "pointer":
                return hoverColor;
            case "text":
                return textColor;
            default:
                return baseColor;
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]" data-cursor="custom">
            {/* Click Ripples */}
            {clickRipples.map((ripple) => (
                <div
                    key={ripple.id}
                    className="absolute rounded-full border-2 animate-ping"
                    style={{
                        left: ripple.x - 20,
                        top: ripple.y - 20,
                        width: 40,
                        height: 40,
                        borderColor: getCursorColor(),
                        animationDuration: "0.6s",
                    }}
                />
            ))}

            {/* Main Cursor */}
            <div
                ref={cursorRef}
                className="absolute transition-all duration-200 ease-out"
                style={{
                    left: position.x - getCursorSize() / 2,
                    top: position.y - getCursorSize() / 2,
                    transform: `scale(${isClicking ? 0.8 : 1})`,
                }}
            >
                {/* Outer Ring */}
                <div
                    className="rounded-full border-2 flex items-center justify-center"
                    style={{
                        width: getCursorSize(),
                        height: getCursorSize(),
                        borderColor: getCursorColor(),
                        backgroundColor: `${getCursorColor()}10`,
                        boxShadow: isHovering
                            ? `0 0 20px ${getCursorColor()}40`
                            : `0 0 10px ${getCursorColor()}20`,
                    }}
                >
                    {/* Inner Dot */}
                    <div
                        className="rounded-full"
                        style={{
                            width: cursorType === "text" ? 2 : 4,
                            height: cursorType === "text" ? 16 : 4,
                            backgroundColor: getCursorColor(),
                            opacity: 0.8,
                        }}
                    />
                </div>
            </div>

            {/* Cursor Type Indicator */}
            {cursorType !== "default" && (
                <div
                    className="absolute text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm"
                    style={{
                        left: position.x + 20,
                        top: position.y - 8,
                        backgroundColor: `${getCursorColor()}20`,
                        color: getCursorColor(),
                        border: `1px solid ${getCursorColor()}30`,
                    }}
                >
                    {cursorType === "pointer" ? "CLICK" : "TYPE"}
                </div>
            )}

            {/* Hover Glow Effect */}
            {isHovering && (
                <div
                    className="absolute rounded-full animate-pulse"
                    style={{
                        left: position.x - 30,
                        top: position.y - 30,
                        width: 60,
                        height: 60,
                        background: `radial-gradient(circle, ${getCursorColor()}15 0%, transparent 70%)`,
                        animationDuration: "1.5s",
                    }}
                />
            )}
        </div>
    );
};

export default SimpleCursor;