// pages/index.tsx
import { GetStaticProps } from "next";
import Link from "next/link";
import { client } from "../src/sanity/lib/client";

type Post = {
  title: string;
  slug: { current: string };
  description?: string;
};

export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "post"] | order(publishedAt desc){
    title,
    slug,
    description
  }`;
  const posts: Post[] = await client.fetch(query);
  return { props: { posts } };
};

export default function Home({ posts }: { posts: Post[] }) {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-center mb-6">
  <Link
    href="/create-post"
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg"
  >
    + Create New Post
  </Link>
</div>

      <h1 className="text-3xl font-bold mb-6 text-center">Latest Posts</h1>

      <div className="grid gap-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link
              key={post.slug.current}
              href={`/blog/${post.slug.current}`}
              className="block p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <h2 className="text-xl font-semibold">{post.title}</h2>
              {post.description && (
                <p className="text-gray-600 mt-1">{post.description}</p>
              )}
            </Link>
          ))
        ) : (
          <p className="text-gray-500 text-center">No posts found.</p>
        )}
      </div>
    </div>
  );
}
