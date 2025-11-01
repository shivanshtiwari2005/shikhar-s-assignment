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
    
    return res.status(200).json({ success: true, post: updatedPost });
  } catch (error: any) {
    console.error("Error updating post:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
