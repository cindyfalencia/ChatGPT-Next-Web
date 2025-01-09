import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Extract JSON body
    const { chatHistory, questionnaire } = req.body;

    // Validate incoming data
    if (!chatHistory && !questionnaire) {
      return res.status(400).json({
        error: "Both chatHistory and questionnaire are missing.",
      });
    }

    console.log("Received chat history:", chatHistory || "None provided");
    console.log("Received questionnaire:", questionnaire || "None provided");

    const savedData = {
      chatHistory: chatHistory || "No chat history provided",
      questionnaire: questionnaire || "No questionnaire provided",
    };

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Data received successfully.",
      data: savedData,
    });
  } catch (error) {
    console.error("Error during upload:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
}
