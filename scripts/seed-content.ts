import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const testimonials = [
    {
        name: "Sarah Chen",
        slug: "sarah-chen",
        role: "Senior Product Manager",
        company: "TechCorp Inc",
        content:
            "Working with this developer was an absolute pleasure. They delivered a complex web application ahead of schedule and exceeded all our expectations. Their attention to detail and ability to translate business requirements into elegant technical solutions is remarkable. I highly recommend them for any serious web development project.",
        rating: 5,
        published: true,
    },
    {
        name: "Michael Rodriguez",
        slug: "michael-rodriguez",
        role: "CTO",
        company: "StartupHub",
        content:
            "I've worked with many developers over the years, but few have impressed me as much. Their expertise in modern web technologies, combined with excellent communication skills, made our collaboration seamless. They not only built what we asked for but also suggested improvements that significantly enhanced the final product.",
        rating: 5,
        published: true,
    },
    {
        name: "Emily Thompson",
        slug: "emily-thompson",
        role: "Founder & CEO",
        company: "DesignFlow Studio",
        content:
            "Exceptional work! They transformed our outdated website into a modern, responsive platform that our clients love. The performance improvements were incredible - our page load times decreased by 70%. Their proactive approach to problem-solving and commitment to quality really set them apart.",
        rating: 5,
        published: true,
    },
    {
        name: "David Park",
        slug: "david-park",
        role: "Lead Developer",
        company: "CloudSystems",
        content:
            "As a fellow developer, I can truly appreciate the quality of code and architecture they deliver. Clean, maintainable, and well-documented - exactly what you want in a professional project. They're also great at mentoring junior developers and fostering a collaborative environment.",
        rating: 5,
        published: true,
    },
];

const blogs = [
    {
        title: "Building Scalable Web Applications with Next.js 14",
        slug: "building-scalable-web-applications-nextjs-14",
        excerpt:
            "Explore the latest features in Next.js 14 and learn how to build high-performance, scalable web applications using the App Router, Server Components, and modern React patterns.",
        content: `<h2>Introduction</h2>
<p>Next.js 14 has revolutionized the way we build web applications. With its powerful App Router and Server Components, developers can now create faster, more efficient applications than ever before.</p>

<h2>Key Features</h2>
<p>The App Router introduces a new paradigm for routing in Next.js applications. Unlike the traditional Pages Router, it leverages React Server Components to enable:</p>
<ul>
<li>Automatic code splitting at the route level</li>
<li>Streaming and Suspense support out of the box</li>
<li>Improved data fetching patterns</li>
<li>Better SEO with built-in metadata API</li>
</ul>

<h2>Server Components</h2>
<p>Server Components are a game-changer for performance. By rendering components on the server, we can:</p>
<ul>
<li>Reduce JavaScript bundle size sent to the client</li>
<li>Access backend resources directly without API routes</li>
<li>Improve initial page load times</li>
<li>Enhance security by keeping sensitive logic on the server</li>
</ul>

<h2>Best Practices</h2>
<p>When building with Next.js 14, consider these best practices:</p>
<ol>
<li>Use Server Components by default, Client Components only when needed</li>
<li>Implement proper error boundaries and loading states</li>
<li>Leverage parallel routes for complex layouts</li>
<li>Optimize images with the built-in Image component</li>
<li>Use TypeScript for better type safety</li>
</ol>

<h2>Conclusion</h2>
<p>Next.js 14 provides an excellent foundation for building modern web applications. By understanding and leveraging its features, you can create applications that are both performant and maintainable.</p>`,
        author: "Tech Insights",
        tags: ["Next.js", "React", "Web Development", "Performance"],
        published: true,
    },
    {
        title: "Mastering TypeScript: Advanced Patterns and Techniques",
        slug: "mastering-typescript-advanced-patterns",
        excerpt:
            "Dive deep into advanced TypeScript patterns including generics, conditional types, and utility types. Learn how to write more type-safe and maintainable code.",
        content: `<h2>Why TypeScript Matters</h2>
<p>TypeScript has become the de facto standard for building large-scale JavaScript applications. Its static typing system catches errors at compile time, making your code more robust and maintainable.</p>

<h2>Advanced Generics</h2>
<p>Generics are one of TypeScript's most powerful features. They allow you to write reusable, type-safe code:</p>
<pre><code>function identity&lt;T&gt;(arg: T): T {
  return arg;
}

// Usage
const result = identity&lt;string&gt;("Hello");
</code></pre>

<h2>Conditional Types</h2>
<p>Conditional types enable you to create types that depend on other types:</p>
<pre><code>type IsString&lt;T&gt; = T extends string ? true : false;

type Result1 = IsString&lt;string&gt;; // true
type Result2 = IsString&lt;number&gt;; // false
</code></pre>

<h2>Utility Types</h2>
<p>TypeScript provides several built-in utility types that make common type transformations easier:</p>
<ul>
<li><strong>Partial&lt;T&gt;</strong> - Makes all properties optional</li>
<li><strong>Required&lt;T&gt;</strong> - Makes all properties required</li>
<li><strong>Pick&lt;T, K&gt;</strong> - Selects specific properties</li>
<li><strong>Omit&lt;T, K&gt;</strong> - Excludes specific properties</li>
</ul>

<h2>Real-World Applications</h2>
<p>These advanced patterns are particularly useful when building:</p>
<ul>
<li>API clients with type-safe responses</li>
<li>Form validation libraries</li>
<li>State management solutions</li>
<li>Component libraries with flexible props</li>
</ul>

<h2>Conclusion</h2>
<p>Mastering these advanced TypeScript patterns will significantly improve your code quality and developer experience. Start incorporating them into your projects today!</p>`,
        author: "Tech Insights",
        tags: ["TypeScript", "JavaScript", "Programming", "Best Practices"],
        published: true,
    },
    {
        title: "The Future of Web Development: Trends to Watch in 2024",
        slug: "future-web-development-trends-2024",
        excerpt:
            "Discover the emerging trends shaping the future of web development, from AI-powered tools to edge computing and the evolution of JavaScript frameworks.",
        content: `<h2>Introduction</h2>
<p>The web development landscape is constantly evolving. As we move through 2024, several key trends are emerging that will shape how we build web applications in the coming years.</p>

<h2>1. AI-Powered Development Tools</h2>
<p>Artificial Intelligence is transforming how developers work:</p>
<ul>
<li>Code completion and generation tools like GitHub Copilot</li>
<li>Automated testing and bug detection</li>
<li>AI-assisted code reviews</li>
<li>Natural language to code conversion</li>
</ul>

<h2>2. Edge Computing</h2>
<p>Edge computing is bringing computation closer to users, resulting in:</p>
<ul>
<li>Reduced latency and faster response times</li>
<li>Better performance for global applications</li>
<li>Improved data privacy and security</li>
<li>More efficient resource utilization</li>
</ul>

<h2>3. Server Components and Streaming</h2>
<p>React Server Components and streaming are changing how we think about rendering:</p>
<ul>
<li>Reduced JavaScript bundle sizes</li>
<li>Progressive enhancement by default</li>
<li>Better SEO and initial load performance</li>
<li>Simplified data fetching patterns</li>
</ul>

<h2>4. WebAssembly Growth</h2>
<p>WebAssembly is enabling new possibilities:</p>
<ul>
<li>Running high-performance applications in the browser</li>
<li>Porting desktop applications to the web</li>
<li>Better performance for compute-intensive tasks</li>
<li>Language diversity in web development</li>
</ul>

<h2>5. Improved Developer Experience</h2>
<p>Tools and frameworks are focusing more on DX:</p>
<ul>
<li>Better error messages and debugging tools</li>
<li>Faster build times with tools like Turbopack</li>
<li>Improved hot module replacement</li>
<li>Better TypeScript integration</li>
</ul>

<h2>Conclusion</h2>
<p>These trends represent exciting opportunities for web developers. Staying informed and adapting to these changes will be key to building better web applications in 2024 and beyond.</p>`,
        author: "Tech Insights",
        tags: ["Web Development", "Trends", "AI", "Future Tech"],
        published: true,
    },
    {
        title: "Optimizing React Performance: A Comprehensive Guide",
        slug: "optimizing-react-performance-guide",
        excerpt:
            "Learn proven techniques to optimize your React applications, from code splitting and lazy loading to memoization and virtual scrolling.",
        content: `<h2>Understanding React Performance</h2>
<p>React is fast by default, but as applications grow, performance can become a concern. Understanding how React works under the hood is the first step to optimization.</p>

<h2>1. Code Splitting</h2>
<p>Break your application into smaller chunks that load on demand:</p>
<pre><code>const LazyComponent = lazy(() => import('./Component'));

function App() {
  return (
    &lt;Suspense fallback={&lt;Loading /&gt;}&gt;
      &lt;LazyComponent /&gt;
    &lt;/Suspense&gt;
  );
}
</code></pre>

<h2>2. Memoization</h2>
<p>Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders:</p>
<pre><code>const MemoizedComponent = memo(({ data }) => {
  return &lt;div&gt;{data}&lt;/div&gt;;
});

const memoizedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
</code></pre>

<h2>3. Virtual Scrolling</h2>
<p>For long lists, implement virtual scrolling to render only visible items:</p>
<ul>
<li>Use libraries like react-window or react-virtualized</li>
<li>Significantly reduces DOM nodes</li>
<li>Improves scroll performance</li>
<li>Reduces memory usage</li>
</ul>

<h2>4. Image Optimization</h2>
<p>Optimize images for better performance:</p>
<ul>
<li>Use modern formats like WebP and AVIF</li>
<li>Implement lazy loading for images</li>
<li>Use responsive images with srcset</li>
<li>Leverage CDN for image delivery</li>
</ul>

<h2>5. Bundle Size Optimization</h2>
<p>Keep your bundle size small:</p>
<ul>
<li>Analyze bundle with tools like webpack-bundle-analyzer</li>
<li>Remove unused dependencies</li>
<li>Use tree-shaking effectively</li>
<li>Consider lighter alternatives to heavy libraries</li>
</ul>

<h2>Measuring Performance</h2>
<p>Use these tools to measure and monitor performance:</p>
<ul>
<li>React DevTools Profiler</li>
<li>Chrome DevTools Performance tab</li>
<li>Lighthouse for overall metrics</li>
<li>Web Vitals for user-centric metrics</li>
</ul>

<h2>Conclusion</h2>
<p>Performance optimization is an ongoing process. Start with measuring, identify bottlenecks, and apply these techniques strategically. Remember, premature optimization can be counterproductive - focus on real performance issues first.</p>`,
        author: "Tech Insights",
        tags: ["React", "Performance", "Optimization", "Web Development"],
        published: true,
    },
];

async function seedContent() {
    console.log("🌱 Starting content seeding...\n");

    // Seed testimonials
    console.log("📝 Seeding testimonials...");
    for (const testimonial of testimonials) {
        const { data, error } = await supabase
            .from("testimonials")
            .insert(testimonial)
            .select()
            .single();

        if (error) {
            console.error(
                `❌ Error seeding testimonial "${testimonial.name}":`,
                error.message,
            );
        } else {
            console.log(`✅ Seeded testimonial: ${testimonial.name}`);
        }
    }

    console.log("\n📚 Seeding blog posts...");
    // Seed blogs
    for (const blog of blogs) {
        const { data, error } = await supabase
            .from("blogs")
            .insert(blog)
            .select()
            .single();

        if (error) {
            console.error(
                `❌ Error seeding blog "${blog.title}":`,
                error.message,
            );
        } else {
            console.log(`✅ Seeded blog: ${blog.title}`);
        }
    }

    console.log("\n✨ Content seeding completed!");
}

// Run the seed function
seedContent()
    .then(() => {
        console.log("\n🎉 All done!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("\n💥 Seeding failed:", error);
        process.exit(1);
    });
