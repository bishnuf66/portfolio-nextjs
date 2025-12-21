// Centralized cursor theme configuration
export interface CursorTheme {
    default: {
        size: string;
        backgroundColor: string;
        borderColor: string;
        boxShadow: string;
    };
    button: {
        size: string;
        backgroundColor: string;
        borderColor: string;
        boxShadow: string;
    };
    text: {
        width: string;
        height: string;
        backgroundColor: string;
        borderColor: string;
        boxShadow: string;
        borderRadius: string;
    };
    number: {
        size: string;
        backgroundColor: string;
        borderColor: string;
        boxShadow: string;
    };
    select: {
        size: string;
        backgroundColor: string;
        borderColor: string;
        boxShadow: string;
    };
    dot: {
        backgroundColor: string;
        boxShadow: string;
    };
    trail: {
        opacity: number;
        boxShadow: string;
    };
    glow: {
        size: string;
        background: string;
        filter: string;
    };
}

// Purple-themed cursor configuration
export const purpleCursorTheme: { light: CursorTheme; dark: CursorTheme } = {
    light: {
        default: {
            size: "40px",
            backgroundColor: "rgba(139, 92, 246, 0.8)", // Purple-500 with transparency
            borderColor: "rgba(139, 92, 246, 0.4)",
            boxShadow:
                "0 0 15px rgba(139, 92, 246, 0.3), 0 0 30px rgba(139, 92, 246, 0.1)",
        },
        button: {
            size: "60px",
            backgroundColor: "rgba(99, 102, 241, 0.9)", // Indigo-500
            borderColor: "rgba(99, 102, 241, 0.6)",
            boxShadow:
                "0 0 25px rgba(99, 102, 241, 0.5), 0 0 50px rgba(99, 102, 241, 0.2)",
        },
        text: {
            width: "4px",
            height: "32px",
            backgroundColor: "rgba(34, 197, 94, 0.9)", // Green-500
            borderColor: "rgba(34, 197, 94, 0.6)",
            boxShadow:
                "0 0 20px rgba(34, 197, 94, 0.5), 0 0 40px rgba(34, 197, 94, 0.2)",
            borderRadius: "2px",
        },
        number: {
            size: "36px",
            backgroundColor: "rgba(168, 85, 247, 0.9)", // Purple-500
            borderColor: "rgba(168, 85, 247, 0.6)",
            boxShadow:
                "0 0 20px rgba(168, 85, 247, 0.5), 0 0 40px rgba(168, 85, 247, 0.2)",
        },
        select: {
            size: "48px",
            backgroundColor: "rgba(245, 158, 11, 0.9)", // Amber-500
            borderColor: "rgba(245, 158, 11, 0.6)",
            boxShadow:
                "0 0 20px rgba(245, 158, 11, 0.5), 0 0 40px rgba(245, 158, 11, 0.2)",
        },
        dot: {
            backgroundColor: "rgba(139, 92, 246, 0.95)",
            boxShadow: "0 0 8px rgba(139, 92, 246, 0.4)",
        },
        trail: {
            opacity: 0.5,
            boxShadow: "0 0 6px rgba(139, 92, 246, 0.4)",
        },
        glow: {
            size: "100px",
            background:
                "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0.08) 40%, transparent 70%)",
            filter: "blur(0.5px)",
        },
    },
    dark: {
        default: {
            size: "40px",
            backgroundColor: "rgba(196, 181, 253, 0.9)", // Purple-300 for dark mode
            borderColor: "rgba(196, 181, 253, 0.5)",
            boxShadow:
                "0 0 15px rgba(196, 181, 253, 0.4), 0 0 30px rgba(196, 181, 253, 0.2)",
        },
        button: {
            size: "60px",
            backgroundColor: "rgba(165, 180, 252, 0.9)", // Indigo-300
            borderColor: "rgba(165, 180, 252, 0.6)",
            boxShadow:
                "0 0 25px rgba(165, 180, 252, 0.5), 0 0 50px rgba(165, 180, 252, 0.2)",
        },
        text: {
            width: "4px",
            height: "32px",
            backgroundColor: "rgba(74, 222, 128, 0.9)", // Green-400
            borderColor: "rgba(74, 222, 128, 0.6)",
            boxShadow:
                "0 0 20px rgba(74, 222, 128, 0.5), 0 0 40px rgba(74, 222, 128, 0.2)",
            borderRadius: "2px",
        },
        number: {
            size: "36px",
            backgroundColor: "rgba(196, 181, 253, 0.9)", // Purple-300
            borderColor: "rgba(196, 181, 253, 0.6)",
            boxShadow:
                "0 0 20px rgba(196, 181, 253, 0.5), 0 0 40px rgba(196, 181, 253, 0.2)",
        },
        select: {
            size: "48px",
            backgroundColor: "rgba(251, 191, 36, 0.9)", // Amber-400
            borderColor: "rgba(251, 191, 36, 0.6)",
            boxShadow:
                "0 0 20px rgba(251, 191, 36, 0.5), 0 0 40px rgba(251, 191, 36, 0.2)",
        },
        dot: {
            backgroundColor: "rgba(196, 181, 253, 0.95)",
            boxShadow: "0 0 8px rgba(196, 181, 253, 0.4)",
        },
        trail: {
            opacity: 0.7,
            boxShadow: "0 0 6px rgba(196, 181, 253, 0.4)",
        },
        glow: {
            size: "100px",
            background:
                "radial-gradient(circle, rgba(196, 181, 253, 0.20) 0%, rgba(196, 181, 253, 0.10) 40%, transparent 70%)",
            filter: "blur(1px)",
        },
    },
};

// Hook to get current cursor theme based on dark mode
export const useCursorTheme = (isDarkMode: boolean): CursorTheme => {
    return isDarkMode ? purpleCursorTheme.dark : purpleCursorTheme.light;
};

// Helper function to get cursor styles for a specific variant
export const getCursorVariantStyles = (
    variant: string,
    theme: CursorTheme,
) => {
    const baseStyles = {
        width: theme.default.size,
        height: theme.default.size,
        backgroundColor: theme.default.backgroundColor,
        borderColor: theme.default.borderColor,
        borderWidth: "2px",
        borderRadius: "50%",
        boxShadow: theme.default.boxShadow,
    };

    switch (variant) {
        case "button":
            return {
                ...baseStyles,
                width: theme.button.size,
                height: theme.button.size,
                backgroundColor: theme.button.backgroundColor,
                borderColor: theme.button.borderColor,
                boxShadow: theme.button.boxShadow,
            };
        case "text":
            return {
                ...baseStyles,
                width: theme.text.width,
                height: theme.text.height,
                backgroundColor: theme.text.backgroundColor,
                borderColor: theme.text.borderColor,
                borderRadius: theme.text.borderRadius,
                boxShadow: theme.text.boxShadow,
            };
        case "number":
            return {
                ...baseStyles,
                width: theme.number.size,
                height: theme.number.size,
                backgroundColor: theme.number.backgroundColor,
                borderColor: theme.number.borderColor,
                boxShadow: theme.number.boxShadow,
            };
        case "select":
            return {
                ...baseStyles,
                width: theme.select.size,
                height: theme.select.size,
                backgroundColor: theme.select.backgroundColor,
                borderColor: theme.select.borderColor,
                boxShadow: theme.select.boxShadow,
            };
        default:
            return baseStyles;
    }
};
