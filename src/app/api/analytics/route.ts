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
}

interface ProjectView {
    project_id: string;
    viewed_at: string;
}

interface FilterParams {
    range: "24h" | "7d" | "30d" | "all";
    view: "countries" | "pages" | "devices" | "sections";
    searchTerm?: string;
    selectedCountries?: string[];
    selectedDevices?: string[];
    minViews?: number;
    maxViews?: number;
    sortField?: "country" | "page" | "device" | "count";
    sortDirection?: "asc" | "desc";
    page?: number;
    limit?: number;
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

        // Parse filter parameters
        const range = (searchParams.get("range") || "7d") as
            | "24h"
            | "7d"
            | "30d"
            | "all";
        const view = (searchParams.get("view") || "countries") as
            | "countries"
            | "pages"
            | "devices"
            | "sections";
        const searchTerm = searchParams.get("searchTerm") || "";
        const selectedCountries = searchParams.getAll("selectedCountries");
        const selectedDevices = searchParams.getAll("selectedDevices");
        const minViews = parseInt(searchParams.get("minViews") || "0");
        const maxViews = parseInt(searchParams.get("maxViews") || "999999");
        const sortField = (searchParams.get("sortField") || "count") as
            | "country"
            | "page"
            | "device"
            | "count";
        const sortDirection = (searchParams.get("sortDirection") || "desc") as
            | "asc"
            | "desc";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

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

        // Fetch analytics data (used for summary metrics in all views)
        const { data: analyticsData, error: analyticsError } = await supabase
            .from("analytics")
            .select("*")
            .gte("created_at", dateFilter.toISOString()) as unknown as {
                data: AnalyticsData[] | null;
                error: Error | null;
            };

        if (analyticsError) {
            console.error("Analytics fetch error:", analyticsError);
            return NextResponse.json({
                items: [],
                total: 0,
                page: 1,
                totalPages: 0,
                summary: {
                    totalViews: 0,
                    uniqueVisitors: 0,
                    avgDuration: 0,
                },
            });
        }

        // Handle empty data
        if (!analyticsData || analyticsData.length === 0) {
            return NextResponse.json({
                items: [],
                total: 0,
                page: 1,
                totalPages: 0,
                summary: {
                    totalViews: 0,
                    uniqueVisitors: 0,
                    avgDuration: 0,
                },
            });
        }

        // Calculate summary metrics
        const totalViews = analyticsData.length;
        const uniqueVisitors = new Set(
            analyticsData.map((a) => a.visitor_id),
        ).size;
        const totalDuration = analyticsData.reduce(
            (sum, a) => sum + (a.duration_seconds || 0),
            0,
        );
        const avgDuration = totalViews > 0
            ? Math.floor(totalDuration / totalViews)
            : 0;

        // Process data based on view type
        let items: Array<
            {
                country?: string;
                page?: string;
                device?: string;
                count: number;
            }
        > = [];

        if (view === "countries") {
            const countryCount: Record<string, number> = {};
            analyticsData.forEach((a) => {
                if (a.country) {
                    countryCount[a.country] = (countryCount[a.country] || 0) +
                        1;
                }
            });
            items = Object.entries(countryCount)
                .map(([country, count]) => ({ country, count }));
        } else if (view === "pages") {
            const pageCount: Record<string, number> = {};
            analyticsData.forEach((a) => {
                pageCount[a.page_path] = (pageCount[a.page_path] || 0) + 1;
            });
            items = Object.entries(pageCount)
                .map(([page, count]) => ({ page, count }));
        } else if (view === "devices") {
            const deviceCount: Record<string, number> = {};
            analyticsData.forEach((a) => {
                if (a.device_type) {
                    deviceCount[a.device_type] =
                        (deviceCount[a.device_type] || 0) + 1;
                }
            });
            items = Object.entries(deviceCount)
                .map(([device, count]) => ({ device, count }));
        } else if (view === "sections") {
            // Sections view: aggregate from section_interactions table
            const { data: sectionData, error: sectionError } = await supabase
                .from("section_interactions")
                .select("section_name, interaction_type, created_at")
                .gte("created_at", dateFilter.toISOString()) as unknown as {
                    data:
                        | { section_name: string; interaction_type: string }[]
                        | null;
                    error: Error | null;
                };

            if (sectionError) {
                console.error(
                    "Section interactions fetch error:",
                    sectionError,
                );
            }

            const sectionCount: Record<string, number> = {};

            (sectionData || []).forEach((row) => {
                const key = `${row.section_name} (${row.interaction_type})`;
                sectionCount[key] = (sectionCount[key] || 0) + 1;
            });

            items = Object.entries(sectionCount).map(([label, count]) => ({
                page: label,
                count,
            }));
        }

        // Apply filtering
        let filtered = items.filter((item) => {
            // Search filter
            if (searchTerm) {
                const searchableField = item.country || item.page ||
                    item.device || "";
                if (
                    !searchableField.toLowerCase().includes(
                        searchTerm.toLowerCase(),
                    )
                ) {
                    return false;
                }
            }

            // Country filter
            if (selectedCountries.length > 0 && view === "countries") {
                if (!selectedCountries.includes(item.country || "")) {
                    return false;
                }
            }

            // Device filter
            if (selectedDevices.length > 0 && view === "devices") {
                if (!selectedDevices.includes(item.device || "")) {
                    return false;
                }
            }

            // View count filters
            if (item.count < minViews || item.count > maxViews) {
                return false;
            }

            return true;
        });

        // Apply sorting
        filtered.sort((a, b) => {
            let aVal: any = a[sortField as keyof typeof a] || 0;
            let bVal: any = b[sortField as keyof typeof b] || 0;

            if (typeof aVal === "string") {
                aVal = aVal.toLowerCase();
                bVal = (bVal as string).toLowerCase();
                return sortDirection === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        });

        // Apply pagination
        const total = filtered.length;
        const totalPages = Math.ceil(total / limit);
        const startIdx = (page - 1) * limit;
        const endIdx = startIdx + limit;
        const paginatedItems = filtered.slice(startIdx, endIdx);

        return NextResponse.json({
            items: paginatedItems,
            total,
            page,
            totalPages,
            summary: {
                totalViews,
                uniqueVisitors,
                avgDuration,
            },
        });
    } catch (error) {
        console.error("Analytics API error:", error);
        return NextResponse.json({
            items: [],
            total: 0,
            page: 1,
            totalPages: 0,
            summary: {
                totalViews: 0,
                uniqueVisitors: 0,
                avgDuration: 0,
            },
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
