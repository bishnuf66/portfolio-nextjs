"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import useStore from "@/store/store";

interface CursorState {
    x: number;
    y: number;
    isClicking: boolean;
    isHovering: boolean;
    cursorType: "default" | "pointer" | "text" | "drag";
}

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    hue: number;
}

const ModernCursor = () => {
    const { isDarkMode } = useStore();
    const [cursor, setCursor] = useState<CursorState>({
        x: 0,
        y: 0,
        isClicking: false,
        isHovering: false,
        cursorType: "default",
    });
    const [particles, setParticles] = useState<Particle[]>([]);
    const [trail, setTrail] = useState<Array<{ x: number; y: number; timestamp: number }>>([]);

    const particleIdRef = useRef(0);
    const animationRef = useRef<number>();
    const lastMousePos = useRef({ x: 0, y: 0 });

    // Check if device is mobile
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            setIsMobile(isMobileDevice || isTouchDevice);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Create click particles
    const createClickParticles = useCallback((x: number, y: number) => {
        const newParticles: Particle[] = [];
        const particleCount = 12;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 3 + Math.random() * 4;
            const hue = 200 + Math.random() * 60; // Blue to purple range

            newParticles.push({
                id: particleIdRef.current++,
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 40 + Math.random() * 20,
                maxLife: 60,
                size: 2 + Math.random() * 3,
                hue,
            });
        }

        setParticles(prev => [...prev, ...newParticles]);
    }, []);

    // Update trail
    const updateTrail = useCallback((x: number, y: number) => {
        const now = Date.now();
        setTrail(prev => {
            const newTrail = [{ x, y, timestamp: now }, ...prev.slice(0, 20)];
            return newTrail.filter(point => now - point.timestamp < 500);
        });
    }, []);

    // Detect cursor type based on element
    const detectCursorType = useCallback((element: HTMLElement): CursorState["cursorType"] => {
        if (
            element.tagName === "BUTTON" ||
            element.tagName === "A" ||
            element.closest("button") ||
            element.closest("a") ||
            element.classList.contains("cursor-pointer") ||
            getComputedStyle(element).cursor === "pointer"
        ) {
            return "pointer";
        }

        if (
            element.tagName === "INPUT" ||
            element.tagName === "TEXTAREA" ||
            element.contentEditable === "true"
        ) {
            return "text";
        }

        if (element.draggable || element.classList.contains("draggable")) {
            return "drag";
        }

        return "default";
    }, []);

    // Animation loop
    const animate = useCallback(() => {
        setParticles(prev =>
            prev
                .map(particle => ({
                    ...particle,
                    x: particle.x + particle.vx,
                    y: particle.y + particle.vy,
                    life: particle.life - 1,
                    vx: particle.vx * 0.95,
                    vy: particle.vy * 0.95 + 0.1, // Add gravity
                }))
                .filter(particle => particle.life > 0)
        );

        animationRef.current = requestAnimationFrame(animate);
    }, []);

    useEffect(() => {
        if (isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            const newX = e.clientX;
            const newY = e.clientY;

            setCursor(prev => ({
                ...prev,
                x: newX,
                y: newY,
                cursorType: detectCursorType(e.target as HTMLElement),
            }));

            updateTrail(newX, newY);
            lastMousePos.current = { x: newX, y: newY };
        };

        const handleMouseDown = (e: MouseEvent) => {
            setCursor(prev => ({ ...prev, isClicking: true }));
            createClickParticles(e.clientX, e.clientY);
        };

        const handleMouseUp = () => {
            setCursor(prev => ({ ...prev, isClicking: false }));
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const cursorType = detectCursorType(e.target as HTMLElement);
            setCursor(prev => ({
                ...prev,
                isHovering: cursorType !== "default",
                cursorType
            }));
        };

        // Hide default cursor
        document.body.style.cursor = "none";
        const allElements = document.querySelectorAll("*");
        allElements.forEach(el => {
            (el as HTMLElement).style.cursor = "none";
        });

        // Add event listeners
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mouseover", handleMouseEnter);

        // Start animation
        animate();

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mouseover", handleMouseEnter);

            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            // Restore default cursor
            document.body.style.cursor = "auto";
            allElements.forEach(el => {
                (el as HTMLElement).style.cursor = "";
            });
        };
    }, [isMobile, detectCursorType, updateTrail, createClickParticles, animate]);

    if (isMobile) return null;

    const getCursorSize = () => {
        switch (cursor.cursorType) {
            case "pointer":
                return cursor.isClicking ? 50 : 40;
            case "text":
                return 25;
            case "drag":
                return 35;
            default:
                return cursor.isClicking ? 35 : 28;
        }
    };

    const getCursorColor = () => {
        const colors = {
            pointer: isDarkMode ? "#60A5FA" : "#3B82F6", // Blue
            text: isDarkMode ? "#34D399" : "#10B981", // Green
            drag: isDarkMode ? "#F59E0B" : "#D97706", // Orange
            default: isDarkMode ? "#FFFFFF" : "#000000", // White/Black
        };
        return colors[cursor.cursorType];
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Trail Effect */}
            {trail.map((point, index) => {
                const age = (Date.now() - point.timestamp) / 500;
                const opacity = Math.max(0, 1 - age);
                const scale = Math.max(0.1, 1 - age);

                return (
                    <div
                        key={`${point.timestamp}-${index}`}
                        className="absolute w-1 h-1 rounded-full transition-opacity duration-100"
                        style={{
                            left: point.x - 2,
                            top: point.y - 2,
                            backgroundColor: getCursorColor(),
                            opacity: opacity * 0.4,
                            transform: `scale(${scale})`,
                        }}
                    />
                );
            })}

            {/* Particles */}
            {particles.map((particle) => {
                const opacity = particle.life / particle.maxLife;
                return (
                    <div
                        key={particle.id}
                        className="absolute rounded-full"
                        style={{
                            left: particle.x - particle.size / 2,
                            top: particle.y - particle.size / 2,
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: `hsl(${particle.hue}, 70%, 60%)`,
                            opacity: opacity * 0.8,
                            transform: `scale(${opacity})`,
                            boxShadow: `0 0 ${particle.size * 2}px hsl(${particle.hue}, 70%, 60%)`,
                        }}
                    />
                );
            })}

            {/* Main Cursor */}
            <div
                className="absolute transition-all duration-200 ease-out"
                style={{
                    left: cursor.x - getCursorSize() / 2,
                    top: cursor.y - getCursorSize() / 2,
                    transform: `scale(${cursor.isClicking ? 0.8 : 1}) rotate(${cursor.isClicking ? 180 : 0}deg)`,
                }}
            >
                <div
                    className="rounded-full border-2 backdrop-blur-sm"
                    style={{
                        width: getCursorSize(),
                        height: getCursorSize(),
                        backgroundColor: `${getCursorColor()}20`,
                        borderColor: getCursorColor(),
                        boxShadow: cursor.isHovering
                            ? `0 0 20px ${getCursorColor()}40, inset 0 0 20px ${getCursorColor()}20`
                            : `0 0 10px ${getCursorColor()}30`,
                    }}
                >
                    {/* Inner dot */}
                    <div
                        className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                            backgroundColor: getCursorColor(),
                            opacity: cursor.cursorType === "default" ? 1 : 0.7,
                        }}
                    />
                </div>
            </div>

            {/* Click Ripple Effect */}
            {cursor.isClicking && (
                <div
                    className="absolute"
                    style={{
                        left: cursor.x - 30,
                        top: cursor.y - 30,
                    }}
                >
                    <div
                        className="w-16 h-16 rounded-full border-2 animate-ping"
                        style={{
                            borderColor: getCursorColor(),
                            animationDuration: "0.6s",
                        }}
                    />
                    <div
                        className="absolute top-2 left-2 w-12 h-12 rounded-full border animate-ping"
                        style={{
                            borderColor: getCursorColor(),
                            animationDuration: "0.8s",
                            animationDelay: "0.1s",
                        }}
                    />
                </div>
            )}

            {/* Cursor Type Indicator */}
            {cursor.cursorType !== "default" && (
                <div
                    className="absolute text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm"
                    style={{
                        left: cursor.x + 25,
                        top: cursor.y - 10,
                        backgroundColor: `${getCursorColor()}20`,
                        color: getCursorColor(),
                        border: `1px solid ${getCursorColor()}40`,
                    }}
                >
                    {cursor.cursorType.toUpperCase()}
                </div>
            )}

            {/* Hover Glow */}
            {cursor.isHovering && (
                <div
                    className="absolute rounded-full animate-pulse"
                    style={{
                        left: cursor.x - 40,
                        top: cursor.y - 40,
                        width: 80,
                        height: 80,
                        background: `radial-gradient(circle, ${getCursorColor()}15 0%, transparent 70%)`,
                        animationDuration: "2s",
                    }}
                />
            )}
        </div>
    );
};

export default ModernCursor;