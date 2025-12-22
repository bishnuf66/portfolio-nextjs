"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import useStore from "@/store/store";
import { useBlogs } from "@/hooks/useBlogs";
import { BlogCardSkeleton } from "@/components/LoadingSkeleton";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import {
  AnimatedSection,
  StaggeredContainer,
} from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/Button";

const FeaturedBlogs = () => {
  const { isDarkMode } = useStore();
  const { data: blogs = [], isLoading } = useBlogs(true);

  const featuredBlogs = blogs.slice(0, 3);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (featuredBlogs.length === 0) {
    return (
      <AnimatedSection animation="fadeIn" className="text-center py-20">
        <BookOpen
          size={64}
          className={`mx-auto mb-4 ${
            isDarkMode ? "text-gray-600" : "text-gray-400"
          }`}
        />
        <p
          className={`text-xl ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          No blog posts yet. Check back soon!
        </p>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection animation="fadeIn" duration={0.8}>
      <StaggeredContainer
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        staggerDelay={0.15}
      >
        {featuredBlogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className={`group ${
              isDarkMode ? "bg-gray-800/50" : "bg-white"
            } rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border ${
              isDarkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {blog.cover_image_url && (
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={blog.cover_image_url}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            )}
            <div className="p-6">
              <h3
                className={`text-2xl font-bold mb-3 line-clamp-2 group-hover:text-blue-500 transition-colors ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {blog.title}
              </h3>
              <p
                className={`mb-4 line-clamp-3 ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {blog.excerpt}
              </p>

              <div
                className={`flex items-center gap-4 text-sm mb-4 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <div className="flex items-center gap-1">
                  <User size={16} />
                  <span>{blog.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>
                    {new Date(blog.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blog.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isDarkMode
                          ? "bg-blue-900/50 text-blue-200"
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
      </StaggeredContainer>

      <AnimatedSection
        animation="slideUp"
        delay={0.4}
        className="text-center mt-12"
      >
        <Link href="/blog">
          <Button
            variant="gradient"
            size="lg"
            icon={<BookOpen size={20} />}
            iconPosition="left"
            className="transform hover:scale-105"
          >
            Read All Articles
          </Button>
        </Link>
      </AnimatedSection>
    </AnimatedSection>
  );
};

export default FeaturedBlogs;
