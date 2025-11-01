// pages/index.tsx
import { GetStaticProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { client } from "../src/sanity/lib/client";

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
};

export const getStaticProps: GetStaticProps = async () => {
  const query = `*[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    slug,
    description
  }`;
  const posts: Post[] = await client.fetch(query);
  return { props: { posts } };
};

export default function Home({ posts }: { posts: Post[] }) {
  const router = useRouter();

  const handleDelete = async (postId: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${postTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch("/api/deletePost", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Post deleted successfully!");
        router.reload();
      } else {
        alert(`Failed to delete post: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

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
            <div
              key={post.slug.current}
              className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              <Link href={`/blog/${post.slug.current}`}>
                <h2 className="text-xl font-semibold hover:text-blue-600 cursor-pointer">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="text-gray-600 mt-1">{post.description}</p>
                )}
              </Link>

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/edit-post/${post._id}`}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-4 rounded transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post._id, post.title)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-4 rounded transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">No posts found.</p>
        )}
      </div>
    </div>
  );
}
