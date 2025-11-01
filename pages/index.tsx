import { client } from "../src/sanity/lib/client";
import { urlFor } from "../src/sanity/lib/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export async function getServerSideProps() {
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt desc){_id, title, slug, mainImage, description}`);
  return { props: { initialPosts: posts } };
}

export default function Home({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function refreshData() {
    setIsRefreshing(true);
    try {
      const response = await fetch('/api/getPosts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data.posts);
      toast.success("Blogs refreshed!");
    } catch (error) {
      console.error("Failed to refresh blogs:", error);
      toast.error("Failed to refresh blogs!");
    } finally {
      setIsRefreshing(false);
    }
  }

  // Auto-refresh every 5 seconds when on the page
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  function getImageUrl(post: any) {
    if (post.mainImage?.asset?._ref || post.mainImage?.asset?._id) {
      try {
        return urlFor(post.mainImage).width(800).height(600).url();
      } catch (error) {
        console.error("Error generating image URL:", error);
      }
    }
    // Fallback to a nice Unsplash image
    return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop&q=80";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 animate-slideIn">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              My Blog
            </h1>
            <p className="text-gray-600 text-lg">Discover stories, thinking, and expertise</p>
          </div>
          <div className="flex gap-3">
            <Link href="/create-post">
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 btn-animate shadow-lg">
                ✍️ Create Blog
              </button>
            </Link>
            <button
              onClick={refreshData}
              disabled={isRefreshing}
              className="px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 btn-animate shadow-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRefreshing ? "🔄 Refreshing..." : "🔄 Refresh"}
            </button>
          </div>
        </div>

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-20 animate-fadeIn">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">No blogs yet</h2>
            <p className="text-gray-500 mb-6">Create your first blog post to get started!</p>
            <Link href="/create-post">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl btn-animate shadow-lg">
                Create Your First Post
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {posts.map((p, index) => (
              <Link key={p.slug.current} href={`/blog/${p.slug.current}`}>
                <div 
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md card-hover animate-fadeIn"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                    <img
                      src={getImageUrl(p)}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                      {p.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3 leading-relaxed">
                      {p.description || "No description available"}
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 font-semibold text-sm group">
                      <span>Read more</span>
                      <svg 
                        className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
