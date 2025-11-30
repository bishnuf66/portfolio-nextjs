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
        // Check if user has accepted cookies
        const cookieConsent = localStorage.getItem("cookie-consent");
        if (cookieConsent !== "accepted") {
            return; // Don't track if cookies not accepted
        }

        // Track page view
        trackPageView(pathname);

        // Track time on page
        const cleanup = trackTimeOnPage(pathname);

        // Track scroll depth with throttling
        let maxScrollDepth = 0;
        let scrollTimeout: NodeJS.Timeout | null = null;
        const trackedDepths = new Set<string>(); // Track which depths we've already logged

        const handleScroll = () => {
            // Clear existing timeout
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }

            // Throttle scroll events - only track after user stops scrolling for 500ms
            scrollTimeout = setTimeout(() => {
                const scrollDepth =
                    (window.scrollY + window.innerHeight) / document.body.scrollHeight;

                if (scrollDepth > maxScrollDepth) {
                    maxScrollDepth = scrollDepth;

                    // Only track each depth milestone once
                    if (scrollDepth > 0.25 && scrollDepth < 0.5 && !trackedDepths.has("25%")) {
                        trackedDepths.add("25%");
                        trackSectionInteraction(pathname, "scroll", { depth: "25%" });
                    } else if (scrollDepth > 0.5 && scrollDepth < 0.75 && !trackedDepths.has("50%")) {
                        trackedDepths.add("50%");
                        trackSectionInteraction(pathname, "scroll", { depth: "50%" });
                    } else if (scrollDepth > 0.75 && !trackedDepths.has("75%")) {
                        trackedDepths.add("75%");
                        trackSectionInteraction(pathname, "scroll", { depth: "75%" });
                    }
                }
            }, 500); // Wait 500ms after user stops scrolling
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            cleanup();
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            window.removeEventListener("scroll", handleScroll);
        };
    }, [pathname]);

    return <>{children}</>;
}
