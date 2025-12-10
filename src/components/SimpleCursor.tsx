"use client";

import React, { useEffect, useState, useRef } from "react";

const ModernCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [cursorType, setCursorType] = useState("default");
    const [clickRipples, setClickRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
    const [trail, setTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);

    const rippleIdRef = useRef(0);
    const trailIdRef = useRef(0);
    const animationFrameRef = useRef<number>();

    // Check if device supports hover
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

    // Smooth cursor following animation
    useEffect(() => {
        if (!supportsHover) return;

        const animate = () => {
            setPosition(prev => ({
                x: prev.x + (targetPosition.x - prev.x) * 0.15,
                y: prev.y + (targetPosition.y - prev.y) * 0.15
            }));
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [targetPosition, supportsHover]);

    // Trail effect
    useEffect(() => {
        if (!supportsHover) return;

        const intervalId = setInterval(() => {
            const newTrail = { x: position.x, y: position.y, id: trailIdRef.current++ };
            setTrail(prev => [...prev.slice(-8), newTrail]);
        }, 30);

        return () => clearInterval(intervalId);
    }, [position, supportsHover]);

    useEffect(() => {
        if (!supportsHover) return;

        const updatePosition = (e: MouseEvent) => {
            setTargetPosition({ x: e.clientX, y: e.clientY });

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

            const rippleId = rippleIdRef.current++;
            const newRipple = { id: rippleId, x: e.clientX, y: e.clientY };
            setClickRipples(prev => [...prev, newRipple]);

            setTimeout(() => {
                setClickRipples(prev => prev.filter(ripple => ripple.id !== rippleId));
            }, 800);
        };

        const handleMouseUp = () => {
            setIsClicking(false);
        };

        document.body.style.cursor = "none";
        document.documentElement.style.cursor = "none";

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
            document.body.style.cursor = "auto";
            document.documentElement.style.cursor = "auto";
            document.head.removeChild(style);
        };
    }, [supportsHover]);

    if (!supportsHover) return null;

    const getCursorSize = () => {
        switch (cursorType) {
            case "pointer":
                return isClicking ? 50 : 40;
            case "text":
                return 24;
            default:
                return isClicking ? 28 : 32;
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* Animated Trail */}
            {trail.map((point, index) => {
                const opacity = (index / trail.length) * 0.6;
                const scale = (index / trail.length) * 0.8;
                return (
                    <div
                        key={point.id}
                        className="absolute rounded-full transition-opacity duration-300"
                        style={{
                            left: point.x - 6,
                            top: point.y - 6,
                            width: 12,
                            height: 12,
                            background: isHovering
                                ? `radial-gradient(circle, rgba(96, 165, 250, ${opacity}) 0%, transparent 70%)`
                                : `radial-gradient(circle, rgba(139, 92, 246, ${opacity}) 0%, transparent 70%)`,
                            transform: `scale(${scale})`,
                        }}
                    />
                );
            })}

            {/* Click Ripples with modern wave effect */}
            {clickRipples.map((ripple) => (
                <div key={ripple.id}>
                    <div
                        className="absolute rounded-full animate-ping"
                        style={{
                            left: ripple.x - 30,
                            top: ripple.y - 30,
                            width: 60,
                            height: 60,
                            border: '2px solid',
                            borderColor: isHovering ? '#60a5fa' : '#8b5cf6',
                            animationDuration: "0.8s",
                        }}
                    />
                    <div
                        className="absolute rounded-full animate-ping"
                        style={{
                            left: ripple.x - 20,
                            top: ripple.y - 20,
                            width: 40,
                            height: 40,
                            border: '2px solid',
                            borderColor: isHovering ? '#60a5fa' : '#8b5cf6',
                            animationDuration: "0.6s",
                            animationDelay: '0.1s',
                        }}
                    />
                </div>
            ))}

            {/* Main Cursor with glassmorphism */}
            <div
                className="absolute transition-transform duration-100 ease-out"
                style={{
                    left: position.x - getCursorSize() / 2,
                    top: position.y - getCursorSize() / 2,
                    transform: `scale(${isClicking ? 0.85 : 1}) rotate(${isHovering ? 45 : 0}deg)`,
                }}
            >
                {/* Outer glow ring */}
                <div
                    className="absolute inset-0 rounded-full animate-pulse"
                    style={{
                        width: getCursorSize(),
                        height: getCursorSize(),
                        background: isHovering
                            ? 'radial-gradient(circle, rgba(96, 165, 250, 0.3) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
                        filter: 'blur(8px)',
                        animationDuration: '2s',
                    }}
                />

                {/* Main cursor body with gradient */}
                <div
                    className="rounded-full backdrop-blur-md border-2 flex items-center justify-center relative overflow-hidden"
                    style={{
                        width: getCursorSize(),
                        height: getCursorSize(),
                        borderColor: isHovering ? '#60a5fa' : '#8b5cf6',
                        background: isHovering
                            ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.2) 0%, rgba(59, 130, 246, 0.1) 100%)'
                            : 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)',
                        boxShadow: isHovering
                            ? '0 0 30px rgba(96, 165, 250, 0.4), inset 0 0 20px rgba(96, 165, 250, 0.1)'
                            : '0 0 20px rgba(139, 92, 246, 0.3), inset 0 0 15px rgba(139, 92, 246, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {/* Animated gradient overlay */}
                    <div
                        className="absolute inset-0 rounded-full opacity-50"
                        style={{
                            background: isHovering
                                ? 'linear-gradient(45deg, transparent 30%, rgba(96, 165, 250, 0.3) 50%, transparent 70%)'
                                : 'linear-gradient(45deg, transparent 30%, rgba(139, 92, 246, 0.3) 50%, transparent 70%)',
                            animation: 'shimmer 2s infinite',
                        }}
                    />

                    {/* Inner core dot */}
                    <div
                        className="rounded-full relative z-10"
                        style={{
                            width: cursorType === "text" ? 3 : 8,
                            height: cursorType === "text" ? 20 : 8,
                            background: isHovering
                                ? 'linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%)'
                                : 'linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%)',
                            boxShadow: isHovering
                                ? '0 0 10px rgba(96, 165, 250, 0.8)'
                                : '0 0 10px rgba(139, 92, 246, 0.8)',
                        }}
                    />
                </div>
            </div>

            {/* Enhanced hover ring */}
            {isHovering && (
                <div
                    className="absolute rounded-full animate-pulse"
                    style={{
                        left: position.x - 40,
                        top: position.y - 40,
                        width: 80,
                        height: 80,
                        border: '1px solid rgba(96, 165, 250, 0.3)',
                        background: 'radial-gradient(circle, rgba(96, 165, 250, 0.1) 0%, transparent 70%)',
                        animationDuration: '1.5s',
                    }}
                />
            )}

            <style jsx>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%) translateY(-100%); }
                    100% { transform: translateX(100%) translateY(100%); }
                }
            `}</style>
        </div>
    );
};

export default ModernCursor;