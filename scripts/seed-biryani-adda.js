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

// Project data extracted from https://epeakexpedition.com/
const project = {
  name: "Epeak Expedition",
  slug: "epeak-expedition",
  url: "https://epeakexpedition.com/",
  description: `<p>Epeak Expedition is a premier mountaineering and trekking company based in Nepal, specializing in providing exceptional high-altitude adventure experiences in the majestic Himalayas. The company offers comprehensive expedition services for both novice trekkers and experienced mountaineers.</p>

<h3>Key Services</h3>
<ul>
<li><strong>Peak Climbing Expeditions</strong> - Professional guided climbs to iconic Himalayan peaks with expert safety protocols</li>
<li><strong>Trekking Adventures</strong> - Customizable trekking packages from beginner-friendly routes to challenging high-altitude treks</li>
<li><strong>Mountaineering Training</strong> - Comprehensive preparation and skill-building programs for aspiring climbers</li>
<li><strong>Adventure Activities</strong> - Paragliding, jungle safaris, white-water rafting, and cultural tours</li>
<li><strong>Permit Management</strong> - Complete handling of TIMS, National Park permits, and climbing permits</li>
</ul>

<h3>Popular Destinations</h3>
<p>The company organizes expeditions to world-renowned destinations including Everest Base Camp, Annapurna Base Camp, Ghorepani Poon Hill, Langtang Valley, and various climbing peaks. They specialize in both spring (March-May) and autumn (September-November) seasons when weather conditions are optimal for safe climbing.</p>

<h3>Safety & Expertise</h3>
<p>Epeak Expedition prioritizes safety with trained guides certified in first aid and altitude sickness response, emergency evacuation protocols, continuous weather monitoring, and proper acclimatization support. Their experienced team provides detailed packing lists, equipment guidance, and 24/7 support throughout expeditions.</p>

<p>The company offers fully customizable packages tailored to individual fitness levels, experience, and timeline preferences, making Himalayan adventures accessible to adventurers of all skill levels.</p>`,
  tech_stack: [
    "Web Development",
    "Responsive Design",
    "SEO Optimization",
    "Content Management",
    "Booking System",
    "Mobile Optimization",
    "Performance Optimization",
  ],
  category: "professional",
  is_featured: true,
  cover_image_url: "", // Add your cover image URL here after upload
  gallery_images: [], // Add your gallery image URLs here after upload
};

async function seedProject() {
  console.log("🏔️ Seeding Epeak Expedition project...\n");

  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) {
    console.error(`❌ Error seeding project:`, error.message);

    // Check if it's a duplicate
    if (error.code === "23505") {
      console.log(
        "\n💡 Project with this slug already exists. Updating instead..."
      );

      const { data: updateData, error: updateError } = await supabase
        .from("projects")
        .update(project)
        .eq("slug", project.slug)
        .select()
        .single();

      if (updateError) {
        console.error(`❌ Error updating project:`, updateError.message);
      } else {
        console.log(`✅ Updated project: ${project.name}`);
        console.log(`\n📝 Project ID: ${updateData.id}`);
        console.log(`🔗 URL: ${project.url}`);
        console.log(`\n⚠️  Remember to add cover image and gallery images!`);
      }
    }
  } else {
    console.log(`✅ Seeded project: ${project.name}`);
    console.log(`\n📝 Project ID: ${data.id}`);
    console.log(`🔗 URL: ${project.url}`);
    console.log(`\n⚠️  Remember to add cover image and gallery images!`);
  }

  console.log("\n✨ Seeding completed!");
}

// Run the seed function
seedProject()
  .then(() => {
    console.log("\n🎉 All done!");
    console.log("\n📸 Next steps:");
    console.log("1. Go to your dashboard");
    console.log('2. Edit the "Epeak Expedition" project');
    console.log("3. Upload cover image and gallery images");
    console.log(
      "4. Consider adding images of Himalayan peaks, trekking groups, and expedition activities"
    );
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Seeding failed:", error);
    process.exit(1);
  });
