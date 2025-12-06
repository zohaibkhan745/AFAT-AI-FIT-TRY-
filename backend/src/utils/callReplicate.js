import Replicate from "replicate";

const callReplicate = async (userPhotoBase64, outfitPhotoBase64) => {
  if (!process.env.REPLICATE_API_TOKEN) {
    console.error(
      "ERROR: REPLICATE_API_TOKEN is missing in environment variables."
    );
    throw new Error("REPLICATE_API_TOKEN is missing");
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  // Convert base64 to data URI for Replicate if needed
  // Note: Replicate expects a public URL or a data URI
  const userImageUri = userPhotoBase64.startsWith("data:")
    ? userPhotoBase64
    : `data:image/jpeg;base64,${userPhotoBase64}`;

  const garmentImageUri = outfitPhotoBase64.startsWith("data:")
    ? outfitPhotoBase64
    : `data:image/jpeg;base64,${outfitPhotoBase64}`;

  console.log("Sending request to Replicate (IDM-VTON)...");

  try {
    // Using the IDM-VTON model (cuuupid version)
    // Model version: cuuupid/idm-vton
    const output = await replicate.run(
      "cuuupid/idm-vton:0513734a452173b8173e907e3a59d19a36266e55b48528559432bd21c7d7e985",
      {
        input: {
          human_img: userImageUri,
          garm_img: garmentImageUri,

          garment_des: `
Use Image 1 (human_img) as the original person.
Use Image 2 (garm_img) as the jacket.

STRICT REQUIREMENTS:
- Do NOT change the person’s identity, face, eyes, skin tone, hair, or expression.
- Do NOT change the person’s body shape, pose, or hand positions.
- Do NOT modify the background or environment.
- Keep the person EXACTLY the same as in the original image.

JACKET APPLICATION RULES:
- Replace ONLY the upper clothing with the jacket from Image 2.
- The jacket must fit naturally on the person's torso, shoulders, and arms.
- Align the jacket collar, zipper, neckline, and sleeves accurately with the body.
- Maintain correct jacket thickness, structure, and layering.
- Ensure the jacket adapts realistically to the person’s pose and angle.
- Preserve natural fabric behavior:
  • proper wrinkles  
  • material texture  
  • realistic shadows  
  • consistent lighting  
- No artifacts, ghost sleeves, stretched textures, or shape deformations.
- Fully replace the old clothing — do NOT blend them.

OUTPUT:
A high-quality, realistic image of the same person wearing the jacket from Image 2, with accurate fit, perfect alignment, and photo-realistic details.
`,

          // Recommended settings for try-on realism
          steps: 40, // higher steps = better jacket details
          seed: 42, // consistent result
          crop: false, // prevents jacket being cut off
          scale: 1.2, // enhances jacket clarity & structure
        },
      }
    );

    console.log("Replicate Output Type:", output?.constructor?.name);

    // Helper function to convert stream to base64
    const streamToBase64 = async (stream) => {
      const blob = await new Response(stream).blob();
      const arrayBuffer = await blob.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      return `data:image/png;base64,${buffer.toString("base64")}`;
    };

    // Handle ReadableStream (Web Stream) directly
    if (output instanceof ReadableStream) {
      console.log("Output is a ReadableStream, converting to base64...");
      return await streamToBase64(output);
    }

    // Handle Array output
    if (Array.isArray(output)) {
      const firstItem = output[0];
      // If the item in the array is a stream
      if (firstItem instanceof ReadableStream) {
        console.log("Output is an Array with ReadableStream, converting...");
        return await streamToBase64(firstItem);
      }
      return firstItem;
    }

    return output;
  } catch (error) {
    console.error("Replicate API Error:", error);
    throw error;
  }
};

export default callReplicate;
