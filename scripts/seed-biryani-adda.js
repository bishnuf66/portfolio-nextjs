require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables!');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Project data extracted from https://www.biryaniaddanepal.com/
const project = {
  name: "Biryani Adda",
  slug: "biryani-adda",
  url: "https://www.biryaniaddanepal.com/",
  description: `<p>Biryani Adda is a modern restaurant website for a Nepalese biryani restaurant, featuring an elegant and user-friendly interface for customers to explore the menu, place orders, and learn about the restaurant.</p>

<h3>Key Features</h3>
<ul>
<li><strong>Interactive Menu</strong> - Browse through a variety of biryani dishes with detailed descriptions and pricing</li>
<li><strong>Online Ordering</strong> - Seamless ordering system integrated with Facebook for easy customer engagement</li>
<li><strong>Responsive Design</strong> - Fully responsive layout that works perfectly on all devices</li>
<li><strong>Modern UI/UX</strong> - Clean, contemporary design with smooth animations and transitions</li>
<li><strong>Fast Performance</strong> - Built with Vite for lightning-fast load times and optimal performance</li>
</ul>

<h3>Technical Highlights</h3>
<p>The website is built using modern web technologies including React for the frontend framework, Vite as the build tool for exceptional development experience and fast builds, and Tailwind CSS for utility-first styling. The application features custom fonts including Dancing Script, Miniver, Chillax, Roboto, and Poppins for a unique brand identity.</p>

<p>The site is optimized for performance with Cloudflare CDN integration and includes Facebook integration for social engagement and order management.</p>`,
  tech_stack: [
    "React",
    "Vite",
    "Tailwind CSS",
    "JavaScript",
    "Cloudflare",
    "Facebook Integration",
    "Responsive Design",
  ],
  category: "professional",
  is_featured: true,
  cover_image_url: "", // Add your cover image URL here after upload
  gallery_images: [], // Add your gallery image URLs here after upload
};

async function seedProject() {
  console.log('🌱 Seeding Biryani Adda project...\n');

  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) {
    console.error(`❌ Error seeding project:`, error.message);
    
    // Check if it's a duplicate
    if (error.code === '23505') {
      console.log('\n💡 Project with this slug already exists. Updating instead...');
      
      const { data: updateData, error: updateError } = await supabase
        .from('projects')
        .update(project)
        .eq('slug', project.slug)
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

  console.log('\n✨ Seeding completed!');
}

// Run the seed function
seedProject()
  .then(() => {
    console.log('\n🎉 All done!');
    console.log('\n📸 Next steps:');
    console.log('1. Go to your dashboard');
    console.log('2. Edit the "Biryani Adda" project');
    console.log('3. Upload cover image and gallery images');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding failed:', error);
    process.exit(1);
  });
