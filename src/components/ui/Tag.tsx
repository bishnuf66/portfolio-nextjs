"use client";
import React from "react";
import { motion } from "framer-motion";
import useStore from "@/store/store";

export interface TagProps {
  children: React.ReactNode;
  variant?: "default" | "tech" | "category" | "blog";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Tag = React.forwardRef<HTMLSpanElement, TagProps>(
  ({ children, variant = "default", size = "md", className = "" }, ref) => {
    const { isDarkMode } = useStore();

    const baseStyles =
      "inline-flex items-center font-medium transition-all duration-300";

    const variants = {
      default: isDarkMode
        ? "bg-gradient-to-r from-slate-700/50 to-slate-600/50 text-slate-200 border border-slate-600/50"
        : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200",
      tech: isDarkMode
        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30"
        : "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200",
      category: isDarkMode
        ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/30"
        : "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border border-emerald-200",
      blog: isDarkMode
        ? "bg-gradient-to-r from-indigo-500/20 to-blue-500/20 text-indigo-300 border border-indigo-500/30"
        : "bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-700 border border-indigo-200",
    };

    const sizes = {
      sm: "px-2 py-1 text-xs rounded-full",
      md: "px-3 py-1.5 text-sm rounded-full",
      lg: "px-4 py-2 text-base rounded-full",
    };

    const tagClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

    return (
      <motion.span
        ref={ref}
        className={tagClasses}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.span>
    );
  }
);

Tag.displayName = "Tag";

export { Tag };
