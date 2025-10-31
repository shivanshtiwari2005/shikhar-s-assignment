import { GetStaticPaths, GetStaticProps } from "next";
import { client } from "../../src/sanity/lib/client";
import { PortableText } from "@portabletext/react";

type Post = {
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
  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
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
