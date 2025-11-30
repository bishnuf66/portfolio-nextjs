"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
    trackPageView,
    trackTimeOnPage,
    trackSectionInteraction,
} from "@/lib/analytics";

export default function AnalyticsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    useEffect(() => {
        // Track page view
        trackPageView(pathname);

        // Track time on page
        const cleanup = trackTimeOnPage(pathname);

        // Track scroll depth
        let maxScrollDepth = 0;
        const handleScroll = () => {
            const scrollDepth =
                (window.scrollY + window.innerHeight) / document.body.scrollHeight;
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                if (scrollDepth > 0.25 && scrollDepth < 0.5) {
                    trackSectionInteraction(pathname, "scroll", { depth: "25%" });
                } else if (scrollDepth > 0.5 && scrollDepth < 0.75) {
                    trackSectionInteraction(pathname, "scroll", { depth: "50%" });
                } else if (scrollDepth > 0.75) {
                    trackSectionInteraction(pathname, "scroll", { depth: "75%" });
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            cleanup();
            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname]);

    return <>{children}</>;
}
