import { useEffect, useRef } from "react";
import { trackSectionInteraction } from "@/lib/analytics";

// Hook: track a section "view" when it becomes visible in viewport
export const useSectionViewTracking = (sectionName: string) => {
    const elementRef = useRef<HTMLElement | null>(null);
    const hasTrackedRef = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!elementRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry.isIntersecting) return;
                if (hasTrackedRef.current) return;

                hasTrackedRef.current = true;
                trackSectionInteraction(sectionName, "view", {
                    viewportHeight: window.innerHeight,
                });
            },
            { threshold: 0.4 },
        );

        observer.observe(elementRef.current);

        return () => {
            observer.disconnect();
        };
    }, [sectionName]);

    return elementRef;
};
