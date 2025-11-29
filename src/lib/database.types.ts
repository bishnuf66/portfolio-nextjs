export interface Database {
    public: {
        Tables: {
            projects: {
                Row: {
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
                };
                Insert: {
                    id?: string;
                    name: string;
                    url: string;
                    description: string;
                    tech_stack: string[];
                    cover_image_url?: string;
                    gallery_images?: string[];
                    category: "professional" | "personal";
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    url?: string;
                    description?: string;
                    tech_stack?: string[];
                    cover_image_url?: string;
                    gallery_images?: string[];
                    category?: "professional" | "personal";
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
    };
}
