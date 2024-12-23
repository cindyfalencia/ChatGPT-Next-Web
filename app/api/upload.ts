import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs/promises";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing files:", err);
      return res.status(500).json({ error: "Error parsing files" });
    }

    // Ensure `files.media` is defined
    const uploadedFiles =
      files.media instanceof Array ? files.media : [files.media];

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    try {
      const uploadPromises = uploadedFiles.map(async (file) => {
        if (!file || !file.filepath) {
          throw new Error("Invalid file");
        }

        const fileData = await fs.readFile(file.filepath);

        // Simulate processing or saving the file
        console.log("Processing file:", file.originalFilename);

        return file.originalFilename; // Replace with actual processing logic
      });

      const processedFiles = await Promise.all(uploadPromises);

      res.status(200).json({ success: true, files: processedFiles });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "File processing failed" });
    }
  });
}
