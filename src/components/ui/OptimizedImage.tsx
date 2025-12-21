"use client";

import Image from "next/image";
import { useState } from "react";
import { getSafeImageUrl, createImageErrorHandler } from "@/utils/imageUtils";

interface OptimizedImageProps {
    src: string | null | undefined;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    priority?: boolean;
    loading?: "lazy" | "eager";
    onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
    fallback?: string;
    unoptimized?: boolean;
}

export const OptimizedImage = ({
    src,
    alt,
    width,
    height,
    fill = false,
    className = "",
    priority = false,
    loading = "lazy",
    onError,
    fallback = "/project-images/placeholder.png",
    unoptimized = false,
    ...props
}: OptimizedImageProps) => {
    const [imageError, setImageError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Get safe image URL
    const safeImageUrl = getSafeImageUrl(src, fallback);

    // Check if it's a Supabase URL that might need unoptimized loading
    const isSupabaseUrl = safeImageUrl.includes('supabase.co');
    const shouldUnoptimize = unoptimized || isSupabaseUrl;

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setImageError(true);
        setIsLoading(false);

        if (onError) {
            onError(e);
        } else {
            // Use default error handler
            createImageErrorHandler(fallback)(e);
        }
    };

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    // If there's an error and we're using a Supabase URL, try with unoptimized
    const finalSrc = imageError && isSupabaseUrl ? fallback : safeImageUrl;

    const imageProps = {
        src: finalSrc,
        alt,
        className: `${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`,
        priority,
        loading,
        onError: handleImageError,
        onLoad: handleImageLoad,
        unoptimized: shouldUnoptimize,
        ...props,
    };

    if (fill) {
        return (
            <div className="relative w-full h-full">
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
                )}
                <Image
                    {...imageProps}
                    fill
                />
            </div>
        );
    }

    if (width && height) {
        return (
            <div className="relative" style={{ width, height }}>
                {isLoading && (
                    <div
                        className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded"
                        style={{ width, height }}
                    />
                )}
                <Image
                    {...imageProps}
                    width={width}
                    height={height}
                />
            </div>
        );
    }

    // Fallback to regular image with default dimensions
    return (
        <div className="relative w-full h-64">
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" />
            )}
            <Image
                {...imageProps}
                fill
            />
        </div>
    );
};