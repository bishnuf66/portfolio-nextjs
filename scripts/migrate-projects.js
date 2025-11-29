const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env' })

// Import existing project data (using .js extension for Node.js)
const fs = require('fs')
const path = require('path')

// Read the TypeScript file and extract the project data
const projectsFile = path.join(__dirname, '../src/utils/projects.ts')
const projectsContent = fs.readFileSync(projectsFile, 'utf8')

// Extract the arrays using regex (this is a simple approach)
const professionalProjectsMatch = projectsContent.match(/export const professionalProjects = \[([\s\S]*?)\];/);
const personalProjectsMatch = projectsContent.match(/export const personalProjects = \[([\s\S]*?)\];/);

// Parse the extracted data
function parseProjectData(arrayString) {
  if (!arrayString) return [];
  
  // Remove the export and variable declaration parts
  const cleanString = arrayString.replace(/export const \w+ = /, '').replace(/;$/, '');
  
  // Simple eval approach (be careful in production)
  try {
    // Convert TypeScript object syntax to JavaScript
    const jsString = cleanString
      .replace(/(\w+):/g, '"$1":')  // Convert keys to strings
      .replace(/'/g, '"');           // Convert single quotes to double quotes
    
    return eval(jsString);
  } catch (error) {
    console.error('Error parsing project data:', error);
    return [];
  }
}

// Hardcoded project data as fallback (more reliable approach)
const professionalProjects = [
    {
        name: 'BodyKore',
        url: 'https://www.bodykore.com/',
        description: 'BodyKore is an online business dedicated to selling high-quality gym machines and fitness equipment. Designed for both home and commercial use...',
        techStack: ['React', 'Node.js', 'MongoDB'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'UpStore',
        url: 'https://www.necojobs.com.np/',
        description: 'MSP Academy is a platform designed to connect Creators, who need academic projects completed, with Doers, who complete these projects.',
        techStack: ['Next.js', 'Firebase'],
        image: '/project-images/placeholder.png',
    },
    {   
        name: 'Postaam',
        url: 'https://www.necojobs.com.np/',
        description: 'MSP Academy is a platform designed to connect Creators, who need academic projects completed, with Doers, who complete these projects.',
        techStack: ['React', 'Redux', 'Node.js'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'NecoJobs',
        url: 'https://www.necojobs.com.np/',
        description: 'Necojobs is a job-searching platform designed to connect job seekers with potential employers. Built with React and Next.js...',
        techStack: ['Next.js', 'Express', 'MongoDB'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Website for Uplift Solutions',
        url: 'https://beta.upliftsolutions.com.np/',
        description: 'The Uplift Solutions Website is a professional company website built to showcase the services and offerings of Uplift Solutions...',
        techStack: ['WordPress', 'CSS'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'NTUC',
        url: 'https://ntuc.org.np/',
        description: 'The Nepal Trade Union Membership Management System is a web application designed to streamline the registration and management of trade union members...',
        techStack: ['React', 'Node.js', 'MySQL'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Survey-Egov',
        url: 'https://survey-egov.ictfoundation.org.np/',
        description: 'The Survey Form project is a dynamic and user-friendly web application designed to collect and analyze user responses efficiently...',
        techStack: ['Angular', 'Node.js'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Mishisa',
        url: 'https://mishisa.com/',
        description: 'Mishisa is a cosmetics e-Commerce platform. Your ultimate destination for authentic international beauty...',
        techStack: ['Vue.js', 'Laravel'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Yaphy Fitness',
        url: 'https://yaphyfitness.com/',
        description: 'Yaphy Fitness is a modern e-commerce platform specializing in fitness apparel. Built using Next.js...',
        techStack: ['Next.js', 'Stripe', 'MongoDB'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'MSP ACADEMY',
        url: 'https://mspacademy.co/',
        description: 'MSP Academy is a platform designed to connect Creators, who need academic projects completed, with Doers, who complete these projects.',
        techStack: ['React', 'Firebase'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Shofydrop',
        url: 'https://shofydrop.com/',
        description: 'Multi-Vendor E-Commerce Website.',
        techStack: ['React', 'Node.js', 'MongoDB'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'KAGOSIDA',
        url: 'https://kagosida.org.np/',
        description: 'Website to stay updated with the latest gold and silver rates.',
        techStack: ['PHP', 'MySQL'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Akaunt',
        url: 'https://akauntplus.shreeminfotech.com.np/',
        description: 'Inventory And Financial Management System.',
        techStack: ['Angular', 'Node.js'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'TG-WAY',
        url: 'https://tg-way.tech/',
        description: 'Simple and Elegant static website.',
        techStack: ['HTML', 'CSS'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Smart Everest Fitness',
        url: 'TBA',
        description: 'E-commerce Web app for gym and health supplements.',
        techStack: ['React', 'Node.js', 'MongoDB'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Smart Garbage',
        url: 'TBA',
        description: 'IoT-based waste management solution.',
        techStack: ['React', 'IoT', 'Node.js'],
        image: '/project-images/placeholder.png',
    },
];

const personalProjects = [
    {
        name: 'Meme Generator',
        url: 'https://meme-generator-chi-indol.vercel.app/',
        description: 'Web Application for creating and sharing memes',
        techStack: ['React', 'Node.js'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Event Management System',
        url: 'https://github.com/bishnuf66/event-management-system',
        description: 'System for organizing events',
        techStack: ['React', 'Express'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Recipe Web App',
        url: 'https://github.com/bishnuf66/recipe-web-app',
        description: 'Application for sharing and discovering recipes',
        techStack: ['React', 'Firebase'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Mero Pasal',
        url: 'https://github.com/bishnuf66/meropasal',
        description: 'E-commerce platform for local market',
        techStack: ['React', 'Node.js'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Chat-App',
        url: 'https://github.com/bishnuf66/realtime-chat-app',
        description: 'A realtime chat Application',
        techStack: ['React', 'Socket.io'],
        image: '/project-images/placeholder.png',
    },
    {
        name: 'Puzzle-App',
        url: 'https://github.com/bishnuf66/realtime-chat-app',
        description: 'The Puzzle App is a fun and interactive game built with React and Vite...',
        techStack: ['React', 'Vite'],
        image: '/project-images/placeholder.png',
    },
];

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function migrateProjects() {
  console.log('🚀 Starting project migration to Supabase...')
  
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing projects...')
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all records
    
    if (deleteError) {
      console.error('Error clearing projects:', deleteError)
      return
    }
    
    // Transform and insert professional projects
    console.log('📦 Adding professional projects...')
    const professionalData = professionalProjects.map(project => ({
      name: project.name,
      url: project.url,
      description: project.description,
      tech_stack: project.techStack,
      image_url: project.image,
      category: 'professional'
    }))
    
    const { error: professionalError } = await supabase
      .from('projects')
      .insert(professionalData)
    
    if (professionalError) {
      console.error('Error inserting professional projects:', professionalError)
      return
    }
    
    // Transform and insert personal projects
    console.log('📦 Adding personal projects...')
    const personalData = personalProjects.map(project => ({
      name: project.name,
      url: project.url,
      description: project.description,
      tech_stack: project.techStack,
      image_url: project.image,
      category: 'personal'
    }))
    
    const { error: personalError } = await supabase
      .from('projects')
      .insert(personalData)
    
    if (personalError) {
      console.error('Error inserting personal projects:', personalError)
      return
    }
    
    console.log('✅ Migration completed successfully!')
    console.log(`📊 Migrated ${professionalProjects.length + personalProjects.length} projects`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
  }
}

// Run the migration
migrateProjects()
