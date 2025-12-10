require("dotenv").config({ path: ".env" });
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing required environment variables!");
  console.error(
    "Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// 📝 ADD YOUR PROJECT URLS HERE
// ============================================
// Format: { url: "https://example.com", category: "professional" or "personal", featured: true or false }

const projectUrls = [
  //webx
  {
    url: "https://www.biryaniaddanepal.com/",
    category: "professional",
    featured: true,
  },
  {
    url: "https://allsellerimportexport.com/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://everestdmc.com/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://www.monaldining.com.au/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://mynepaladventures.com/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://nextgeninterior.com",
    category: "professional",
    featured: false,
  },
  {
    url: "https://www.maingatedesigns.com/",
    category: "professional",
    featured: false,
  },

  {
    url: "https://nicerecruitment.org/",
    category: "professional",
    featured: false,
  },

  {
    url: "https://www.pho99nepal.com/",
    category: "professional",
    featured: false,
  },

  {
    url: "https://www.propxperts.com.au/",
    category: "professional",
    featured: false,
  },

  {
    url: "https://realhimalaya.com/",
    category: "professional",
    featured: false,
  },

  {
    url: "https://spicebazaarhk.com/",
    category: "professional",
    featured: false,
  },

  {
    url: "https://tansenholidays.com/",
    category: "professional",
    featured: false,
  },

  //msp solutions
  {
    url: "https://kagosida.org.np/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://shofydrop.com/",
    category: "professional",
    featured: false,
  },

  //uplift solutions

  {
    url: "https://www.nepalicongress.org/",
    category: "professional",
    featured: false,
  },

  {
    url: "https://mishisa.com/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://www.necojobs.com.np/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://ntuc.org.np/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://postaam.com/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://upliftsolutions.com.np/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://yaphyfitness.com/",
    category: "professional",
    featured: false,
  },
  {
    url: "https://www.bodykore.com/",
    category: "professional",
    featured: false,
  },

  // Add more projects below:
  // {
  //   url: "https://your-project-2.com",
  //   category: "professional",
  //   featured: false,
  // },
  // {
  //   url: "https://your-project-3.com",
  //   category: "personal",
  //   featured: true,
  // },
];

// ============================================
// 🔍 ANALYSIS FUNCTIONS
// ============================================

async function fetchWebsite(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error.message);
    return null;
  }
}

function generateSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

function extractTitle(html) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1]
      .trim()
      .replace(/\s*[-|–]\s*.*/g, "") // Remove everything after dash
      .trim();
  }
  return "";
}

function extractDescription(html) {
  // Try meta description
  const metaDesc = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i
  );
  if (metaDesc) return metaDesc[1].trim();

  // Try OG description
  const ogDesc = html.match(
    /<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i
  );
  if (ogDesc) return ogDesc[1].trim();

  return "";
}

function detectTechStack(html) {
  const techStack = [];
  const htmlLower = html.toLowerCase();

  // Frontend Frameworks
  if (/__next_data__|_next\//.test(html)) {
    techStack.push("Next.js", "React");
  } else if (/react/i.test(html) && !techStack.includes("React")) {
    techStack.push("React");
  }

  if (/vue\.js|__vue__|v-if|v-for/i.test(html)) {
    techStack.push("Vue.js");
  }

  if (/ng-version|angular/i.test(html)) {
    techStack.push("Angular");
  }

  if (/svelte/i.test(html)) {
    techStack.push("Svelte");
  }

  // Build Tools
  if (/vite/i.test(html)) {
    techStack.push("Vite");
  }

  if (/webpack/i.test(html)) {
    techStack.push("Webpack");
  }

  // CSS Frameworks
  if (
    /tailwindcss|class="[^"]*\b(flex|grid|bg-|text-|p-|m-|w-|h-)/i.test(html)
  ) {
    techStack.push("Tailwind CSS");
  }

  if (/bootstrap|class="[^"]*\b(container|row|col-|btn-)/i.test(html)) {
    techStack.push("Bootstrap");
  }

  if (/material-ui|mui/i.test(html)) {
    techStack.push("Material-UI");
  }

  // Languages
  if (/typescript|\.ts"|\.tsx"/i.test(html)) {
    techStack.push("TypeScript");
  } else if (!techStack.includes("TypeScript")) {
    techStack.push("JavaScript");
  }

  // Backend/Services
  if (/firebase|__firebase/i.test(html)) {
    techStack.push("Firebase");
  }

  if (/supabase/i.test(html)) {
    techStack.push("Supabase");
  }

  if (/graphql|__apollo_state__/i.test(html)) {
    techStack.push("GraphQL");
  }

  // Animation
  if (/framer-motion/i.test(html)) {
    techStack.push("Framer Motion");
  }

  if (/gsap/i.test(html)) {
    techStack.push("GSAP");
  }

  // Hosting/CDN
  if (/vercel|_vercel/i.test(html)) {
    techStack.push("Vercel");
  }

  if (/cloudflare/i.test(html)) {
    techStack.push("Cloudflare");
  }

  if (/netlify/i.test(html)) {
    techStack.push("Netlify");
  }

  // Other
  if (/stripe|js\.stripe\.com/i.test(html)) {
    techStack.push("Stripe");
  }

  // Always add responsive design if viewport meta exists
  if (/<meta\s+name=["']viewport["']/i.test(html)) {
    techStack.push("Responsive Design");
  }

  return [...new Set(techStack)]; // Remove duplicates
}

function generateDescription(name, basicDesc, techStack) {
  const techList = techStack.slice(0, 5).join(", ");

  let description = `<p>${name} is a modern web application`;

  if (basicDesc) {
    description += ` that ${basicDesc.toLowerCase()}`;
  }

  description += `.</p>

<h3>Key Features</h3>
<ul>
<li><strong>Modern Design</strong> - Clean and contemporary user interface</li>
<li><strong>Responsive Layout</strong> - Works seamlessly across all devices</li>
<li><strong>Fast Performance</strong> - Optimized for speed and efficiency</li>
<li><strong>User-Friendly</strong> - Intuitive navigation and smooth user experience</li>
</ul>

<h3>Technical Stack</h3>
<p>Built with modern web technologies including ${techList}. The application features a robust architecture designed for scalability and maintainability.</p>`;

  return description;
}

async function analyzeProject(url, category, featured) {
  console.log(`\n🔍 Analyzing: ${url}`);

  const html = await fetchWebsite(url);
  if (!html) {
    console.log(`⚠️  Skipping - could not fetch website`);
    return null;
  }

  const name =
    extractTitle(html) ||
    new URL(url).hostname.replace("www.", "").split(".")[0];
  const basicDesc = extractDescription(html);
  const techStack = detectTechStack(html);
  const description = generateDescription(name, basicDesc, techStack);

  console.log(`✅ Found: ${name}`);
  console.log(`📦 Tech Stack: ${techStack.join(", ")}`);

  return {
    name,
    slug: generateSlug(name),
    url,
    description,
    tech_stack: techStack,
    category,
    is_featured: featured,
    cover_image_url: "",
    gallery_images: [],
  };
}

// ============================================
// 🌱 SEEDING FUNCTION
// ============================================

async function seedProjects() {
  console.log("🌱 Starting batch project seeding...\n");
  console.log(`📊 Total projects to analyze: ${projectUrls.length}\n`);

  const results = {
    success: [],
    failed: [],
    skipped: [],
  };

  for (let i = 0; i < projectUrls.length; i++) {
    const { url, category, featured } = projectUrls[i];
    console.log(`\n[${i + 1}/${projectUrls.length}] Processing...`);

    try {
      const project = await analyzeProject(url, category, featured);

      if (!project) {
        results.skipped.push(url);
        continue;
      }

      // Try to insert
      const { data, error } = await supabase
        .from("projects")
        .insert(project)
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          // Duplicate - try update
          console.log(`💡 Project exists, updating...`);
          const { data: updateData, error: updateError } = await supabase
            .from("projects")
            .update(project)
            .eq("slug", project.slug)
            .select()
            .single();

          if (updateError) {
            console.error(`❌ Update failed: ${updateError.message}`);
            results.failed.push({ url, error: updateError.message });
          } else {
            console.log(`✅ Updated: ${project.name}`);
            results.success.push(project.name);
          }
        } else {
          console.error(`❌ Insert failed: ${error.message}`);
          results.failed.push({ url, error: error.message });
        }
      } else {
        console.log(`✅ Created: ${project.name}`);
        results.success.push(project.name);
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`❌ Error processing ${url}:`, error.message);
      results.failed.push({ url, error: error.message });
    }
  }

  // Print summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 SEEDING SUMMARY");
  console.log("=".repeat(60));
  console.log(`✅ Successfully seeded: ${results.success.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⚠️  Skipped: ${results.skipped.length}`);

  if (results.success.length > 0) {
    console.log("\n✅ Successful projects:");
    results.success.forEach((name) => console.log(`   - ${name}`));
  }

  if (results.failed.length > 0) {
    console.log("\n❌ Failed projects:");
    results.failed.forEach(({ url, error }) =>
      console.log(`   - ${url}: ${error}`)
    );
  }

  if (results.skipped.length > 0) {
    console.log("\n⚠️  Skipped projects:");
    results.skipped.forEach((url) => console.log(`   - ${url}`));
  }

  console.log("\n" + "=".repeat(60));
  console.log("\n📸 Next Steps:");
  console.log("1. Go to your dashboard at /dashboard");
  console.log("2. Edit each project to add cover images and gallery images");
  console.log("3. Review and adjust descriptions if needed");
  console.log("\n✨ Done!");
}

// Run the seeding
seedProjects()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Fatal error:", error);
    process.exit(1);
  });
