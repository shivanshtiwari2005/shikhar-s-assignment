// pages/api/updatePost.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2025-10-31",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, title, description } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Missing post ID" });
  }

  try {
    // Get old post to revalidate old slug if slug changes
    const oldPost = await client.fetch(`*[_type == "post" && _id == $id][0]{slug}`, { id });

    const updates: any = {};
    if (title) {
      updates.title = title;
      // Update slug when title changes
      updates.slug = { _type: "slug", current: title.toLowerCase().replace(/\s+/g, "-") };
    }
    if (description !== undefined) {
      updates.description = description;
    }

    const updatedPost = await client.patch(id).set(updates).commit();
    
    // Trigger revalidation
    try {
      await res.revalidate('/');
      if (oldPost?.slug?.current) {
        await res.revalidate(`/blog/${oldPost.slug.current}`);
      }
      if (updatedPost?.slug?.current) {
        await res.revalidate(`/blog/${updatedPost.slug.current}`);
      }
    } catch (revalidateError) {
      console.error("Revalidation error:", revalidateError);
    }

    return res.status(200).json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error("Error updating post:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
