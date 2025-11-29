import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Project {
  id: string;
  name: string;
  url: string;
  description: string;
  tech_stack: string[];
  cover_image_url: string;
  gallery_images: string[];
  category: "professional" | "personal";
  created_at: string;
  updated_at: string;
}
