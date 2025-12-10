/**
 * Validates and returns a safe image URL with fallback
 * @param imageUrl - The image URL to validate
 * @param fallback - The fallback image URL (default: placeholder)
 * @returns A valid image URL
 */
export const getSafeImageUrl = (
    imageUrl: string | null | undefined,
    fallback: string = "/project-images/placeholder.png",
): string => {
    // Check if imageUrl exists and is not empty/whitespace
    if (imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== "") {
        return imageUrl.trim();
    }

    return fallback;
};

/**
 * Validates if an image URL is valid
 * @param imageUrl - The image URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidImageUrl = (
    imageUrl: string | null | undefined,
): boolean => {
    if (!imageUrl || typeof imageUrl !== "string") {
        return false;
    }

    const trimmed = imageUrl.trim();
    if (trimmed === "") {
        return false;
    }

    // Basic URL validation
    try {
        new URL(trimmed);
        return true;
    } catch {
        // If it's not a full URL, check if it's a valid relative path
        return trimmed.startsWith("/") || trimmed.startsWith("./") ||
            trimmed.startsWith("../");
    }
};

/**
 * Creates an image error handler that sets a fallback image
 * @param fallback - The fallback image URL
 * @returns Error handler function
 */
export const createImageErrorHandler = (
    fallback: string = "/project-images/placeholder.png",
) => {
    return (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== fallback) {
            target.src = fallback;
        }
    };
};
