import { Metadata } from "next";

export const siteConfig = {
    name: "Bishnu BK",
    title: "Bishnu BK - Full Stack Developer & Creative Coder",
    description:
        "Professional portfolio of Bishnu BK - Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. Explore my projects, blog, and technical expertise.",
    url: "https://www.bishnubk.com.np",
    ogImage: "https://www.bishnubk.com.np/og-image.jpg",
    links: {
        github: "https://github.com/bishnuf66",
        linkedin: "https://linkedin.com/in/bishnubk",
    },
    keywords: [
        "Bishnu BK",
        "Full Stack Developer",
        "Web Developer",
        "React Developer",
        "Next.js Developer",
        "Node.js Developer",
        "TypeScript",
        "JavaScript",
        "Portfolio",
        "Software Engineer",
        "Frontend Developer",
        "Backend Developer",
        "MongoDB",
        "PostgreSQL",
        "Tailwind CSS",
        "Three.js",
        "Web Development",
        "Nepal Developer",
    ],
};

export function generateSEO({
    title,
    description,
    image,
    url,
    type = "website",
    keywords,
    noIndex = false,
}: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article";
    keywords?: string[];
    noIndex?: boolean;
}): Metadata {
    const metaTitle = title
        ? `${title} | ${siteConfig.name}`
        : siteConfig.title;
    const metaDescription = description || siteConfig.description;
    const metaImage = image || siteConfig.ogImage;
    const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
    const metaKeywords = keywords
        ? [...siteConfig.keywords, ...keywords]
        : siteConfig.keywords;

    return {
        title: metaTitle,
        description: metaDescription,
        keywords: metaKeywords,
        authors: [{ name: siteConfig.name }],
        creator: siteConfig.name,
        publisher: siteConfig.name,
        metadataBase: new URL(siteConfig.url),
        alternates: {
            canonical: metaUrl,
        },
        openGraph: {
            type,
            locale: "en_US",
            url: metaUrl,
            title: metaTitle,
            description: metaDescription,
            siteName: siteConfig.name,
            images: [
                {
                    url: metaImage,
                    width: 1200,
                    height: 630,
                    alt: metaTitle,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: metaTitle,
            description: metaDescription,
            images: [metaImage],
            creator: "@bishnubk",
        },
        robots: {
            index: !noIndex,
            follow: !noIndex,
            googleBot: {
                index: !noIndex,
                follow: !noIndex,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

// JSON-LD structured data generators
export function generatePersonSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        name: siteConfig.name,
        url: siteConfig.url,
        sameAs: [siteConfig.links.github, siteConfig.links.linkedin],
        jobTitle: "Full Stack Developer",
        description: siteConfig.description,
    };
}

export function generateWebsiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        author: {
            "@type": "Person",
            name: siteConfig.name,
        },
    };
}

export function generateBlogPostSchema({
    title,
    description,
    image,
    datePublished,
    dateModified,
    url,
    author,
}: {
    title: string;
    description: string;
    image?: string;
    datePublished: string;
    dateModified?: string;
    url: string;
    author: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description,
        image: image || siteConfig.ogImage,
        datePublished,
        dateModified: dateModified || datePublished,
        author: {
            "@type": "Person",
            name: author,
        },
        publisher: {
            "@type": "Person",
            name: siteConfig.name,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteConfig.url}${url}`,
        },
    };
}

export function generateProjectSchema({
    name,
    description,
    image,
    url,
    technologies,
}: {
    name: string;
    description: string;
    image?: string;
    url?: string;
    technologies: string[];
}) {
    return {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name,
        description,
        image: image || siteConfig.ogImage,
        url: url || siteConfig.url,
        author: {
            "@type": "Person",
            name: siteConfig.name,
        },
        keywords: technologies.join(", "),
    };
}
