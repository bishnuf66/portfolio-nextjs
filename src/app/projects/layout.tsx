import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Projects | Portfolio",
    description: "Explore my portfolio of professional and personal projects. Featuring web applications, full-stack solutions, and innovative projects built with modern technologies.",
    keywords: "projects, portfolio, web development, full-stack, React, Next.js, JavaScript, TypeScript",
    openGraph: {
        title: "Projects | Portfolio",
        description: "Explore my portfolio of professional and personal projects. Featuring web applications, full-stack solutions, and innovative projects built with modern technologies.",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com"}/projects`,
        type: "website",
        images: [
            {
                url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://yoursite.com"}/coding2.png`,
                width: 1200,
                height: 630,
                alt: "Projects",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Projects | Portfolio",
        description: "Explore my portfolio of professional and personal projects.",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },
};

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
