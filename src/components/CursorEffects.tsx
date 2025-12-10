"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import useStore from "@/store/store";

interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
}

const CursorEffects = () => {
    const { isDarkMode } = useStore();
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isClicking, setIsClicking] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [trail, setTrail] = useState<Array<{ x: number; y: number; opacity: number }>>([]);
    const particleIdRef = useRef(0);
    const animationRef = useRef<number | undefined>(undefined);

    // Create particles on click
    const createParticles = useCallback((x: number, y: number) => {
        const newParticles: Particle[] = [];
        const particleCount = 8;

        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 2 + Math.random() * 3;

            newParticles.push({
                id: particleIdRef.current++,
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity,
                life: 60,
                maxLife: 60,
                size: 3 + Math.random() * 4,
                color: isDarkMode ? "#60A5FA" : "#3B82F6",
            });
        }

        setParticles(prev => [...prev, ...newParticles]);
    }, [isDarkMode]);

    // Update particles animation
    const updateParticles = useCallback(() => {
        setParticles(prev =>
            prev
                .map(particle => ({
                    ...particle,
                    x: particle.x + particle.vx,
                    y: particle.y + particle.vy,
                    life: particle.life - 1,
                    vx: particle.vx * 0.98,
                    vy: particle.vy * 0.98,
                }))
                .filter(particle => particle.life > 0)
        );
    }, []);

    // Update trail
    const updateTrail = useCallback((x: number, y: number) => {
        setTrail(prev => {
            const newTrail = [{ x, y, opacity: 1 }, ...prev.slice(0, 15)];
            return newTrail.map((point, index) => ({
                ...point,
                opacity: 1 - (index / 15),
            }));
        });
    }, []);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
            updateTrail(e.clientX, e.clientY);
        };

        const handleMouseDown = (e: MouseEvent) => {
            setIsClicking(true);
            createParticles(e.clientX, e.clientY);
        };

        const handleMouseUp = () => {
            setIsClicking(false);
        };

        document.addEventListener("mousemove", updateMousePosition);
        document.addEventListener("mousedown", handleMouseDown);
        document.addEventListener("mouseup", handleMouseUp);

        // Animation loop
        const animate = () => {
            updateParticles();
            animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        return () => {
            document.removeEventListener("mousemove", updateMousePosition);
            document.removeEventListener("mousedown", handleMouseDown);
            document.removeEventListener("mouseup", handleMouseUp);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [updateTrail, createParticles, updateParticles]);

    // Don't render on mobile
    const [isMobile] = useState(() =>
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );

    if (isMobile) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-9999">
            {/* Trail Effect */}
            {trail.map((point, index) => (
                <div
                    key={index}
                    className="absolute w-2 h-2 rounded-full transition-opacity duration-100"
                    style={{
                        left: point.x - 4,
                        top: point.y - 4,
                        backgroundColor: isDarkMode ? "#60A5FA" : "#3B82F6",
                        opacity: point.opacity * 0.6,
                        transform: `scale(${1 - index * 0.05})`,
                    }}
                />
            ))}

            {/* Particles */}
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute rounded-full"
                    style={{
                        left: particle.x - particle.size / 2,
                        top: particle.y - particle.size / 2,
                        width: particle.size,
                        height: particle.size,
                        backgroundColor: particle.color,
                        opacity: particle.life / particle.maxLife,
                        transform: `scale(${particle.life / particle.maxLife})`,
                    }}
                />
            ))}

            {/* Main Cursor */}
            <div
                className="absolute transition-transform duration-100 ease-out"
                style={{
                    left: mousePosition.x - 16,
                    top: mousePosition.y - 16,
                    transform: isClicking ? "scale(1.5)" : "scale(1)",
                }}
            >
                <div
                    className="w-8 h-8 rounded-full border-2 mix-blend-difference"
                    style={{
                        backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
                        borderColor: isDarkMode ? "white" : "black",
                    }}
                />
            </div>

            {/* Click Ripple */}
            {isClicking && (
                <div
                    className="absolute"
                    style={{
                        left: mousePosition.x - 25,
                        top: mousePosition.y - 25,
                    }}
                >
                    <div
                        className="w-12 h-12 rounded-full border-2 animate-ping"
                        style={{
                            borderColor: isDarkMode ? "#60A5FA" : "#3B82F6",
                            animationDuration: "0.6s",
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default CursorEffects;