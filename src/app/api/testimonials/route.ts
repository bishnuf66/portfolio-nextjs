import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { supabasePublic } from "@/lib/supabase-public";
import { createAuthenticatedClient } from "@/lib/supabase-auth-server";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const published = searchParams.get("published");
        const limit = searchParams.get("limit");
        const page = searchParams.get("page");
        const search = searchParams.get("search");
        const sortBy = searchParams.get("sortBy") || "created_at";
        const sortOrder = searchParams.get("sortOrder") || "desc";
        const rating = searchParams.get("rating");
        const pageSize = parseInt(limit || "10");
        const currentPage = parseInt(page || "1");
        const offset = (currentPage - 1) * pageSize;

        console.log("Testimonial API Debug - Request params:", {
            published,
            page,
            limit,
            search,
            sortBy,
            sortOrder,
            rating,
        });

        let query = supabasePublic()
            .from("testimonials")
            .select("*", { count: "exact" });

        // Filter by published status
        if (published === "true") {
            query = query.eq("published", true);
        } else if (published === "false") {
            query = query.eq("published", false);
        }

        // Filter by rating
        if (rating) {
            const ratingNum = parseInt(rating);
            if (ratingNum >= 1 && ratingNum <= 5) {
                query = query.eq("rating", ratingNum);
            }
        }

        // Search filter
        if (search) {
            query = query.or(
                `name.ilike.%${search}%,role.ilike.%${search}%,company.ilike.%${search}%,content.ilike.%${search}%`,
            );
        }

        // Sorting
        const ascending = sortOrder === "asc";
        if (sortBy === "published") {
            query = query.order("published", { ascending });
            query = query.order("created_at", { ascending: false }); // Secondary sort
        } else if (sortBy === "rating") {
            query = query.order("rating", { ascending });
            query = query.order("created_at", { ascending: false }); // Secondary sort
        } else {
            query = query.order(sortBy, { ascending });
        }

        // Pagination
        if (limit && page) {
            query = query.range(offset, offset + pageSize - 1);
        } else if (limit) {
            query = query.limit(parseInt(limit));
        }

        const { data, error, count } = await query;

        if (error) {
            console.error("Database error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // If this is a paginated request, return pagination metadata
        if (page) {
            console.log("Testimonial API Debug - Taking paginated path");
            const totalPages = Math.ceil((count || 0) / pageSize);
            return NextResponse.json({
                data,
                pagination: {
                    currentPage,
                    totalPages,
                    pageSize,
                    totalItems: count,
                    hasNextPage: currentPage < totalPages,
                    hasPreviousPage: currentPage > 1,
                },
            });
        }

        console.log("Testimonial API Debug - Taking direct array path");
        return NextResponse.json(data);
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json(
            { error: "Failed to fetch testimonials" },
            { status: 500 },
        );
    }
}

export async function POST(request: Request) {
    try {
        // Get the authorization header
        const authHeader = request.headers.get("authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, {
                status: 401,
            });
        }

        const token = authHeader.replace("Bearer ", "");

        const supabase = await createClient();

        // Verify the token and get user
        const { data: { user }, error: authError } = await supabase.auth
            .getUser(
                token,
            );

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, {
                status: 401,
            });
        }

        // Rate limiting: 10 testimonial creations per minute per user
        const rateLimitResult = rateLimit(`create-testimonial:${user.id}`, {
            interval: 60000,
            maxRequests: 10,
        });

        if (!rateLimitResult.success) {
            return NextResponse.json(
                {
                    error: "Too many requests. Please try again later.",
                    resetTime: rateLimitResult.resetTime,
                },
                { status: 429 },
            );
        }

        const body = await request.json();

        // Create an authenticated client with the user's token for RLS
        const authenticatedSupabase = createAuthenticatedClient(token);

        const { data, error } = await (authenticatedSupabase as any)
            .from("testimonials")
            .insert([body])
            .select();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Revalidate pages after creating testimonial
        revalidatePath("/");

        return NextResponse.json(data[0], { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to create testimonial" },
            { status: 500 },
        );
    }
}
