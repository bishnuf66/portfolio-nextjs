"use client";
import React from "react";
import { motion } from "framer-motion";
import useStore from "@/store/store";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient";
  size?: "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "md",
      fullWidth = false,
      loading = false,
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...restProps
    },
    ref
  ) => {
    const { isDarkMode } = useStore();

    const baseStyles =
      "relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

    const variants = {
      primary: isDarkMode
        ? "bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-500 shadow-sm hover:shadow-md border border-slate-700"
        : "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 shadow-sm hover:shadow-md border border-slate-900",
      secondary: isDarkMode
        ? "bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500 border border-slate-600 shadow-sm hover:shadow-md"
        : "bg-white text-slate-900 hover:bg-slate-50 focus:ring-slate-500 border border-slate-200 shadow-sm hover:shadow-md",
      outline: isDarkMode
        ? "border border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white focus:ring-slate-500"
        : "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-500",
      ghost: isDarkMode
        ? "text-slate-300 hover:bg-slate-800 hover:text-white focus:ring-slate-500"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500",
      gradient: isDarkMode
        ? "bg-linear-to-r from-slate-800 to-slate-700 text-white hover:from-slate-700 hover:to-slate-600 focus:ring-slate-500 shadow-sm hover:shadow-md border border-slate-600"
        : "bg-linear-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 focus:ring-slate-500 shadow-sm hover:shadow-md border border-slate-800",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded-md",
      md: "px-4 py-2 text-base rounded-lg",
      lg: "px-6 py-3 text-lg rounded-lg",
      xl: "px-8 py-4 text-xl rounded-xl",
    };

    const widthClass = fullWidth ? "w-full" : "";

    const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`;

    return (
      <motion.button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        {...(Object.fromEntries(
          Object.entries(restProps).filter(
            ([key]) =>
              ![
                "onAnimationStart",
                "onAnimationEnd",
                "onAnimationIteration",
                "onAnimationCancel",
              ].includes(key)
          )
        ) as any)}
      >
        {/* Loading spinner */}
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}

        {/* Icon */}
        {icon && !loading && iconPosition === "left" && (
          <span className="mr-2">{icon}</span>
        )}

        {/* Button content */}
        <span className="relative z-10">{children}</span>

        {/* Icon */}
        {icon && !loading && iconPosition === "right" && (
          <span className="ml-2">{icon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button };
