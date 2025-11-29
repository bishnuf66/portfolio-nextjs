import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import { AuthProvider } from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Bishnu bk",
  description:
    "Professional portfolio showcasing my projects, skills, and experience in web development",
  keywords: [
    "portfolio",
    "web developer",
    "projects",
    "software engineer",
    "next.js",
    "react",
    "nodejs",
    "express",
    "mongodb",
    "tailwindcss",
    "typescript",
    "nextjs",
  ],
  authors: [{ name: "Bishnu bk" }],
  creator: "Bishnu bk",
  publisher: "Bishnu bk",
  openGraph: {
    title: "Portfolio | Bishnu bk",
    description:
      "Professional portfolio showcasing my projects, skills, and experience in web development",
    type: "website",
    locale: "en_US",
    siteName: "Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio | Bishnu bk",
    description:
      "Professional portfolio showcasing my projects, skills, and experience in web development",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              <Header />
              {children}
              <Footer />
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
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
