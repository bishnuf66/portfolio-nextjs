// Performance monitoring utilities

export const measurePerformance = (
    metricName: string,
    callback: () => void,
) => {
    if (typeof window === "undefined") return;

    const startTime = performance.now();
    callback();
    const endTime = performance.now();

    const duration = endTime - startTime;

    // Log slow operations
    if (duration > 100) {
        console.warn(
            `Slow operation detected: ${metricName} took ${
                duration.toFixed(2)
            }ms`,
        );
    }

    return duration;
};

// Report Web Vitals
export const reportWebVitals = (metric: any) => {
    if (typeof window === "undefined") return;

    // Send to analytics
    const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        id: metric.id,
        label: metric.label,
    });

    // Use sendBeacon if available for better performance
    if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/analytics/vitals", body);
    } else {
        fetch("/api/analytics/vitals", {
            body,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            keepalive: true,
        });
    }
};

// Lazy load images with Intersection Observer
export const lazyLoadImage = (img: HTMLImageElement) => {
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const image = entry.target as HTMLImageElement;
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.removeAttribute("data-src");
                    }
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: "50px 0px",
            threshold: 0.01,
        });

        observer.observe(img);
    } else {
        // Fallback for browsers without IntersectionObserver
        if (img.dataset.src) {
            img.src = img.dataset.src;
        }
    }
};

// Debounce function for performance
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void => {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Throttle function for performance
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number,
): (...args: Parameters<T>) => void => {
    let inThrottle: boolean;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Preload critical resources
export const preloadResource = (href: string, as: string) => {
    if (typeof window === "undefined") return;

    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
};

// Check if user prefers reduced motion
export const prefersReducedMotion = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Get connection speed
export const getConnectionSpeed = (): string => {
    if (typeof window === "undefined" || !("connection" in navigator)) {
        return "unknown";
    }

    const connection = (navigator as any).connection;
    return connection?.effectiveType || "unknown";
};

// Adaptive loading based on connection
export const shouldLoadHeavyContent = (): boolean => {
    const speed = getConnectionSpeed();
    return speed === "4g" || speed === "unknown";
};
