import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAuthenticatedClient } from "@/lib/supabase-auth-server";

interface AnalyticsData {
    id: string;
    visitor_id: string;
    page_path: string;
    country?: string;
    device_type?: string;
    duration?: number;
    duration_seconds?: number;
    created_at: string;
    // Add other fields from your analytics table as needed
}

interface ProjectView {
    project_id: string;
    viewed_at: string;
}

export async function GET(request: Request) {
    try {
        let supabase = await createClient();
        let user = null;
        let accessToken = null;

        // First try to get user from cookies (server-side session)
        const {
            data: { user: cookieUser },
            error: cookieError,
        } = await supabase.auth.getUser();

        if (cookieUser) {
            user = cookieUser;
        } else {
            // If no cookie session, try Authorization header
            const authHeader = request.headers.get("authorization");

            if (authHeader && authHeader.startsWith("Bearer ")) {
                accessToken = authHeader.replace("Bearer ", "");
                const { data: { user: tokenUser }, error: tokenError } =
                    await supabase.auth.getUser(accessToken);

                if (tokenUser) {
                    user = tokenUser;
                    // Use authenticated client for RLS
                    supabase = createAuthenticatedClient(accessToken);
                } else {
                    console.error("Token auth error:", tokenError);
                }
            }
        }

        if (!user) {
            console.error("No authenticated user found");
            return NextResponse.json({
                error: "Unauthorized",
                details: "Please log in to view analytics",
            }, {
                status: 401,
            });
        }

        console.log("Analytics API - User authenticated:", user.id);

        const { searchParams } = new URL(request.url);
        const range = searchParams.get("range") || "7d";

        // Calculate date range
        let dateFilter = new Date();
        if (range === "24h") {
            dateFilter.setHours(dateFilter.getHours() - 24);
        } else if (range === "7d") {
            dateFilter.setDate(dateFilter.getDate() - 7);
        } else if (range === "30d") {
            dateFilter.setDate(dateFilter.getDate() - 30);
        } else {
            dateFilter = new Date(0); // All time
        }

        // Fetch analytics data with type
        const { data: analyticsData, error: analyticsError } = await supabase
            .from("analytics")
            .select("*")
            .gte("created_at", dateFilter.toISOString()) as unknown as {
                data: AnalyticsData[] | null;
                error: Error | null;
            };

        if (analyticsError) {
            console.error("Analytics fetch error:", analyticsError);
            // Return empty data instead of error
            return NextResponse.json({
                totalViews: 0,
                uniqueVisitors: 0,
                topCountries: [],
                topPages: [],
                deviceBreakdown: [],
                avgDuration: 0,
                recentVisitors: [],
                projectViews: [],
            });
        }

        // Handle empty data
        if (!analyticsData || analyticsData.length === 0) {
            return NextResponse.json({
                totalViews: 0,
                uniqueVisitors: 0,
                topCountries: [],
                topPages: [],
                deviceBreakdown: [],
                avgDuration: 0,
                recentVisitors: [],
                projectViews: [],
            });
        }

        // Calculate metrics
        const totalViews = analyticsData.length;
        const uniqueVisitors = new Set(
            analyticsData.map((a) => a.visitor_id),
        ).size;

        // Top countries
        const countryCount: Record<string, number> = {};
        analyticsData.forEach((a) => {
            if (a.country) {
                countryCount[a.country] = (countryCount[a.country] || 0) + 1;
            }
        });
        const topCountries = Object.entries(countryCount)
            .map(([country, count]) => ({ country, count }))
            .sort((a, b) => b.count - a.count);

        // Top pages
        const pageCount: Record<string, number> = {};
        analyticsData.forEach((a) => {
            pageCount[a.page_path] = (pageCount[a.page_path] || 0) + 1;
        });
        const topPages = Object.entries(pageCount)
            .map(([page, count]) => ({ page, count }))
            .sort((a, b) => b.count - a.count);

        // Device breakdown
        const deviceCount: Record<string, number> = {};
        analyticsData.forEach((a) => {
            if (a.device_type) {
                deviceCount[a.device_type] = (deviceCount[a.device_type] || 0) +
                    1;
            }
        });
        const deviceBreakdown = Object.entries(deviceCount)
            .map(([device, count]) => ({ device, count }))
            .sort((a, b) => b.count - a.count);

        // Average duration
        const totalDuration = analyticsData.reduce(
            (sum, a) => sum + (a.duration_seconds || 0),
            0,
        );
        const avgDuration = totalViews > 0
            ? Math.floor(totalDuration / totalViews)
            : 0;

        // Recent visitors
        const recentVisitors = analyticsData
            .sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime(),
            )
            .slice(0, 10);

        // Project views
        const { data: projectViewsData } = await supabase
            .from("project_views")
            .select("project_id, viewed_at")
            .gte("viewed_at", dateFilter.toISOString()) as {
                data: ProjectView[] | null;
            };

        const projectViewCount: Record<string, number> = {};
        projectViewsData?.forEach((pv) => {
            projectViewCount[pv.project_id] =
                (projectViewCount[pv.project_id] || 0) + 1;
        });
        const projectViews = Object.entries(projectViewCount)
            .map(([project_id, count]) => ({ project_id, count }))
            .sort((a, b) => b.count - a.count);

        return NextResponse.json({
            totalViews,
            uniqueVisitors,
            topCountries,
            topPages,
            deviceBreakdown,
            avgDuration,
            recentVisitors,
            projectViews,
        });
    } catch (error) {
        console.error("Analytics API error:", error);
        // Return empty data instead of error to prevent dashboard crashes
        return NextResponse.json({
            totalViews: 0,
            uniqueVisitors: 0,
            topCountries: [],
            topPages: [],
            deviceBreakdown: [],
            avgDuration: 0,
            recentVisitors: [],
            projectViews: [],
        });
    }
}

// Track analytics (public endpoint)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { getSupabase } = await import("@/lib/supabase");

        const { error } = await getSupabase().from("analytics").insert(body);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to track analytics" },
            { status: 500 },
        );
    }
}
