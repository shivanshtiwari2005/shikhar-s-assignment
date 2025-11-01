import { NextApiRequest, NextApiResponse } from "next";
import { client } from "../../src/sanity/lib/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const posts = await client.fetch(
      `*[_type == "post"] | order(_createdAt desc){_id, title, slug, mainImage, description}`
    );
    
    return res.status(200).json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Failed to fetch posts" });
  }
}
