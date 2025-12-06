export interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    cover_image_url?: string;
    author: string;
    tags: string[];
    published: boolean;
    created_at: string;
    updated_at: string;
}

export interface Testimonial {
    id: string;
    name: string;
    slug: string;
    role: string;
    company?: string;
    content: string;
    avatar_url?: string;
    rating?: number;
    published: boolean;
    created_at: string;
    updated_at: string;
}
