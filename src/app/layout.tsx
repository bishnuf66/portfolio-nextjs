import type { Metadata } from "next";
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
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import SimpleCursor from "@/components/SimpleCursor";
import CursorToggle from "@/components/CursorToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
  ],
  authors: [{ name: "Bishnu BK", url: "https://www.bishnubk.com.np" }],
  creator: "Bishnu BK",
  publisher: "Bishnu BK",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
        alt: "Bishnu BK - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bishnu BK - Full Stack Developer & Creative Coder",
    description:
      "Professional portfolio of Bishnu BK - Full Stack Developer specializing in React, Next.js, Node.js, and modern web technologies.",
    creator: "@bishnubk",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google:
      "google-site-verification=4fLQ3r82bIt2QQeYAGicv9sAG2rTL7zCRzXWBxVS_Og",
  },
  alternates: {
    canonical: "https://www.bishnubk.com.np",
  },
  category: "technology",
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
    sameAs: [
      "https://github.com/bishnuf66",
      "https://linkedin.com/in/bishnubk",
    ],
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
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SmoothScrollProvider>
          <QueryProvider>
            <AuthProvider>
              <ThemeProvider>
                <AnalyticsProvider>
                  <Header />
                  {children}
                  <Footer />
                  <ConsentManager />
                  <SimpleCursor />
                  <CursorToggle />
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
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
