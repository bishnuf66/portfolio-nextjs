import { getSupabase } from "./supabase";

// Batch analytics data
interface AnalyticsData {
    session_id?: string;
    visitor_id?: string;
    source?: string;
    interaction_type?: string;
    metadata?: Record<string, unknown>;
    page_path?: string;
    page_title?: string;
    referrer?: string;
    device_type?: string;
    browser?: string;
    os?: string;
    user_agent?: string;
    screen_width?: number;
    screen_height?: number;
    viewport_width?: number;
    viewport_height?: number;
    language?: string;
    timezone?: string;
    country?: string;
    city?: string;
    region?: string;
    latitude?: number;
    longitude?: number;
    ip_address?: string;
}

let analyticsQueue: AnalyticsData[] = [];
let batchTimeout: NodeJS.Timeout | null = null;

const BATCH_SIZE = 10;
const BATCH_DELAY = 5000; // 5 seconds

// Flush analytics queue
const flushAnalytics = async () => {
    if (analyticsQueue.length === 0) return;

    const batch = [...analyticsQueue];
    analyticsQueue = [];

    try {
        const { error } = await getSupabase()
            .from("analytics")
            .insert(batch);

        if (error) {
            // Silently fail if table doesn't exist yet
            if (
                !error.message?.includes("relation") &&
                !error.message?.includes("does not exist") &&
                !error.code?.includes("PGRST116")
            ) {
                console.error("Analytics batch insert failed:", error);
            }
            // Re-queue failed items
            analyticsQueue.unshift(...batch);
        }
    } catch (error) {
        console.error("Analytics batch error:", error);
        // Re-queue failed items
        analyticsQueue.unshift(...batch);
    }
};

// Queue analytics data
const queueAnalytics = (data: AnalyticsData) => {
    analyticsQueue.push(data);

    // Flush immediately if batch is full
    if (analyticsQueue.length >= BATCH_SIZE) {
        flushAnalytics();
        if (batchTimeout) {
            clearTimeout(batchTimeout);
            batchTimeout = null;
        }
        return;
    }

    // Set timeout for batch flush
    if (!batchTimeout) {
        batchTimeout = setTimeout(() => {
            flushAnalytics();
            batchTimeout = null;
        }, BATCH_DELAY);
    }
};

// Generate or get session ID
export const getSessionId = (): string => {
    if (typeof window === "undefined") return "";

    let sessionId = sessionStorage.getItem("session_id");
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${
            Math.random().toString(36).substr(2, 9)
        }`;
        sessionStorage.setItem("session_id", sessionId);
    }
    return sessionId;
};

// Generate or get visitor ID (persists across sessions)
export const getVisitorId = (): string => {
    if (typeof window === "undefined") return "";

    let visitorId = localStorage.getItem("visitor_id");
    if (!visitorId) {
        visitorId = `visitor_${Date.now()}_${
            Math.random().toString(36).substr(2, 9)
        }`;
        localStorage.setItem("visitor_id", visitorId);
    }
    return visitorId;
};

// Get device info
export const getDeviceInfo = () => {
    if (typeof window === "undefined") return {};

    const ua = navigator.userAgent;
    let deviceType = "desktop";
    let browser = "unknown";
    let os = "unknown";

    // Device type
    if (/mobile/i.test(ua)) deviceType = "mobile";
    else if (/tablet|ipad/i.test(ua)) deviceType = "tablet";

    // Browser
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Edge")) browser = "Edge";

    // OS
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "macOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iOS")) os = "iOS";

    return {
        device_type: deviceType,
        browser: browser,
        os: os,
        user_agent: ua,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
};

// Get location info from IP
export const getLocationInfo = async () => {
    try {
        const response = await fetch("https://ipapi.co/json/", {
            signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            country: data.country_name,
            city: data.city,
            region: data.region,
            latitude: data.latitude,
            longitude: data.longitude,
            ip_address: data.ip,
        };
    } catch (error) {
        // Silently fail - location info is not critical
        console.warn(
            "Could not fetch location info:",
            error instanceof Error ? error.message : "Unknown error",
        );
        return {};
    }
};

// Track page view
export const trackPageView = async (pagePath: string, pageTitle?: string) => {
    // Check consent before tracking
    if (typeof window !== "undefined") {
        const cookieConsent = localStorage.getItem("cookie-consent");
        if (cookieConsent !== "accepted") {
            return; // Don't track if cookies not accepted
        }
    }

    // Don't track analytics for dashboard pages
    if (pagePath.startsWith("/dashboard")) {
        return;
    }

    try {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        const deviceInfo = getDeviceInfo();
        const locationInfo = await getLocationInfo();

        const analyticsData = {
            session_id: sessionId,
            visitor_id: visitorId,
            page_path: pagePath,
            page_title: pageTitle || document.title,
            referrer: document.referrer,
            ...deviceInfo,
            ...locationInfo,
        };

        const { error } = await getSupabase().from("analytics").insert(
            analyticsData,
        );

        if (error) {
            console.error("Analytics insert error:", error);
            // Silently fail if table doesn't exist yet
            if (
                !error.message?.includes("relation") &&
                !error.message?.includes("does not exist")
            ) {
                console.warn("Analytics tracking error:", error.message);
            }
        }
    } catch (error) {
        console.error("Analytics tracking exception:", error);
    }
};

// Track project view
export const trackProjectView = async (projectId: string) => {
    // Check consent before tracking
    if (typeof window !== "undefined") {
        const cookieConsent = localStorage.getItem("cookie-consent");
        if (cookieConsent !== "accepted") {
            return; // Don't track if cookies not accepted
        }
    }

    try {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        const locationInfo = await getLocationInfo();
        const deviceInfo = getDeviceInfo();

        const { error } = await getSupabase().from("project_views").insert({
            project_id: projectId,
            session_id: sessionId,
            visitor_id: visitorId,
            country: locationInfo.country,
            city: locationInfo.city,
            device_type: deviceInfo.device_type,
            referrer: document.referrer,
        });

        if (error) {
            // Silently fail if table doesn't exist
        }
    } catch {
        // Silently fail
    }
};

// Throttle cache for section interactions
const interactionCache = new Map<string, number>();
const THROTTLE_DURATION = 5000; // 5 seconds

// Track section interaction
export const trackSectionInteraction = async (
    sectionName: string,
    interactionType: "view" | "click" | "scroll",
    metadata?: Record<string, unknown>,
) => {
    // Check consent before tracking
    if (typeof window !== "undefined") {
        const cookieConsent = localStorage.getItem("cookie-consent");
        if (cookieConsent !== "accepted") {
            return; // Don't track if cookies not accepted
        }
    }

    // Don't track interactions on dashboard pages
    if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/dashboard")
    ) {
        return;
    }

    // Throttle: prevent duplicate tracking within 5 seconds
    const cacheKey = `${sectionName}-${interactionType}-${
        JSON.stringify(metadata)
    }`;
    const lastTracked = interactionCache.get(cacheKey);
    const now = Date.now();

    if (lastTracked && now - lastTracked < THROTTLE_DURATION) {
        return; // Skip if tracked recently
    }

    interactionCache.set(cacheKey, now);

    try {
        const sessionId = getSessionId();

        const { error } = await getSupabase().from("section_interactions")
            .insert({
                session_id: sessionId,
                section_name: sectionName,
                interaction_type: interactionType,
                metadata: metadata || {},
            });

        if (error) {
            // Silently fail if table doesn't exist
        }
    } catch {
        // Silently fail
    }
};

// Track project interaction (clicks, views, etc.)
export const trackProjectInteraction = async (
    source: string,
    interactionType: "click" | "view" | "hover",
    metadata: {
        projectId: string;
        projectName: string;
        action: string;
        [key: string]: unknown;
    },
) => {
    // Check consent before tracking
    if (typeof window !== "undefined") {
        const cookieConsent = localStorage.getItem("cookie-consent");
        if (cookieConsent !== "accepted") {
            return; // Don't track if cookies not accepted
        }
    }

    // Don't track interactions on dashboard pages
    if (
        typeof window !== "undefined" &&
        window.location.pathname.startsWith("/dashboard")
    ) {
        return;
    }

    try {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        const deviceInfo = getDeviceInfo();

        const analyticsData = {
            session_id: sessionId,
            visitor_id: visitorId,
            source,
            interaction_type: interactionType,
            metadata,
            ...deviceInfo,
        };

        queueAnalytics(analyticsData);
    } catch (error) {
        console.error("Project interaction tracking error:", error);
    }
};

// Track time on page
export const trackTimeOnPage = (pagePath: string) => {
    // Don't track time on dashboard pages
    if (pagePath.startsWith("/dashboard")) {
        return () => {}; // Return empty cleanup function
    }

    const startTime = Date.now();

    const updateDuration = async () => {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const sessionId = getSessionId();

        try {
            // Update the most recent analytics entry for this session and page
            const { error } = await getSupabase()
                .from("analytics")
                .update({ duration_seconds: duration })
                .eq("session_id", sessionId)
                .eq("page_path", pagePath)
                .order("created_at", { ascending: false })
                .limit(1);

            if (error) {
                // Silently fail
            }
        } catch (error) {
            // Silently fail if Supabase is not available
            console.debug("Analytics tracking skipped:", error);
        }
    };

    // Update duration every 30 seconds
    const interval = setInterval(updateDuration, 30000);

    // Update on page unload
    const handleUnload = () => {
        updateDuration();
        clearInterval(interval);
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
        clearInterval(interval);
        window.removeEventListener("beforeunload", handleUnload);
    };
};
