"use client";

import React from "react";
import Link from "next/link";
import useStore from "@/store/store";
import { useBlogs } from "@/hooks/useBlogs";
import { BlogCardSkeleton } from "@/components/LoadingSkeleton";
import { Calendar, User } from "lucide-react";
import { usePagination } from "@/hooks/usePagination";
import Pagination from "@/components/ui/Pagination";

export default function BlogPage() {
    const { isDarkMode } = useStore();
    const { data: blogs = [], isLoading } = useBlogs(true);

    const {
        currentPage,
        totalPages,
        paginatedData,
        goToPage,
    } = usePagination({
        data: blogs,
        itemsPerPage: 6,
    });

    return (
        <div
            className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
                } pt-20`}
        >
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-linear-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        Blog
                    </h1>
                    <p
                        className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"
                            }`}
                    >
                        Thoughts, tutorials, and insights on web development
                    </p>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <p
                            className={`text-xl ${isDarkMode ? "text-gray-400" : "text-gray-600"
                                }`}
                        >
                            No blog posts yet. Check back soon!
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {paginatedData.map((blog) => (
                                <Link
                                    key={blog.id}
                                    href={`/blog/${blog.slug}`}
                                    className={`${isDarkMode ? "bg-gray-800" : "bg-white"
                                        } rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2`}
                                >
                                    {blog.cover_image_url && (
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={blog.cover_image_url}
                                                alt={blog.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2
                                            className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"
                                                }`}
                                        >
                                            {blog.title}
                                        </h2>
                                        <p
                                            className={`mb-4 line-clamp-3 ${isDarkMode ? "text-gray-300" : "text-gray-600"
                                                }`}
                                        >
                                            {blog.excerpt}
                                        </p>

                                        <div
                                            className={`flex items-center gap-4 text-sm mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                                }`}
                                        >
                                            <div className="flex items-center gap-1">
                                                <User size={16} />
                                                <span>{blog.author}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar size={16} />
                                                <span>
                                                    {new Date(blog.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>

                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {blog.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode
                                                            ? "bg-blue-900 text-blue-200"
                                                            : "bg-blue-100 text-blue-800"
                                                            }`}
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={goToPage}
                            itemsPerPage={6}
                            totalItems={blogs.length}
                        />
                    </>
                )}
            </div>
        </div>
    );
}
