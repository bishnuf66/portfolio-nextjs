import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import AnalyticsProvider from "@/components/AnalyticsProvider";
import ConsentManager from "@/components/ConsentManager";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bishnubk.com.np"),
  title: {
    default: "Bishnu BK - Full Stack Developer & Creative Coder",
    template: "%s | Bishnu BK",
  },
  description:
    "Professional portfolio of Bishnu BK - Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies. Explore my projects, blog, and technical expertise.",
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
    "UI/UX Design",
    "API Development",
    "Database Design",
    "Responsive Design",
    "Performance Optimization",
  ],
  authors: [{ name: "Bishnu BK", url: "https://www.bishnubk.com.np" }],
  creator: "Bishnu BK",
  publisher: "Bishnu BK",
  applicationName: "Bishnu BK Portfolio",
  referrer: "origin-when-cross-origin",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Bishnu BK Portfolio",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.bishnubk.com.np",
    title: "Bishnu BK - Full Stack Developer & Creative Coder",
    description:
      "Professional portfolio of Bishnu BK - Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies.",
    siteName: "Bishnu BK Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bishnu BK - Full Stack Developer Portfolio",
        type: "image/jpeg",
      },
      {
        url: "/og-image-square.jpg",
        width: 400,
        height: 400,
        alt: "Bishnu BK - Full Stack Developer",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bishnu BK - Full Stack Developer & Creative Coder",
    description:
      "Professional portfolio of Bishnu BK - Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies.",
    creator: "@bishnubk",
    site: "@bishnubk",
    images: [
      {
        url: "/og-image.jpg",
        alt: "Bishnu BK - Full Stack Developer Portfolio",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  verification: {
    google:
      "google-site-verification=4fLQ3r82bIt2QQeYAGicv9sAG2rTL7zCRzXWBxVS_Og",
    yandex: "verification_token_here",
    yahoo: "verification_token_here",
  },
  alternates: {
    canonical: "https://www.bishnubk.com.np",
    languages: {
      "en-US": "https://www.bishnubk.com.np",
      "x-default": "https://www.bishnubk.com.np",
    },
  },
  category: "technology",
  classification: "Portfolio Website",
  other: {
    "msapplication-TileColor": "#3b82f6",
    "msapplication-config": "/browserconfig.xml",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bishnu BK",
    url: "https://www.bishnubk.com.np",
    jobTitle: "Full Stack Developer",
    description:
      "Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies",
    image: "https://www.bishnubk.com.np/og-image.jpg",
    email: "contact@bishnubk.com.np",
    knowsAbout: [
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "MongoDB",
      "PostgreSQL",
      "Web Development",
      "Full Stack Development",
      "UI/UX Design"
    ],
    sameAs: [
      "https://github.com/bishnuf66",
      "https://linkedin.com/in/bishnubk",
      "https://twitter.com/bishnubk"
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "Nepal"
    },
    worksFor: {
      "@type": "Organization",
      name: "Freelance Developer"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bishnu BK Portfolio",
    url: "https://www.bishnubk.com.np",
    description:
      "Professional portfolio showcasing projects, skills, and experience in web development",
    author: {
      "@type": "Person",
      name: "Bishnu BK",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.bishnubk.com.np/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    mainEntity: {
      "@type": "Person",
      name: "Bishnu BK"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Bishnu BK - Web Development Services",
    url: "https://www.bishnubk.com.np",
    logo: "https://www.bishnubk.com.np/logo.png",
    description: "Professional web development services specializing in modern technologies",
    founder: {
      "@type": "Person",
      name: "Bishnu BK"
    },
    serviceType: "Web Development",
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Full Stack Development"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Frontend Development"
          }
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Backend Development"
          }
        }
      ]
    }
  };

  return (
    <html lang="en" dir="ltr">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        {/* Additional meta tags for better SEO */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Bishnu BK Portfolio" />

        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
        suppressHydrationWarning={true}
      >
        {/* Skip navigation for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg"
        >
          Skip to main content
        </a>

        {/* <SmoothScrollProvider> */}
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <AnalyticsProvider>
                <ScrollProgressBar />
                <Header />
                <main id="main-content" role="main">
                  {children}
                </main>
                <Footer />
                <ConsentManager />
                <CustomCursor />
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar
                  newestOnTop
                  closeButton={false}
                  rtl={false}
                  pauseOnFocusLoss
                  draggable
                  pauseOnHover
                  toastStyle={{
                    backgroundColor: "#333",
                    color: "#fff",
                    borderRadius: "8px",
                    fontSize: "16px",
                    padding: "12px 20px",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    maxWidth: "400px",
                  }}
                />
              </AnalyticsProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
        {/* </SmoothScrollProvider> */}
      </body>
    </html>
  );
}
