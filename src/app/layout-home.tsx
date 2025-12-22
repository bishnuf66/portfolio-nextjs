import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Full Stack Developer | Portfolio",
    description: "Experienced full-stack developer specializing in modern web technologies. Explore my projects, blog, and expertise in React, Next.js, TypeScript, and more.",
    keywords: [
        "full-stack developer",
        "web development",
        "React",
        "Next.js",
        "JavaScript",
        "TypeScript",
        "portfolio",
        "Node.js",
        "MongoDB",
        "PostgreSQL",
        "UI/UX design",
        "responsive design",
        "API development",
        "performance optimization",
        "modern web technologies"
    ],
    authors: [{ name: "Bishnu BK", url: "https://www.bishnubk.com.np" }],
    creator: "Bishnu BK",
    publisher: "Bishnu BK",
    openGraph: {
        title: "Full Stack Developer | Portfolio",
        description: "Experienced full-stack developer specializing in modern web technologies. Explore my projects, blog, and expertise in React, Next.js, TypeScript, and more.",
        url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np",
        type: "website",
        locale: "en_US",
        siteName: "Bishnu BK Portfolio",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/coding2.webp`,
                width: 1200,
                height: 630,
                alt: "Bishnu BK - Full Stack Developer Portfolio Homepage",
                type: "image/png",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Full Stack Developer | Portfolio",
        description: "Experienced full-stack developer specializing in modern web technologies.",
        creator: "@bishnubk",
        site: "@bishnubk",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/coding2.webp`,
                alt: "Bishnu BK - Full Stack Developer Portfolio",
            }
        ],
    },
    robots: {
        index: true,
        follow: true,
        nocache: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np",
    },
};