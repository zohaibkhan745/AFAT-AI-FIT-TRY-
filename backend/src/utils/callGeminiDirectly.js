import { GoogleGenerativeAI } from "@google/generative-ai";

const callGeminiDirectly = async (userPhotoBase64, outfitPhotoBase64) => {
  const apiKey = process.env.BANANA_API_KEY; // Using the same key variable for convenience

  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
   Generate a virtual try-on image.
   
   I have provided two images:
   1. A person (user photo)
   2. A clothing item (outfit photo)

   Your task is to generate a NEW image where the person from the first image is wearing the clothing from the second image.
   
   - Keep the person's identity, face, body shape, and pose exactly the same.
   - Apply the clothing naturally, respecting lighting and wrinkles.
   - Return ONLY the generated image.
   `;

  const imageParts = [
    {
      inlineData: {
        data: userPhotoBase64,
        mimeType: "image/jpeg",
      },
    },
    {
      inlineData: {
        data: outfitPhotoBase64,
        mimeType: "image/jpeg",
      },
    },
  ];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Gemini text-only models don't generate images directly in the same way as image-gen models.
    // However, if the user has access to an image generation model via Gemini (like Imagen), the SDK usage is different.
    // Standard Gemini 1.5 Flash/Pro are multimodal INPUT, text OUTPUT.

    // For now, we will return the text description or a placeholder if it fails to generate an image.
    // In a real scenario, you would use a dedicated image generation model endpoint.

    console.log("Gemini Response:", text);

    // Since we can't get an image back from text model easily without Imagen,
    // we might just return the original user image as a fallback for the demo
    // OR if the text contains a URL (unlikely).

    return null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export default callGeminiDirectly;
