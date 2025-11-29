"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const MovingBorder = ({
    children,
    duration = 2000,
    className,
    containerClassName,
    borderClassName,
    as: Component = "button",
    ...otherProps
}: {
    children: React.ReactNode;
    duration?: number;
    className?: string;
    containerClassName?: string;
    borderClassName?: string;
    as?: any;
    [key: string]: any;
}) => {
    return (
        <Component
            className={cn(
                "relative text-xl p-[1px] overflow-hidden",
                containerClassName
            )}
            {...otherProps}
        >
            <div
                className="absolute inset-0"
                style={{
                    background: `linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6)`,
                    backgroundSize: "200% 200%",
                    animation: `gradient ${duration}ms linear infinite`,
                }}
            />
            <div
                className={cn(
                    "relative bg-slate-900/90 backdrop-blur-xl text-white flex items-center justify-center w-full h-full text-sm antialiased",
                    className
                )}
            >
                {children}
            </div>
            <style jsx>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      `}</style>
        </Component>
    );
};
