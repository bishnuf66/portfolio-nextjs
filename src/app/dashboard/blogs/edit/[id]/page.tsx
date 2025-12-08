"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import useStore from "@/store/store";
import { useBlogs, useUpdateBlog } from "@/hooks/useBlogs";
import withAuth from "@/components/withAuth";
import BlogFormPage from "@/components/dashboard/BlogFormPage";
import { Database } from "@/lib/database.types";

type Blog = Database["public"]["Tables"]["blogs"]["Row"];

const EditBlogPage = () => {
  const router = useRouter();
  const params = useParams();
  const { isDarkMode } = useStore();
  const { data: blogs = [] } = useBlogs(false);
  const updateBlog = useUpdateBlog();
  const [uploading, setUploading] = useState(false);
  const [initialData, setInitialData] = useState<Blog | null>(null);

  useEffect(() => {
    const blog = blogs.find((b) => b.id === params.id);
    if (blog) {
      setInitialData(blog as any);
    }
  }, [blogs, params.id]);

  const handleSubmit = async (blogData: any) => {
    setUploading(true);
    try {
      await updateBlog.mutateAsync({
        id: params.id as string,
        blogData,
      });
      router.push("/dashboard?tab=blogs");
    } catch (error) {
      console.error("Failed to update blog:", error);
      alert("Failed to update blog");
    } finally {
      setUploading(false);
    }
  };

  if (!initialData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <BlogFormPage
      initialData={initialData}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/dashboard?tab=blogs")}
      uploading={uploading}
      isDarkMode={isDarkMode}
    />
  );
};

export default withAuth(EditBlogPage);
