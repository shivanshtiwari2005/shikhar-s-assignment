import { createClient } from "@sanity/client";
import https from "https";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "9oefwg7b",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-31",
  useCdn: false,
});

const samplePosts = [
  {
    title: "Getting Started with Next.js and Sanity",
    slug: "getting-started-nextjs-sanity",
    description: "Learn how to build a modern blog using Next.js and Sanity CMS. This comprehensive guide covers everything from setup to deployment.",
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Why Next.js and Sanity?" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Next.js is a powerful React framework that provides server-side rendering, static site generation, and many other features out of the box. Combined with Sanity CMS, you get a flexible and scalable content management solution.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Key Benefits" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "• Fast performance with automatic optimization\n• Real-time content updates\n• Flexible content modeling\n• Great developer experience\n• SEO-friendly out of the box",
          },
        ],
      },
    ],
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop",
  },
  {
    title: "10 Tips for Writing Clean React Code",
    slug: "clean-react-code-tips",
    description: "Discover the best practices for writing maintainable and efficient React code. These tips will help you become a better React developer.",
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "1. Use Functional Components" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Functional components with hooks are the modern way to write React. They're simpler, more readable, and easier to test.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "2. Keep Components Small" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Break down large components into smaller, reusable pieces. Each component should do one thing well.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "3. Use TypeScript" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "TypeScript helps catch errors early and makes your code more maintainable with type safety.",
          },
        ],
      },
    ],
    imageUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=600&fit=crop",
  },
  {
    title: "The Future of Web Development in 2025",
    slug: "future-web-development-2025",
    description: "Explore the latest trends and technologies shaping the future of web development. From AI integration to Web3, discover what's next.",
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "AI-Powered Development" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Artificial Intelligence is revolutionizing how we build web applications. From code generation to automated testing, AI tools are becoming essential in modern development workflows.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Edge Computing" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Edge computing brings computation closer to users, resulting in faster load times and better user experiences. Platforms like Vercel and Cloudflare are leading this revolution.",
          },
        ],
      },
    ],
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
  },
  {
    title: "Building Responsive UIs with Tailwind CSS",
    slug: "responsive-ui-tailwind",
    description: "Master the art of creating beautiful, responsive user interfaces using Tailwind CSS. Learn utility-first CSS and modern design patterns.",
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "What is Tailwind CSS?" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Tailwind CSS is a utility-first CSS framework that allows you to build custom designs without leaving your HTML. It's fast, flexible, and highly customizable.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Why Developers Love It" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "• No more naming classes\n• Responsive design made easy\n• Consistent spacing and sizing\n• Smaller CSS bundles\n• Great documentation",
          },
        ],
      },
    ],
    imageUrl: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=600&fit=crop",
  },
  {
    title: "Understanding TypeScript Generics",
    slug: "typescript-generics-guide",
    description: "A comprehensive guide to TypeScript generics. Learn how to write more reusable and type-safe code with this powerful feature.",
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "What Are Generics?" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Generics allow you to write flexible, reusable code that works with any type while maintaining type safety. They're one of the most powerful features in TypeScript.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Common Use Cases" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Generics are commonly used in array operations, API calls, React components, and utility functions. They help reduce code duplication while ensuring type safety.",
          },
        ],
      },
    ],
    imageUrl: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop",
  },
  {
    title: "Deploying Your Next.js App to Production",
    slug: "deploying-nextjs-production",
    description: "Step-by-step guide to deploying your Next.js application to production. Learn about Vercel, optimization techniques, and best practices.",
    body: [
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Choosing a Hosting Platform" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Vercel is the recommended platform for Next.js applications, offering seamless integration and automatic optimizations. However, you can also deploy to AWS, Google Cloud, or any Node.js hosting provider.",
          },
        ],
      },
      {
        _type: "block",
        style: "h2",
        children: [{ _type: "span", text: "Optimization Tips" }],
      },
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "• Enable image optimization\n• Use static generation where possible\n• Implement caching strategies\n• Monitor performance metrics\n• Set up proper error tracking",
          },
        ],
      },
    ],
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
  },
];

async function uploadImageFromUrl(imageUrl: string): Promise<string | null> {
  try {
    return new Promise((resolve, reject) => {
      https.get(imageUrl, (response) => {
        const chunks: Buffer[] = [];
        
        response.on('data', (chunk) => chunks.push(chunk));
        
        response.on('end', async () => {
          try {
            const buffer = Buffer.concat(chunks);
            const asset = await client.assets.upload("image", buffer, {
              filename: imageUrl.split("/").pop() || "image.jpg",
            });
            resolve(asset._id);
          } catch (error) {
            console.error("Error uploading to Sanity:", error);
            resolve(null);
          }
        });
        
        response.on('error', (error) => {
          console.error("Error downloading image:", error);
          resolve(null);
        });
      });
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
}

async function seedData() {
  console.log("🌱 Starting to seed data...\n");

  for (const post of samplePosts) {
    try {
      console.log(`📝 Creating post: ${post.title}`);
      
      // Upload image
      let imageAssetId = null;
      if (post.imageUrl) {
        console.log(`  📷 Uploading image...`);
        imageAssetId = await uploadImageFromUrl(post.imageUrl);
      }

      // Create post
      const postData: any = {
        _type: "post",
        title: post.title,
        slug: {
          _type: "slug",
          current: post.slug,
        },
        description: post.description,
        body: post.body,
      };

      if (imageAssetId) {
        postData.mainImage = {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAssetId,
          },
        };
      }

      await client.create(postData);
      console.log(`  ✅ Created successfully!\n`);
    } catch (error: any) {
      console.error(`  ❌ Error creating post: ${error.message}\n`);
    }
  }

  console.log("🎉 Seeding completed!");
}

seedData().catch(console.error);
