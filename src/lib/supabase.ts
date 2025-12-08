import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (supabaseInstance) return supabaseInstance;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // For client-side, return a mock client that throws meaningful errors
    if (typeof window !== "undefined") {
      throw new Error(
        "Supabase is not available in this context. Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your environment.",
      );
    }
    throw new Error("Supabase environment variables are not set");
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      storageKey: "supabase.auth.token",
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
  });

  return supabaseInstance;
};

export interface Project {
  id: string;
  name: string;
  slug: string;
  url: string;
  description: string;
  tech_stack: string[];
  cover_image_url: string;
  gallery_images: string[];
  category: "professional" | "personal";
  is_featured?: boolean;
  created_at: string;
  updated_at: string;
}
