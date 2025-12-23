// Chatbot knowledge base data
import { QAData, SuggestedQuestion } from "@/types/chatbot";

export const qaData: QAData = {
    // Basic Info
    "who are you": {
        answer:
            "I'm Bishnu BK, a Top Fullstack Developer from Nepal specializing in React, Next.js, Node.js, and modern web technologies.",
        keywords: ["introduction", "name", "who", "identity"],
        category: "personal",
        followUp: [
            "What are your skills?",
            "Where are you from?",
            "How can I contact you?",
        ],
    },

    "what is your name": {
        answer:
            "My name is Bishnu BK. I'm a professional Full Stack Developer based in Kathmandu, Nepal.",
        keywords: ["name", "called", "full name"],
        category: "personal",
        followUp: ["Who are you?", "Where are you from?"],
    },

    "where are you from": {
        answer:
            "I'm from Kathmandu, Nepal. I provide web development services throughout Nepal and internationally.",
        keywords: ["location", "based", "live", "country", "city"],
        category: "personal",
        followUp: ["Do you work remotely?", "What services do you offer?"],
    },

    // Skills & Expertise
    "what are your skills": {
        answer:
            "I specialize in JavaScript, TypeScript, React, Next.js, Node.js, MongoDB, PostgreSQL, and modern web technologies. I'm experienced in both frontend and backend development.",
        keywords: [
            "skills",
            "expertise",
            "proficient",
            "knowledge",
            "tech stack",
        ],
        category: "skills",
        followUp: [
            "What technologies do you use?",
            "Are you a frontend or backend developer?",
            "What kind of projects do you work on?",
        ],
    },

    "what technologies do you use": {
        answer:
            "I work with React, Next.js, Node.js, TypeScript, MongoDB, PostgreSQL, Tailwind CSS, Three.js, and many other modern web technologies.",
        keywords: ["technologies", "tools", "stack", "framework", "libraries"],
        category: "skills",
        followUp: ["What are your skills?", "What's your experience level?"],
    },

    "are you a frontend or backend developer": {
        answer:
            "I'm a Full Stack Developer, which means I handle both frontend (what users see) and backend (server-side) development.",
        keywords: ["frontend", "backend", "full stack", "both"],
        category: "skills",
        followUp: [
            "What are your frontend skills?",
            "What backend technologies do you know?",
        ],
    },

    // Experience
    "how experienced are you": {
        answer:
            "I'm a professional Full Stack Developer with extensive experience in building modern web applications and providing development services in Nepal.",
        keywords: ["experience", "years", "professional", "expert", "level"],
        category: "experience",
        followUp: [
            "What kind of projects do you work on?",
            "Can I see your portfolio?",
        ],
    },

    "what kind of projects do you work on": {
        answer:
            "I work on various web development projects including e-commerce sites, portfolio websites, web applications, APIs, and custom web solutions.",
        keywords: ["projects", "portfolio", "work", "build", "create"],
        category: "experience",
        followUp: ["What's your tech stack?", "Do you have examples?"],
    },

    // Services
    "what services do you offer": {
        answer:
            "I offer Full Stack Development, Frontend Development, Backend Development, MERN Stack Development, UI/UX Design, API Development, and Database Design services.",
        keywords: ["services", "offer", "provide", "do", "work"],
        category: "services",
        followUp: [
            "How can I contact you?",
            "What are your rates?",
            "What's your availability?",
        ],
    },

    "do you freelance": {
        answer:
            "Yes, I provide freelance web development services. You can contact me through my portfolio to discuss your project requirements.",
        keywords: ["freelance", "contract", "available", "hire", "work"],
        category: "services",
        followUp: ["What services do you offer?", "How can I contact you?"],
    },

    // Contact
    "how can i contact you": {
        answer:
            "You can contact me via email at bishowkarmabishnu@gmail.com or through the contact form on my portfolio website.",
        keywords: [
            "contact",
            "reach",
            "email",
            "phone",
            "connect",
            "get in touch",
        ],
        category: "contact",
        followUp: [
            "What's your email?",
            "Where are you located?",
            "What's your availability?",
        ],
    },

    "what is your email": {
        answer: "My email address is bishowkarmabishnu@gmail.com",
        keywords: ["email", "address", "mail"],
        category: "contact",
        followUp: ["How can I contact you?", "Do you have a phone number?"],
    },

    // Location
    "where do you work": {
        answer:
            "I'm based in Kathmandu, Nepal, and work with clients both locally and internationally.",
        keywords: ["work", "office", "based", "remote", "location"],
        category: "personal",
        followUp: ["Do you work remotely?", "What timezone are you in?"],
    },

    // Education/Background
    "what is your background": {
        answer:
            "I'm a professional web developer with expertise in modern web technologies and a focus on creating high-quality, responsive web applications.",
        keywords: ["background", "education", "qualification", "degree"],
        category: "personal",
        followUp: ["What are your skills?", "How experienced are you?"],
    },

    // Pricing
    "what are your rates": {
        answer:
            "My rates vary based on project complexity and requirements. Please contact me with your project details for a custom quote.",
        keywords: ["rates", "pricing", "cost", "price", "how much", "charge"],
        category: "services",
        followUp: ["What services do you offer?", "How can I contact you?"],
    },

    // Availability
    "are you available": {
        answer:
            "My availability depends on current projects. Please contact me to discuss timelines and availability for your project.",
        keywords: ["available", "free", "busy", "timeline", "schedule"],
        category: "services",
        followUp: ["How can I contact you?", "What are your rates?"],
    },

    // Greetings
    hello: {
        answer:
            "Hello! I'm Bishnu BK's virtual assistant. How can I help you learn more about Bishnu and his work?",
        keywords: ["hello", "hi", "hey", "greetings"],
        category: "greeting",
        followUp: [
            "Who are you?",
            "What services do you offer?",
        ],
    },

    hi: {
        answer:
            "Hi there! I'm here to answer questions about Bishnu BK. What would you like to know?",
        keywords: ["hi", "hello", "hey"],
        category: "greeting",
        followUp: ["What are your skills?", "What services do you offer?"],
    },

    thanks: {
        answer: "You're welcome! Feel free to ask if you have more questions.",
        keywords: ["thanks", "thank", "appreciate"],
        category: "greeting",
    },

    "thank you": {
        answer:
            "You're welcome! Is there anything else you'd like to know about Bishnu's work?",
        keywords: ["thank", "thanks", "appreciate"],
        category: "greeting",
        followUp: ["What are your skills?", "How can I contact you?"],
    },

    bye: {
        answer: "Goodbye! Feel free to visit again if you have more questions.",
        keywords: ["bye", "goodbye", "see you", "later"],
        category: "greeting",
    },

    help: {
        answer:
            "I can help you learn about Bishnu BK's skills, experience, services, and contact information. Just ask me anything!",
        keywords: ["help", "assist", "what can you do"],
        category: "greeting",
        followUp: [
            "What are your skills?",
            "How can I contact you?",
            "What services do you offer?",
        ],
    },

    "do you work remotely": {
        answer:
            "Yes, I work remotely and can collaborate with clients from anywhere in the world. I use modern communication tools and project management platforms to ensure smooth remote collaboration.",
        keywords: [
            "remote",
            "remotely",
            "work from home",
            "location",
            "distance",
        ],
        category: "services",
        followUp: [
            "What timezone are you in?",
            "How do you communicate remotely?",
        ],
    },

    "do you work with international clients": {
        answer:
            "Absolutely! I work with international clients and have experience delivering projects for clients from various countries. I handle time zone differences and cultural communication effectively.",
        keywords: [
            "international",
            "clients",
            "global",
            "foreign",
            "overseas",
            "abroad",
        ],
        category: "services",
        followUp: ["Do you work remotely?", "What services do you offer?"],
    },

    "what timezone are you in": {
        answer:
            "I'm in Nepal Time (NPT), which is UTC+5:45. I'm flexible with meeting times and can accommodate different time zones for client calls and collaboration.",
        keywords: ["timezone", "time", "schedule", "when", "hours"],
        category: "personal",
        followUp: ["Do you work remotely?", "How can I contact you?"],
    },
};

export const quickReplies = [
    "What are your skills?",
    "How can I contact you?",
    "What services do you offer?",
    "Tell me about your experience",
    "What's your tech stack?",
    "Do you work remotely?",
    "What are your rates?",
];

export const suggestedQuestions: SuggestedQuestion[] = [
    { question: "What projects have you worked on?", category: "Projects" },
    {
        question: "Are you available for new projects?",
        category: "Availability",
    },
    { question: "What's your preferred tech stack?", category: "Technology" },
    { question: "How long have you been developing?", category: "Experience" },
    {
        question: "Do you work with international clients?",
        category: "Clients",
    },
    { question: "What's your development process?", category: "Process" },
];
