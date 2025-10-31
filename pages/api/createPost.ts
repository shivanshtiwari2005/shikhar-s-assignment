// pages/api/create-post.ts
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
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Missing title or description" });
  }

  try {
    console.log('SANITY TOKEN (first 5 chars):', process.env.SANITY_API_TOKEN?.slice(0, 5))
    const newPost = await client.create({
      _type: "post",
      title,
      description,
      slug: { _type: "slug", current: title.toLowerCase().replace(/\s+/g, "-") },
    });

    return res.status(200).json({ success: true, post: newPost });
  } catch (error: any) {
    console.error("Error creating post:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
}
