"use client";

import React from "react";

interface SEOContentProps {
  page?: "home" | "projects" | "blog" | "services" | "contact";
}

export default function SEOContent({ page = "home" }: SEOContentProps) {
  const seoContent = {
    home: {
      title:
        "Top Fullstack Developer Nepal - Bishnu BK | React & Next.js Expert",
      keywords: [
        "Top Fullstack Developer Nepal",
        "Best Frontend Developer Nepal",
        "Expert Backend Developer Nepal",
        "React Developer Nepal",
        "Next.js Developer Nepal",
        "Node.js Developer Nepal",
        "MERN Stack Developer Nepal",
        "TypeScript Developer Nepal",
        "JavaScript Developer Nepal",
        "Web Developer Kathmandu",
        "Professional Developer Nepal",
        "Freelance Developer Nepal",
        "Modern Web Development Nepal",
        "Custom Web Solutions Nepal",
        "E-commerce Developer Nepal",
        "API Development Nepal",
        "Database Design Nepal",
        "UI/UX Developer Nepal",
        "Responsive Design Nepal",
        "MongoDB Developer Nepal",
        "PostgreSQL Developer Nepal",
        "Tailwind CSS Developer Nepal",
        "Three.js Developer Nepal",
        "Software Engineer Nepal",
        "Top Programmer Nepal",
        "Best Coder Nepal",
        "Web Application Developer Nepal",
        "Portfolio Website Developer Nepal",
        "Nepal IT Professional",
        "Tech Expert Nepal",
        "Kathmandu Web Developer",
        "Nepal Software Development",
        "Full Stack Development Services Nepal",
      ],
      description:
        "Bishnu BK is Nepal's top fullstack developer specializing in React, Next.js, Node.js, and modern web technologies. Best frontend and backend developer in Kathmandu, Nepal offering professional web development services.",
    },
    projects: {
      title: "Projects by Top Fullstack Developer Nepal - Bishnu BK",
      keywords: [
        "Web Development Projects Nepal",
        "React Projects Nepal",
        "Next.js Projects Nepal",
        "MERN Stack Projects Nepal",
        "Portfolio Projects Nepal",
        "E-commerce Development Nepal",
        "Custom Web Applications Nepal",
      ],
      description:
        "Explore innovative web development projects by Nepal's leading fullstack developer. Modern React, Next.js, and Node.js applications built in Kathmandu, Nepal.",
    },
    blog: {
      title: "Web Development Blog - Top Developer Nepal | Bishnu BK",
      keywords: [
        "Web Development Blog Nepal",
        "React Tutorials Nepal",
        "Next.js Guide Nepal",
        "JavaScript Tips Nepal",
        "Programming Blog Nepal",
        "Tech Articles Nepal",
      ],
      description:
        "Expert web development insights and tutorials from Nepal's top fullstack developer. Learn React, Next.js, Node.js, and modern web technologies.",
    },
    services: {
      title:
        "Web Development Services Nepal - Bishnu BK | Full Stack & Next.js",
      keywords: [
        "Web Development Services Nepal",
        "Full Stack Development Nepal",
        "Frontend Development Nepal",
        "Backend Development Nepal",
        "React Next.js Developer Nepal",
        "MERN Stack Developer Nepal",
        "API Development Nepal",
        "Database Design Nepal",
        "UI UX Design Nepal",
        "Performance Optimization Nepal",
        "Technical SEO Nepal",
      ],
      description:
        "Professional web development services by Bishnu BK. Full stack apps, modern frontend with React/Next.js, backend APIs, UI/UX, and performance optimization.",
    },
    contact: {
      title: "Hire Top Fullstack Developer Nepal - Contact Bishnu BK",
      keywords: [
        "Hire Fullstack Developer Nepal",
        "Web Development Services Nepal",
        "Freelance Developer Nepal",
        "React Developer for Hire Nepal",
        "Next.js Developer Services Nepal",
        "Custom Web Development Nepal",
      ],
      description:
        "Contact Nepal's top fullstack developer for professional web development services. Expert in React, Next.js, Node.js. Based in Kathmandu, Nepal.",
    },
  };

  const currentContent = seoContent[page];

  return (
    <>
      {/* Hidden SEO Content - Not visible to users but crawled by search engines */}
      <div className="sr-only" aria-hidden="true">
        <h1>{currentContent.title}</h1>
        <p>{currentContent.description}</p>

        {/* Keywords as hidden content */}
        <div>
          {currentContent.keywords.map((keyword, index) => (
            <span key={index}>
              {keyword}
              {index < currentContent.keywords.length - 1 ? ", " : ""}
            </span>
          ))}
        </div>

        {/* Additional SEO-rich content */}
        {page === "home" && (
          <div>
            <h2>Professional Web Development Services in Nepal</h2>
            <p>
              Bishnu BK is recognized as the top fullstack developer in Nepal,
              providing exceptional web development services in Kathmandu and
              throughout Nepal. Specializing in modern technologies including
              React.js, Next.js, Node.js, TypeScript, MongoDB, and PostgreSQL.
            </p>

            <h3>Why Choose Nepal&apos;s Best Fullstack Developer?</h3>
            <ul>
              <li>Expert in React and Next.js development</li>
              <li>Professional Node.js backend development</li>
              <li>Modern TypeScript and JavaScript solutions</li>
              <li>Database design with MongoDB and PostgreSQL</li>
              <li>Responsive UI/UX design</li>
              <li>API development and integration</li>
              <li>E-commerce and custom web applications</li>
              <li>Based in Kathmandu, serving all of Nepal</li>
            </ul>

            <h3>Technologies Expertise</h3>
            <p>
              As Nepal&apos;s leading fullstack developer, Bishnu BK has
              extensive experience with the MERN stack (MongoDB, Express.js,
              React, Node.js), Next.js for server-side rendering, TypeScript for
              type-safe development, and modern CSS frameworks like Tailwind
              CSS. Also skilled in Three.js for 3D web experiences and various
              database technologies.
            </p>

            <h3>Serving Nepal and Beyond</h3>
            <p>
              Based in Kathmandu, Nepal, providing top-quality web development
              services to clients across Nepal and internationally. Known for
              delivering modern, scalable, and performance-optimized web
              solutions.
            </p>
          </div>
        )}
      </div>

      {/* Structured Data for Local Business */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Bishnu BK - Top Fullstack Developer Nepal",
            description: currentContent.description,
            url: "https://www.bishnubk.com.np",
            telephone: "+977-XXXXXXXXX",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Kathmandu",
              addressCountry: "Nepal",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: "27.7172",
              longitude: "85.3240",
            },
            openingHours: "Mo-Fr 09:00-18:00",
            priceRange: "$$",
            serviceArea: {
              "@type": "Country",
              name: "Nepal",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Web Development Services Nepal",
              itemListElement: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Fullstack Development Nepal",
                    description:
                      "Complete fullstack web development services using React, Next.js, Node.js",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Frontend Development Nepal",
                    description:
                      "Modern frontend development with React, Next.js, TypeScript",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Backend Development Nepal",
                    description:
                      "Robust backend development with Node.js, MongoDB, PostgreSQL",
                  },
                },
              ],
            },
          }),
        }}
      />
    </>
  );
}
