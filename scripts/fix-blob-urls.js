// Script to fix any projects that have blob URLs in the database
// Run this with: node scripts/fix-blob-urls.js

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixBlobUrls() {
  try {
    // Fetch all projects
    const { data: projects, error } = await supabase
      .from("projects")
      .select("*");

    if (error) {
      console.error("Error fetching projects:", error);
      return;
    }

    console.log(`Found ${projects.length} projects`);

    let fixedCount = 0;

    for (const project of projects) {
      let needsUpdate = false;
      const updates = {};

      // Check image_url
      if (project.image_url && project.image_url.startsWith("blob:")) {
        console.log(`Project "${project.name}" has blob URL in image_url`);
        updates.image_url = "";
        needsUpdate = true;
      }

      // Check cover_image_url
      if (
        project.cover_image_url &&
        project.cover_image_url.startsWith("blob:")
      ) {
        console.log(
          `Project "${project.name}" has blob URL in cover_image_url`
        );
        updates.cover_image_url = "";
        needsUpdate = true;
      }

      // Check gallery_images
      if (project.gallery_images && Array.isArray(project.gallery_images)) {
        const cleanedGallery = project.gallery_images.filter(
          (url) => !url.startsWith("blob:")
        );
        if (cleanedGallery.length !== project.gallery_images.length) {
          console.log(
            `Project "${project.name}" has blob URLs in gallery_images`
          );
          updates.gallery_images = cleanedGallery;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from("projects")
          .update(updates)
          .eq("id", project.id);

        if (updateError) {
          console.error(
            `Error updating project "${project.name}":`,
            updateError
          );
        } else {
          console.log(`✓ Fixed project "${project.name}"`);
          fixedCount++;
        }
      }
    }

    console.log(`\nFixed ${fixedCount} projects`);
  } catch (error) {
    console.error("Error:", error);
  }
}

fixBlobUrls();
