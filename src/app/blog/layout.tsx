import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | Articles on Web Development",
    description: "Read my latest articles, tutorials, and insights on web development, Next.js, React, and modern web technologies. Stay updated with the latest trends and best practices.",
    keywords: [
        "blog",
        "web development",
        "Next.js",
        "React",
        "JavaScript",
        "TypeScript",
        "tutorials",
        "programming articles",
        "tech blog",
        "development insights",
        "coding tutorials",
        "frontend development",
        "backend development",
        "full-stack development"
    ],
    authors: [{ name: "Bishnu BK", url: "https://www.bishnubk.com.np" }],
    creator: "Bishnu BK",
    publisher: "Bishnu BK",
    openGraph: {
        title: "Blog | Articles on Web Development",
        description: "Read my latest articles, tutorials, and insights on web development, Next.js, React, and modern web technologies. Stay updated with the latest trends and best practices.",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/blog`,
        type: "website",
        locale: "en_US",
        siteName: "Bishnu BK Portfolio",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/coding2.png`,
                width: 1200,
                height: 630,
                alt: "Bishnu BK Blog - Web Development Articles and Tutorials",
                type: "image/png",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Blog | Articles on Web Development",
        description: "Read my latest articles, tutorials, and insights on web development, Next.js, React, and modern web technologies.",
        creator: "@bishnubk",
        site: "@bishnubk",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/coding2.png`,
                alt: "Bishnu BK Blog - Web Development Articles",
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
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/blog`,
        types: {
            "application/rss+xml": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/blog/rss.xml`,
        },
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}