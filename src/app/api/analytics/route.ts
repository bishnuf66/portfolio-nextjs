import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        // Check if user is authenticated
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, {
                status: 401,
            });
        }

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

        // Fetch analytics data
        const { data: analyticsData, error: analyticsError } = await supabase
            .from("analytics")
            .select("*")
            .gte("created_at", dateFilter.toISOString());

        if (analyticsError) {
            return NextResponse.json(
                { error: analyticsError.message },
                { status: 500 },
            );
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
            .select("project_id")
            .gte("viewed_at", dateFilter.toISOString());

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
        return NextResponse.json(
            { error: "Failed to fetch analytics" },
            { status: 500 },
        );
    }
}

// Track analytics (public endpoint)
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { supabase } = await import("@/lib/supabase");

        const { error } = await supabase.from("analytics").insert(body);

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
