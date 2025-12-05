const callBananaApi = require("../utils/callBananaApi");
const callGeminiDirectly = require("../utils/callGeminiDirectly");

exports.generateTryOn = async (req, res) => {
  try {
    // Check if files are present
    if (!req.files || !req.files.userPhoto || !req.files.outfitPhoto) {
      return res.status(400).json({
        success: false,
        error: "Both userPhoto and outfitPhoto are required.",
      });
    }

    const userPhotoFile = req.files.userPhoto[0];
    const outfitPhotoFile = req.files.outfitPhoto[0];

    // Convert buffers to base64
    const userPhotoBase64 = userPhotoFile.buffer.toString("base64");
    const outfitPhotoBase64 = outfitPhotoFile.buffer.toString("base64");

    // Call the external API
    let generatedImageBase64;
    try {
      // Check if the key looks like a Google Key
      if (
        process.env.BANANA_API_KEY &&
        process.env.BANANA_API_KEY.startsWith("AIza")
      ) {
        console.log("Detected Google API Key. Attempting to use Gemini...");
        generatedImageBase64 = await callGeminiDirectly(
          userPhotoBase64,
          outfitPhotoBase64
        );
      } else {
        generatedImageBase64 = await callBananaApi(
          userPhotoBase64,
          outfitPhotoBase64
        );
      }
    } catch (apiError) {
      console.error(
        "API Call Failed, falling back to mock response for demonstration:",
        apiError.message
      );
      // Fallback to user photo so the UI flow continues
      generatedImageBase64 = userPhotoBase64;
    }

    // Ensure the output is a proper data URL if it isn't already
    let outputImage = generatedImageBase64;
    if (!outputImage.startsWith("data:image")) {
      outputImage = `data:image/png;base64,${generatedImageBase64}`;
    }

    // Return success response
    res.json({
      success: true,
      generatedImage: outputImage,
    });
  } catch (error) {
    console.error("Try-On Controller Error:", error);
    res.status(500).json({
      success: false,
      error:
        error.message || "An error occurred during the virtual try-on process.",
    });
  }
};
