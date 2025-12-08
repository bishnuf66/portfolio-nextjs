"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store/store";
import { useCreateBlog } from "@/hooks/useBlogs";
import withAuth from "@/components/withAuth";
import BlogFormPage from "@/components/dashboard/BlogFormPage";

const AddBlogPage = () => {
    const router = useRouter();
    const { isDarkMode } = useStore();
    const createBlog = useCreateBlog();
    const [uploading, setUploading] = useState(false);

    const handleSubmit = async (blogData: any) => {
        setUploading(true);
        try {
            await createBlog.mutateAsync(blogData);
            router.push("/dashboard?tab=blogs");
        } catch (error) {
            console.error("Failed to create blog:", error);
            alert("Failed to create blog");
        } finally {
            setUploading(false);
        }
    };

    return (
        <BlogFormPage
            onSubmit={handleSubmit}
            onCancel={() => router.push("/dashboard?tab=blogs")}
            uploading={uploading}
            isDarkMode={isDarkMode}
        />
    );
};

export default withAuth(AddBlogPage);
