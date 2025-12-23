"use client";

import { CSSProperties } from "react";
import Script from "next/script";

type AdSize = "rectangle" | "banner" | "large_rectangle" | "in_article";

interface BlogAdProps {
  slot: string;
  size?: AdSize;
  className?: string;
}

interface AdFormat {
  style: CSSProperties;
  format: string;
  layout?: string;
  fullWidthResponsive: boolean;
}

export default function BlogAd({
  slot,
  size = "rectangle",
  className = "",
}: BlogAdProps) {
  // Map size to AdSense ad formats
  const adFormats: Record<AdSize, AdFormat> = {
    rectangle: {
      style: { display: "block" },
      format: "auto",
      layout: "display",
      fullWidthResponsive: true,
    },
    banner: {
      style: { display: "block" },
      format: "auto",
      layout: "display",
      fullWidthResponsive: true,
    },
    large_rectangle: {
      style: { display: "block" },
      format: "auto",
      layout: "display",
      fullWidthResponsive: true,
    },
    in_article: {
      style: {
        display: "block",
        textAlign: "center" as const, // Type assertion for textAlign
        width: "100%",
        height: "100%",
      },
      format: "fluid",
      layout: "in-article",
      fullWidthResponsive: true,
    },
  };

  const adConfig = adFormats[size] || adFormats.rectangle;

  return (
    <div
      className={`my-8 flex justify-center ${className}`}
      style={{ minHeight: size === "in_article" ? "280px" : "250px" }}
    >
      <ins
        className="adsbygoogle"
        style={adConfig.style}
        data-ad-client="ca-pub-1402448521593358"
        data-ad-slot={slot}
        data-ad-format={adConfig.format}
        data-full-width-responsive={adConfig.fullWidthResponsive}
      ></ins>
      <Script
        id={`adsbygoogle-${slot}`}
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (adsbygoogle = window.adsbygoogle || []).push({});
          `,
        }}
      />
    </div>
  );
}
