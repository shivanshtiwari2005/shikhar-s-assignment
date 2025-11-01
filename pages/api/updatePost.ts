// pages/api/updatePost.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@sanity/client";
import formidable from "formidable";
import fs from "fs";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  token: process.env.SANITY_API_TOKEN || process.env.NEXT_PUBLIC_SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: "2025-10-31",
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
  if (req.method !== "PATCH" && req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { fields, files } = await parseForm(req);

    const id = Array.isArray(fields.id) ? fields.id[0] : fields.id;
    const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
    const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;

    if (!id) {
      return res.status(400).json({ message: "Missing post ID" });
    }

    // Get old post to revalidate old slug if slug changes
    const oldPost = await client.fetch(`*[_type == "post" && _id == $id][0]{slug}`, { id });

    const updates: any = {};
    
    if (title) {
      updates.title = title;
      updates.slug = { _type: "slug", current: title.toLowerCase().replace(/\s+/g, "-") };
    }
    
    if (description !== undefined) {
      updates.description = description;
      // Update body with new description
      updates.body = [
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
      ];
    }

    // Handle image upload if present
    if (files.image) {
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
      
      if (imageFile && imageFile.filepath) {
        try {
          const imageAssetId = await uploadImageToSanity(imageFile.filepath);
          updates.mainImage = {
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
        }
      }
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
