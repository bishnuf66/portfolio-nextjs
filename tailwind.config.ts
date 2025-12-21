import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Standardized dark mode colors
                'dark-primary': '#0f0f0f',      // Main dark background
                'dark-secondary': '#1a1a1a',    // Secondary dark background
                'dark-tertiary': '#262626',     // Tertiary dark background (cards, inputs)
                'dark-border': '#404040',       // Dark borders
                'dark-text': '#ffffff',         // Primary dark text
                'dark-text-secondary': '#d4d4d4', // Secondary dark text
                'dark-text-muted': '#a3a3a3',   // Muted dark text
                // Light mode colors
                'light-primary': '#ffffff',     // Main light background
                'light-secondary': '#f8fafc',   // Secondary light background
                'light-tertiary': '#f1f5f9',    // Tertiary light background
                'light-border': '#e2e8f0',      // Light borders
                'light-text': '#0f172a',        // Primary light text
                'light-text-secondary': '#475569', // Secondary light text
                'light-text-muted': '#64748b',  // Muted light text
            },
        },
    },
    plugins: [typography],
    darkMode: "class",
};

export default config;
