import { supabase } from "./supabase";

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
        deviceType,
        browser,
        os,
        userAgent: ua,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
};

// Get location info from IP
export const getLocationInfo = async () => {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        return {
            country: data.country_name,
            city: data.city,
            region: data.region,
            latitude: data.latitude,
            longitude: data.longitude,
            ipAddress: data.ip,
        };
    } catch (error) {
        console.error("Failed to get location:", error);
        return {};
    }
};

// Track page view
export const trackPageView = async (pagePath: string, pageTitle?: string) => {
    try {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        const deviceInfo = getDeviceInfo();
        const locationInfo = await getLocationInfo();

        const { error } = await supabase.from("analytics").insert({
            session_id: sessionId,
            visitor_id: visitorId,
            page_path: pagePath,
            page_title: pageTitle || document.title,
            referrer: document.referrer,
            ...deviceInfo,
            ...locationInfo,
        });

        if (error) {
            console.error("Analytics tracking error:", error);
        }
    } catch (error) {
        console.error("Failed to track page view:", error);
    }
};

// Track project view
export const trackProjectView = async (projectId: string) => {
    try {
        const sessionId = getSessionId();
        const visitorId = getVisitorId();
        const locationInfo = await getLocationInfo();
        const deviceInfo = getDeviceInfo();

        const { error } = await supabase.from("project_views").insert({
            project_id: projectId,
            session_id: sessionId,
            visitor_id: visitorId,
            country: locationInfo.country,
            city: locationInfo.city,
            device_type: deviceInfo.deviceType,
            referrer: document.referrer,
        });

        if (error) {
            console.error("Project view tracking error:", error);
        }
    } catch (error) {
        console.error("Failed to track project view:", error);
    }
};

// Track section interaction
export const trackSectionInteraction = async (
    sectionName: string,
    interactionType: "view" | "click" | "scroll",
    metadata?: Record<string, any>,
) => {
    try {
        const sessionId = getSessionId();

        const { error } = await supabase.from("section_interactions").insert({
            session_id: sessionId,
            section_name: sectionName,
            interaction_type: interactionType,
            metadata: metadata || {},
        });

        if (error) {
            console.error("Section interaction tracking error:", error);
        }
    } catch (error) {
        console.error("Failed to track section interaction:", error);
    }
};

// Track time on page
export const trackTimeOnPage = (pagePath: string) => {
    const startTime = Date.now();

    const updateDuration = async () => {
        const duration = Math.floor((Date.now() - startTime) / 1000);
        const sessionId = getSessionId();

        try {
            // Update the most recent analytics entry for this session and page
            const { error } = await supabase
                .from("analytics")
                .update({ duration_seconds: duration })
                .eq("session_id", sessionId)
                .eq("page_path", pagePath)
                .order("created_at", { ascending: false })
                .limit(1);

            if (error) {
                console.error("Duration update error:", error);
            }
        } catch (error) {
            console.error("Failed to update duration:", error);
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
