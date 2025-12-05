const axios = require("axios");

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

    // Adjust this based on the actual response structure from Banana API
    // Assuming response.data.modelOutputs[0].image_base64 or similar
    // For this example, let's assume it returns { output: "base64string" } or similar

    // NOTE: You will need to inspect the actual API response to map this correctly.
    // Here is a generic handler:
    if (response.data && response.data.generatedImage) {
      return response.data.generatedImage;
    } else if (response.data && response.data.output) {
      return response.data.output;
    } else if (
      response.data &&
      response.data.modelOutputs &&
      response.data.modelOutputs[0]
    ) {
      // Common Banana.dev format
      return (
        response.data.modelOutputs[0].image_base64 ||
        response.data.modelOutputs[0].image ||
        response.data.modelOutputs[0]
      );
    } else {
      // Fallback or throw error if structure is unknown
      console.log("API Response:", JSON.stringify(response.data, null, 2));
      throw new Error("Unexpected response format from Banana API");
    }
  } catch (error) {
    const errorDetails = error.response
      ? JSON.stringify(error.response.data)
      : error.message;

    // Check if it might be a Google Key used by mistake
    if (apiKey.startsWith("AIza")) {
      console.error(
        "WARNING: You seem to be using a Google API Key (starts with AIza) for the Banana.dev endpoint. This will not work. Banana.dev requires its own API Key."
      );
    }

    console.error("Error calling Banana API:", errorDetails);
    throw new Error(`Failed to generate image via Banana API: ${errorDetails}`);
  }
};

module.exports = callBananaApi;
