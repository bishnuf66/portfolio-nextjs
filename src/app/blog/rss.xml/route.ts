import { getSupabase } from "@/lib/supabase";
import { Blog } from "@/types/blog";

export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
        "https://www.bishnubk.com.np";

    const supabase = getSupabase();
    const { data: blogs } = await supabase
        .from("blogs")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(20);

    const rssItems = blogs?.map((blog: Blog) => `
    <item>
      <title><![CDATA[${blog.title}]]></title>
      <description><![CDATA[${blog.excerpt || ""}]]></description>
      <link>${baseUrl}/blog/${blog.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${blog.slug}</guid>
      <pubDate>${new Date(blog.created_at).toUTCString()}</pubDate>
      <author>contact@bishnubk.com.np (${blog.author})</author>
      ${blog.tags?.map((tag) => `<category>${tag}</category>`).join("") || ""}
      ${
        blog.cover_image_url
            ? `<enclosure url="${blog.cover_image_url}" type="image/jpeg" />`
            : ""
    }
    </item>
  `).join("") || "";

    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Bishnu BK Blog - Web Development Articles</title>
    <description>Latest articles, tutorials, and insights on web development, React, Next.js, and modern web technologies by Bishnu BK.</description>
    <link>${baseUrl}/blog</link>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-US</language>
    <managingEditor>contact@bishnubk.com.np (Bishnu BK)</managingEditor>
    <webMaster>contact@bishnubk.com.np (Bishnu BK)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <category>Technology</category>
    <category>Web Development</category>
    <category>Programming</category>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/coding2.png</url>
      <title>Bishnu BK Blog</title>
      <link>${baseUrl}/blog</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${rssItems}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control":
                "public, s-maxage=3600, stale-while-revalidate=86400",
        },
    });
}
