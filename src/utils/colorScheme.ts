// Consistent color scheme for dark/light mode across the application

export const colorScheme = {
    // Background colors
    background: {
        primary: {
            dark: "bg-black",
            light: "bg-white",
        },
        secondary: {
            dark: "bg-gray-900",
            light: "bg-gray-50",
        },
        tertiary: {
            dark: "bg-gray-800",
            light: "bg-gray-100",
        },
        card: {
            dark: "bg-gray-800",
            light: "bg-white",
        },
    },

    // Text colors
    text: {
        primary: {
            dark: "text-white",
            light: "text-gray-900",
        },
        secondary: {
            dark: "text-gray-300",
            light: "text-gray-600",
        },
        tertiary: {
            dark: "text-gray-400",
            light: "text-gray-500",
        },
        muted: {
            dark: "text-gray-500",
            light: "text-gray-400",
        },
    },

    // Border colors
    border: {
        primary: {
            dark: "border-gray-700",
            light: "border-gray-200",
        },
        secondary: {
            dark: "border-gray-600",
            light: "border-gray-300",
        },
    },

    // Accent colors (consistent across modes)
    accent: {
        blue: "text-blue-500",
        purple: "text-purple-500",
        pink: "text-pink-500",
        green: "text-green-500",
        yellow: "text-yellow-500",
        orange: "text-orange-500",
    },

    // Gradients
    gradients: {
        primary: "bg-gradient-to-r from-blue-500 to-purple-600",
        secondary: "bg-gradient-to-r from-purple-500 to-pink-600",
        tertiary: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
    },
};

// Helper function to get color based on dark mode
export const getColor = (colorPath: string, isDarkMode: boolean) => {
    const pathParts = colorPath.split(".");
    let current: any = colorScheme;

    for (const part of pathParts) {
        current = current[part];
        if (!current) return "";
    }

    if (typeof current === "object" && current.dark && current.light) {
        return isDarkMode ? current.dark : current.light;
    }

    return current || "";
};

// Utility classes for common combinations
export const getBackgroundClass = (
    isDarkMode: boolean,
    variant: "primary" | "secondary" | "tertiary" | "card" = "primary",
) => {
    return getColor(`background.${variant}`, isDarkMode);
};

export const getTextClass = (
    isDarkMode: boolean,
    variant: "primary" | "secondary" | "tertiary" | "muted" = "primary",
) => {
    return getColor(`text.${variant}`, isDarkMode);
};

export const getBorderClass = (
    isDarkMode: boolean,
    variant: "primary" | "secondary" = "primary",
) => {
    return getColor(`border.${variant}`, isDarkMode);
};
