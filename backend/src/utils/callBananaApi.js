import axios from "axios";

const callBananaApi = async (userPhotoBase64, outfitPhotoBase64) => {
  const apiKey = process.env.BANANA_API_KEY;
  const apiUrl = "https://api.banana.dev/generate"; // Assuming this is the endpoint

  if (!apiKey) {
    throw new Error("BANANA_API_KEY is not defined in environment variables");
  }

  const prompt = `
   Generate a virtual try-on image.

   Use Image 1 as the person. DO NOT change the person's identity, face, skin tone,
   hairstyle, body shape, or background. The person must look exactly the same as
   in the original photo.

   Use Image 2 as the clothing item. Apply this clothing item naturally and
   realistically onto the person from Image 1. The clothing should fit properly on
   the body with correct shape, wrinkles, lighting, and perspective.

   Do NOT modify the person’s pose. Simply overlay the clothing item in a realistic way.

   Keep:
   - same face
   - same expression
   - same hair
   - same eyes
   - same skin tone
   - same background

   Only add the clothing item from Image 2.

   Output: A realistic image of the person wearing the clothing from Image 2.
   `;

  const payload = {
    model: "gemini-nano",
    prompt: prompt,
    images: [
      { name: "image1", data: userPhotoBase64 },
      { name: "image2", data: outfitPhotoBase64 },
    ],
  };

  try {
    const response = await axios.post(apiUrl, payload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // Assuming Bearer token auth, adjust if needed
      },
    });

    // Adjust based on actual Banana API response structure
    if (response.data && response.data.modelOutputs) {
      // Assuming modelOutputs contains base64 image or URL
      return response.data.modelOutputs[0].image_base64;
    } else {
      console.warn("Unexpected Banana API response:", response.data);
      // Fallback or throw
      throw new Error("Invalid response from Banana API");
    }
  } catch (error) {
    console.error("Banana API Error:", error.response?.data || error.message);
    throw error;
  }
};

export default callBananaApi;
