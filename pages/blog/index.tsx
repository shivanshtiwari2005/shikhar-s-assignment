"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { client } from "../../src/sanity/lib/client";

type Post = {
  title: string;
  description?: string;
  slug: { current: string };
  mainImage?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
};

export default function BlogIndex({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  // 👇 useEffect to auto-refresh posts from Sanity every time you visit or refresh
  useEffect(() => {
    const fetchPosts = async () => {
      const latestPosts = await client.fetch(`
        *[_type == "post"] | order(_createdAt desc){
          title,
          description,
          "slug": slug.current,
          mainImage{
            asset->{url},
            alt
          }
        }
      `);
      setPosts(latestPosts);
    };

    fetchPosts();
  }, []); // runs once on mount

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">Latest Posts</h1>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {posts.length === 0 && (
          <p className="text-gray-500 text-center">No posts found.</p>
        )}

        {posts.map((post) => (
          <Link
            key={post.slug.current}
            href={`/blog/${post.slug.current}`}
            className="block border border-gray-700 rounded-xl p-5 hover:bg-gray-900 transition"
          >
            {post.mainImage?.asset?.url && (
              <img
                src={post.mainImage.asset.url}
                alt={post.mainImage.alt || "Post image"}
                className="rounded-lg mb-4 w-full"
              />
            )}
            <h2 className="text-2xl font-semibold">{post.title}</h2>
            {post.description && (
              <p className="text-gray-400 mt-2">{post.description}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}

// -----------------------------
// For Static Generation (optional)
// -----------------------------
export async function getStaticProps() {
  const posts = await client.fetch(`
    *[_type == "post"] | order(_createdAt desc){
      title,
      description,
      "slug": slug.current,
      mainImage{
        asset->{url},
        alt
      }
    }
  `);

  return {
    props: { initialPosts: posts },
    revalidate: 60, // ISR: re-generate every 60s
  };
}
