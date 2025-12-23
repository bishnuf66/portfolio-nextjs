"use client";

import { useEffect } from "react";
import Script from "next/script";

export default function AdSense() {
  return (
    <>
      {/* AdSense Verification Meta Tag */}
      <meta name="google-adsense-account" content="ca-pub-1402448521593358" />

      {/* AdSense Script */}
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        crossOrigin="anonymous"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1402448521593358"
      />
    </>
  );
}
