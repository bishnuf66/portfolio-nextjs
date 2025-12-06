import Head from "next/head";

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
}

export default function SEO({
    title = "Bishnu BK - Full Stack Developer & Creative Coder",
    description = "Professional portfolio of Bishnu BK - Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies.",
    image = "/og-image.jpg",
    url = "https://www.bishnubk.com.np",
    type = "website",
    publishedTime,
    modifiedTime,
    author = "Bishnu BK",
    tags = [],
}: SEOProps) {
    const fullUrl = url.startsWith("http") ? url : `https://www.bishnubk.com.np${url}`;
    const fullImage = image.startsWith("http") ? image : `https://www.bishnubk.com.np${image}`;

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:site_name" content="Bishnu BK Portfolio" />

            {/* Article specific */}
            {type === "article" && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {type === "article" && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}
            {type === "article" && author && (
                <meta property="article:author" content={author} />
            )}
            {type === "article" &&
                tags.map((tag) => <meta key={tag} property="article:tag" content={tag} />)}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />
            <meta name="twitter:creator" content="@bishnubk" />

            {/* Additional SEO */}
            <meta name="author" content={author} />
            {tags.length > 0 && <meta name="keywords" content={tags.join(", ")} />}
        </Head>
    );
}
