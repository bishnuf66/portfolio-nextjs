"use client";
import React, { useEffect, useRef, useState } from "react";

export const GlowingStarsBackgroundCard = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    const [mouseEnter, setMouseEnter] = useState(false);

    return (
        <div
            onMouseEnter={() => setMouseEnter(true)}
            onMouseLeave={() => setMouseEnter(false)}
            className={`relative bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] p-8 rounded-xl border border-[#2a2e37] overflow-hidden h-full ${className}`}
        >
            <div className="flex justify-center items-center">
                <Illustration mouseEnter={mouseEnter} />
            </div>
            <div className="relative z-10">{children}</div>
        </div>
    );
};

const Illustration = ({ mouseEnter }: { mouseEnter: boolean }) => {
    const stars = 108;
    const columns = 18;

    const [glowingStars, setGlowingStars] = useState<number[]>([]);

    const highlightedStars = useRef<number[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            highlightedStars.current = Array.from({ length: 5 }, () =>
                Math.floor(Math.random() * stars)
            );
            setGlowingStars([...highlightedStars.current]);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="h-48 p-1 w-full"
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap: `1px`,
            }}
        >
            {[...Array(stars)].map((_, starIdx) => {
                const isGlowing = glowingStars.includes(starIdx);
                const delay = (starIdx % 10) * 0.1;
                const staticDelay = starIdx * 0.01;
                return (
                    <div
                        key={`matrix-col-${starIdx}}`}
                        className="relative flex items-center justify-center"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`transition-all duration-300 ${mouseEnter
                                ? isGlowing
                                    ? "fill-white opacity-100"
                                    : "fill-gray-700 opacity-50"
                                : "fill-gray-700 opacity-30"
                                }`}
                            style={{
                                animationDelay: `${delay}s`,
                            }}
                        >
                            <path d="M12 0.587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
                        </svg>
                    </div>
                );
            })}
        </div>
    );
};
