import { createClient } from "@sanity/client";
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "9oefwg7b",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-10-31",
  useCdn: false,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

async function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  const form = formidable({});
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
}

async function uploadImageToSanity(filePath: string): Promise<string> {
  const imageBuffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload("image", imageBuffer, {
    filename: filePath.split("/").pop() || "upload.jpg",
  });
  return asset._id;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Check if token is available
    if (!process.env.SANITY_API_TOKEN) {
      console.error("SANITY_API_TOKEN is not set");
      return res.status(500).json({ error: "Server configuration error: Missing API token" });
    }

    const { fields, files } = await parseForm(req);

    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const postData: any = {
      _type: "post",
      title,
      description,
      slug: {
        _type: "slug",
        current: slug,
      },
      // Create a simple body from description
      body: [
        {
          _type: "block",
          style: "normal",
          children: [
            {
              _type: "span",
              text: description,
            },
          ],
        },
      ],
    };

    // Handle image upload if present
    if (files.image) {
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
      
      if (imageFile && imageFile.filepath) {
        try {
          const imageAssetId = await uploadImageToSanity(imageFile.filepath);
          postData.mainImage = {
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAssetId,
            },
          };
          
          // Clean up temporary file
          fs.unlinkSync(imageFile.filepath);
        } catch (imageError) {
          console.error("Error uploading image:", imageError);
          // Continue without image rather than failing completely
        }
      }
    }

    const post = await client.create(postData);

    return res.status(200).json({ success: true, post });
  } catch (error: any) {
    console.error("Error creating post:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to create post",
      details: error.response?.body || error.toString()
    });
  }
}
