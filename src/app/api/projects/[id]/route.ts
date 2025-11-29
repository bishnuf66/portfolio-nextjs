import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAuthenticatedClient } from "@/lib/supabase-auth-server";
import { rateLimit } from "@/lib/rate-limit";
import { validateProjectData } from "@/lib/validation";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

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

    // Rate limiting: 20 updates per minute per user
    const rateLimitResult = rateLimit(`update-project:${user.id}`, {
      interval: 60000,
      maxRequests: 20,
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

    // Cast body to any to avoid overly strict generic typing issues
    const { data, error } = await authenticatedSupabase
      .from("projects")
      .update(body as any)
      .eq("id", id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log("DELETE request received for project:", id);

    // Get the authorization header
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No authorization header found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    const supabase = await createClient();

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      token,
    );

    console.log("Auth check result:", { user: user?.email, authError });

    if (authError || !user) {
      console.log("Authentication failed:", authError?.message);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("User authenticated, proceeding with delete");

    // Rate limiting: 10 deletes per minute per user
    const rateLimitResult = rateLimit(`delete-project:${user.id}`, {
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

    // Create an authenticated client with the user's token for RLS
    const authenticatedSupabase = createAuthenticatedClient(token);

    const { error } = await authenticatedSupabase
      .from("projects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Delete error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("Project deleted successfully");
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete catch error:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 },
    );
  }
}
