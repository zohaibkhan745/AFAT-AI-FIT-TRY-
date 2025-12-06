import Replicate from "replicate";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function getModelVersion() {
  try {
    console.log("Fetching model version for cuuupid/idm-vton...");
    const model = await replicate.models.get("cuuupid", "idm-vton");
    const latestVersion = model.latest_version;
    console.log("Latest Version ID:", latestVersion.id);
  } catch (error) {
    console.error("Error fetching model version:", error);
  }
}

getModelVersion();
