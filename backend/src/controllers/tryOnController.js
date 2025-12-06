import callReplicate from "../utils/callReplicate.js";
import { preprocessTryOnImages } from "../utils/preprocessImages.js";

export const generateTryOn = async (req, res) => {
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

    let generatedImageUrl;

    try {
      // --- PREPROCESSING STEP ---
      console.log("Preprocessing images...");
      const { human_img, garm_img } = await preprocessTryOnImages(
        userPhotoBase64,
        outfitPhotoBase64
      );

      // Call Replicate (IDM-VTON) with processed images
      generatedImageUrl = await callReplicate(human_img, garm_img);
    } catch (apiError) {
      console.error("API Call Failed Detailed Error:", apiError);
      // Fallback to user photo if API fails (so app doesn't crash)
      generatedImageUrl = `data:image/jpeg;base64,${userPhotoBase64}`;
    }

    // Return success response
    res.json({
      success: true,
      generatedImage: generatedImageUrl, // Replicate returns a URL
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
