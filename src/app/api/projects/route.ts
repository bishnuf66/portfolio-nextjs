import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { supabasePublic } from "@/lib/supabase-public";
import { createAuthenticatedClient } from "@/lib/supabase-auth-server";
import { rateLimit } from "@/lib/rate-limit";
import { validateProjectData } from "@/lib/validation";

export async function GET() {
  try {
    const { data, error } = await supabasePublic
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabase = await createClient();

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      token,
    );

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limiting: 10 project creations per minute per user
    const rateLimitResult = rateLimit(`create-project:${user.id}`, {
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

    // Validate input data
    const validation = validateProjectData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.errors },
        { status: 400 },
      );
    }

    // Create an authenticated client with the user's token for RLS
    const authenticatedSupabase = createAuthenticatedClient(token);

    // Cast body to any here to avoid overly strict generic typing issues
    const { data, error } = await authenticatedSupabase
      .from("projects")
      .insert([body as any])
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 },
    );
  }
}
