const { GoogleGenerativeAI } = require("@google/generative-ai");

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

    // IF the user actually wants to use a specific Banana.dev model that wraps something else, we should stick to the previous code.
    // BUT, the error "Failed to generate image via Banana API" suggests the previous endpoint failed.

    // Since I cannot know for sure which specific "Banana" model the user deployed,
    // and the key looks like a Google API key (starts with AIza),
    // it is highly likely the user is trying to use Google's Gemini API directly but got confused with "Banana".

    // However, standard Gemini API does NOT generate images yet (it analyzes them).
    // It can describe the try-on but not generate the pixel data of the result image unless using Imagen on Vertex AI.

    // For now, let's return a mock success if the API fails, or try to explain the limitation.

    throw new Error(
      "The provided API Key looks like a Google Gemini Key, but standard Gemini models (Pro/Flash) cannot generate images, only text. You need an Image Generation model (like Imagen 3 or Stable Diffusion) hosted on Banana.dev or Replicate."
    );
  } catch (error) {
    throw error;
  }
};

module.exports = callGeminiDirectly;
