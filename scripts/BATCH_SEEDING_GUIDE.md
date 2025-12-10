# 🚀 Batch Project Seeding Guide

This guide will help you seed multiple projects at once by analyzing their URLs.

## 📝 How to Use

### Step 1: Add Your Project URLs

Open `scripts/seed-multiple-projects.js` and find this section:

```javascript
const projectUrls = [
  {
    url: "https://www.biryaniaddanepal.com/",
    category: "professional",
    featured: true,
  },
  // Add more projects below:
  {
    url: "https://your-project-2.com",
    category: "professional",
    featured: false,
  },
  {
    url: "https://your-project-3.com",
    category: "personal",
    featured: true,
  },
];
```

### Step 2: Configure Each Project

For each project, specify:

- **url** (required) - The live URL of your project
- **category** (required) - Either `"professional"` or `"personal"`
- **featured** (required) - `true` or `false` (featured projects show on homepage)

### Step 3: Run the Script

```bash
npm run seed:projects
```

The script will:
1. ✅ Fetch each website
2. 🔍 Analyze the HTML
3. 🤖 Detect tech stack automatically
4. 📝 Generate descriptions
5. 💾 Save to database
6. 📊 Show a summary report

## 🔍 What Gets Detected

### Frameworks & Libraries
- React, Next.js, Vue.js, Angular, Svelte
- Redux, Zustand (state management)
- Framer Motion, GSAP (animations)

### Build Tools
- Vite, Webpack, Turbopack

### Styling
- Tailwind CSS, Bootstrap, Material-UI, Chakra UI

### Languages
- TypeScript, JavaScript

### Backend & Services
- Firebase, Supabase, GraphQL
- Stripe (payments)

### Hosting & CDN
- Vercel, Netlify, Cloudflare

### Other
- Responsive Design (auto-detected from viewport meta)

## 📊 Example Output

```
🌱 Starting batch project seeding...

📊 Total projects to analyze: 3

[1/3] Processing...
🔍 Analyzing: https://www.biryaniaddanepal.com/
✅ Found: Biryani Adda
📦 Tech Stack: React, Vite, Tailwind CSS, JavaScript, Cloudflare
✅ Created: Biryani Adda

[2/3] Processing...
🔍 Analyzing: https://your-project-2.com/
✅ Found: Your Project 2
📦 Tech Stack: Next.js, React, TypeScript, Vercel
✅ Created: Your Project 2

[3/3] Processing...
🔍 Analyzing: https://your-project-3.com/
✅ Found: Your Project 3
📦 Tech Stack: Vue.js, Vite, Tailwind CSS
✅ Created: Your Project 3

============================================================
📊 SEEDING SUMMARY
============================================================
✅ Successfully seeded: 3
❌ Failed: 0
⚠️  Skipped: 0

✅ Successful projects:
   - Biryani Adda
   - Your Project 2
   - Your Project 3

============================================================

📸 Next Steps:
1. Go to your dashboard at /dashboard
2. Edit each project to add cover images and gallery images
3. Review and adjust descriptions if needed

✨ Done!
```

## 🎯 Tips for Best Results

### 1. Use Live URLs
Make sure the URLs are:
- ✅ Live and accessible
- ✅ Not behind authentication
- ✅ Not localhost URLs

### 2. Check Your Projects
After seeding:
- Review the generated descriptions
- Add cover images and gallery images
- Adjust tech stack if needed
- Update descriptions to be more specific

### 3. Re-running the Script
If you run the script again:
- Existing projects will be **updated** (not duplicated)
- Your uploaded images will be preserved
- You can safely re-run to update descriptions

## 🔧 Customization

### Modify Tech Detection

Edit the `detectTechStack()` function to add more technologies:

```javascript
if (/your-framework/i.test(html)) {
  techStack.push('Your Framework');
}
```

### Customize Descriptions

Edit the `generateDescription()` function to change the format:

```javascript
function generateDescription(name, basicDesc, techStack) {
  // Your custom description logic here
  return description;
}
```

## 🚨 Troubleshooting

### "Failed to fetch" Error
- Check if the URL is accessible
- Some sites block automated requests
- Try accessing the URL in your browser first

### "Could not detect technologies"
- The script will still create the project
- Add tech stack manually in the dashboard
- Or update the detection patterns in the script

### Duplicate Slug Error
- The script automatically updates existing projects
- If you want a new project, change the name/URL

## 📋 Example: Adding 20 Projects

```javascript
const projectUrls = [
  { url: "https://project1.com", category: "professional", featured: true },
  { url: "https://project2.com", category: "professional", featured: true },
  { url: "https://project3.com", category: "professional", featured: false },
  { url: "https://project4.com", category: "personal", featured: false },
  { url: "https://project5.com", category: "professional", featured: false },
  { url: "https://project6.com", category: "professional", featured: true },
  { url: "https://project7.com", category: "personal", featured: false },
  { url: "https://project8.com", category: "professional", featured: false },
  { url: "https://project9.com", category: "professional", featured: false },
  { url: "https://project10.com", category: "personal", featured: true },
  { url: "https://project11.com", category: "professional", featured: false },
  { url: "https://project12.com", category: "professional", featured: false },
  { url: "https://project13.com", category: "personal", featured: false },
  { url: "https://project14.com", category: "professional", featured: true },
  { url: "https://project15.com", category: "professional", featured: false },
  { url: "https://project16.com", category: "personal", featured: false },
  { url: "https://project17.com", category: "professional", featured: false },
  { url: "https://project18.com", category: "professional", featured: false },
  { url: "https://project19.com", category: "personal", featured: true },
  { url: "https://project20.com", category: "professional", featured: false },
];
```

Then run: `npm run seed:projects`

## ⏱️ Processing Time

- Each project takes ~2-3 seconds to analyze
- 20 projects = ~1 minute total
- The script includes delays to avoid rate limiting

## 🎉 After Seeding

1. **Go to Dashboard** - `/dashboard`
2. **Review Projects** - Check names and descriptions
3. **Add Images** - Upload cover and gallery images
4. **Publish** - Your projects are now live!

## 💡 Pro Tips

- Start with 3-5 projects to test
- Review the results before adding more
- Keep your project URLs in a text file for reference
- Take screenshots of your projects for gallery images
- Use high-quality cover images (recommended: 1200x630px)

---

**Need help?** Check the console output for detailed error messages and suggestions.
