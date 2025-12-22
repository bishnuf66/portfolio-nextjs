import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const bucket = (formData.get("bucket") as string) || "project-images";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Server-side validations
    const MAX_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Max size is 1MB." },
        { status: 413 }
      );
    }

    if (!file.type || !file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Invalid file type. Only image files are allowed." },
        { status: 400 }
      );
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = fileName;

    const { error } = await getSupabase().storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
      data: { publicUrl },
    } = getSupabase().storage.from(bucket).getPublicUrl(filePath);

    return NextResponse.json({ imageUrl: publicUrl });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
