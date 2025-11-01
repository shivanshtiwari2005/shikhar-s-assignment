import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { client } from "../../src/sanity/lib/client";
import { PortableText } from "@portabletext/react";

type Post = {
  _id: string;
  title: string;
  description?: string;
  slug: { current: string };
  body?: any;
  mainImage?: {
    asset?: {
      url: string;
    };
    alt?: string;
  };
  author?: {
    name?: string;
  };
};

// --------------------
// Fetch all slugs for static paths
// --------------------
export const getStaticPaths: GetStaticPaths = async () => {
  const slugs: { slug: string }[] = await client.fetch(`
    *[_type == "post" && defined(slug.current)]{
      "slug": slug.current
    }
  `);

  const paths = slugs.map((s) => ({
    params: { slug: s.slug },
  }));

  return { paths, fallback: false };
};

// --------------------
// Fetch post content by slug
// --------------------
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const post: Post = await client.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      _id,
      title,
      description,
      body,
      mainImage{
        asset->{url},
        alt
      },
      author->{
        name
      }
    }`,
    { slug }
  );

  return { props: { post } };
};

// --------------------
// Portable Text components
// --------------------
const components = {
  types: {
    image: ({ value }: any) => (
      <img
        src={value?.asset?.url}
        alt={value?.alt || "Blog image"}
        className="rounded-lg my-6 w-full"
      />
    ),
  },
  marks: {
    link: ({ children, value }: any) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 underline hover:text-blue-400"
      >
        {children}
      </a>
    ),
  },
  block: {
    h1: ({ children }: any) => (
      <h1 className="text-4xl font-bold mt-10 mb-6 text-white">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-semibold mt-8 mb-4 text-white">
        {children}
      </h2>
    ),
    normal: ({ children }: any) => (
      <p className="my-4 leading-relaxed text-gray-300">{children}</p>
    ),
  },
};

// --------------------
// Blog Page Component
// --------------------
export default function Blog({ post }: { post: Post }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) {
      return;
    }

    try {
      const response = await fetch("/api/deletePost", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post._id }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Post deleted successfully!");
        router.push("/");
      } else {
        alert(`Failed to delete post: ${data.error}`);
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <div className="flex justify-between items-start mb-6">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          ← Back to Posts
        </Link>
        <div className="flex gap-2">
          <Link
            href={`/edit-post/${post._id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm py-1 px-4 rounded transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white text-sm py-1 px-4 rounded transition"
          >
            Delete
          </button>
        </div>
      </div>

      <h1 className="text-4xl font-extrabold mb-4">{post.title}</h1>

      {post.author?.name && (
        <p className="text-sm text-gray-400 mb-2">
          By {post.author.name}
        </p>
      )}

      {post.description && (
        <p className="text-gray-400 mb-6">{post.description}</p>
      )}

      {post.mainImage?.asset?.url && (
        <img
          src={post.mainImage.asset.url}
          alt={post.mainImage.alt || "Blog image"}
          className="rounded-xl mb-6 w-full"
        />
      )}

      {post.body ? (
        <div className="prose prose-invert max-w-none">
          <PortableText value={post.body} components={components} />
        </div>
      ) : (
        <p className="text-gray-500">No content available.</p>
      )}
    </div>
  );
}
