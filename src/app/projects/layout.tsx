import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | Portfolio",
    description: "Explore my portfolio of professional and personal projects. Featuring web applications, full-stack solutions, and innovative projects built with modern technologies like React, Next.js, Node.js, and more.",
    keywords: [
        "projects",
        "portfolio",
        "web development",
        "full-stack",
        "React",
        "Next.js",
        "JavaScript",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "PostgreSQL",
        "web applications",
        "software development",
        "professional projects",
        "personal projects",
        "open source"
    ],
    authors: [{ name: "Bishnu BK", url: "https://www.bishnubk.com.np" }],
    creator: "Bishnu BK",
    publisher: "Bishnu BK",
    openGraph: {
        title: "Projects | Portfolio",
        description: "Explore my portfolio of professional and personal projects. Featuring web applications, full-stack solutions, and innovative projects built with modern technologies.",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/projects`,
        type: "website",
        locale: "en_US",
        siteName: "Bishnu BK Portfolio",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/coding2.png`,
                width: 1200,
                height: 630,
                alt: "Bishnu BK Projects Portfolio - Web Development Projects",
                type: "image/png",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Projects | Portfolio",
        description: "Explore my portfolio of professional and personal projects featuring modern web technologies.",
        creator: "@bishnubk",
        site: "@bishnubk",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/coding2.png`,
                alt: "Bishnu BK Projects Portfolio",
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
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.bishnubk.com.np"}/projects`,
    },
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
