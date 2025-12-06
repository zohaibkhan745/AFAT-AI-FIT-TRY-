import sharp from "sharp";

/**
 * Helper function to auto-center crop an image buffer to a target aspect ratio.
 * @param {Buffer} buffer - The image buffer.
 * @param {number} targetWidthRatio - The target width ratio (e.g., 3).
 * @param {number} targetHeightRatio - The target height ratio (e.g., 4).
 * @returns {Promise<Buffer>} - The cropped image buffer.
 */
const autoCenterCrop = async (buffer, targetWidthRatio, targetHeightRatio) => {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const { width, height } = metadata;

  const targetRatio = targetWidthRatio / targetHeightRatio;
  const currentRatio = width / height;

  let cropWidth, cropHeight, left, top;

  if (currentRatio > targetRatio) {
    // Image is too wide, crop width
    cropHeight = height;
    cropWidth = Math.round(height * targetRatio);
    left = Math.round((width - cropWidth) / 2);
    top = 0;
  } else {
    // Image is too tall, crop height
    cropWidth = width;
    cropHeight = Math.round(width / targetRatio);
    left = 0;
    top = Math.round((height - cropHeight) / 2);
  }

  return image
    .extract({ left, top, width: cropWidth, height: cropHeight })
    .toBuffer();
};

/**
 * Preprocesses the human and garment images for IDM-VTON.
 * @param {string} humanBase64 - Base64 string of the human image.
 * @param {string} garmentBase64 - Base64 string of the garment image.
 * @returns {Promise<{human_img: string, garm_img: string}>} - Processed base64 images with data URI prefix.
 */
export const preprocessTryOnImages = async (humanBase64, garmentBase64) => {
  try {
    console.log("Starting image preprocessing...");

    // 1. Decode Base64 to Buffers
    // Handle cases where base64 might already have a prefix
    const cleanHumanBase64 = humanBase64.replace(
      /^data:image\/\w+;base64,/,
      ""
    );
    const cleanGarmentBase64 = garmentBase64.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    const humanBuffer = Buffer.from(cleanHumanBase64, "base64");
    const garmentBuffer = Buffer.from(cleanGarmentBase64, "base64");

    // 2. Process Human Image (Target: 768x1024, 3:4 Aspect Ratio)
    // First, auto-center crop to 3:4 aspect ratio
    const croppedHumanBuffer = await autoCenterCrop(humanBuffer, 3, 4);

    // Then resize to exactly 768x1024
    const processedHumanBuffer = await sharp(croppedHumanBuffer)
      .resize(768, 1024, {
        fit: "cover", // Ensure it fills the dimensions
        position: "center", // Focus on center
      })
      .toFormat("jpeg")
      .toBuffer();

    // 3. Process Garment Image (Target: 768x768, 1:1 Aspect Ratio)
    // First, trim whitespace/transparent edges if possible (optional but good for garments)
    // Then auto-center crop to 1:1
    // Note: For garments, sometimes 'trim' is useful to remove transparent borders before cropping
    const trimmedGarmentBuffer = await sharp(garmentBuffer)
      .trim()
      .toBuffer()
      .catch(() => garmentBuffer); // Fallback if trim fails (e.g. no transparency)

    const croppedGarmentBuffer = await autoCenterCrop(
      trimmedGarmentBuffer,
      1,
      1
    );

    // Then resize to exactly 768x768
    const processedGarmentBuffer = await sharp(croppedGarmentBuffer)
      .resize(768, 768, {
        fit: "contain", // Keep entire garment visible, pad if needed
        background: { r: 255, g: 255, b: 255, alpha: 1 }, // White background
      })
      .toFormat("jpeg")
      .toBuffer();

    // 4. Re-encode to Base64 with Data URI prefix
    const processedHumanBase64 = `data:image/jpeg;base64,${processedHumanBuffer.toString(
      "base64"
    )}`;
    const processedGarmentBase64 = `data:image/jpeg;base64,${processedGarmentBuffer.toString(
      "base64"
    )}`;

    console.log("Image preprocessing complete.");

    return {
      human_img: processedHumanBase64,
      garm_img: processedGarmentBase64,
    };
  } catch (error) {
    console.error("Error during image preprocessing:", error);
    throw new Error("Failed to preprocess images: " + error.message);
  }
};
