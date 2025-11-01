// pages/api/deletePost.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2025-10-31",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Missing post ID" });
  }

  try {
    // Get post slug before deleting for revalidation
    const post = await client.fetch(`*[_type == "post" && _id == $id][0]{slug}`, { id });
    
    await client.delete(id);
    
    // Trigger revalidation
    try {
      await res.revalidate('/');
      if (post?.slug?.current) {
        await res.revalidate(`/blog/${post.slug.current}`);
      }
    } catch (revalidateError) {
      console.error("Revalidation error:", revalidateError);
    }
    
    return res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting post:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
