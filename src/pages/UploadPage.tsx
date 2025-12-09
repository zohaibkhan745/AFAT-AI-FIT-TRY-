import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "../components/ImageUpload";
import { Button } from "../components/ui/Button";
import { Wand2, Sparkles } from "lucide-react";
import demoPersonImg from "../assets/full body gemini.png"; // or .png
import demoOutfitImg from "../assets/red_sweater.png"; // or .png

// Demo images - you can replace these URLs with your actual demo images
const DEMO_PERSON_IMAGE = demoPersonImg;
const DEMO_OUTFIT_IMAGE = demoOutfitImg;
export function UploadPage() {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [outfitFile, setOutfitFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dataURLtoFile = (dataurl: string, filename: string) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const handleUserImageSelect = (file: File | string) => {
    if (typeof file === "string") {
      setUserImage(file);
      setUserFile(dataURLtoFile(file, "user-photo.jpg"));
    } else {
      setUserFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setUserImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOutfitImageSelect = (file: File | string) => {
    if (typeof file === "string") {
      setOutfitImage(file);
      setOutfitFile(dataURLtoFile(file, "outfit-photo.jpg"));
    } else {
      setOutfitFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setOutfitImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const loadDemoImages = async () => {
    try {
      setError(null);
      
      // Fetch the imported images and convert to File objects
      const personResponse = await fetch(DEMO_PERSON_IMAGE);
      const personBlob = await personResponse.blob();
      const personFile = new File([personBlob], "demo-person.png", { type: personBlob.type });
      
      const outfitResponse = await fetch(DEMO_OUTFIT_IMAGE);
      const outfitBlob = await outfitResponse.blob();
      const outfitFile = new File([outfitBlob], "demo-outfit.png", { type: outfitBlob.type });

      // Set the files
      setUserFile(personFile);
      setOutfitFile(outfitFile);
      
      // Set preview images (use the imported URLs directly)
      setUserImage(DEMO_PERSON_IMAGE);
      setOutfitImage(DEMO_OUTFIT_IMAGE);
    } catch (err) {
      console.error("Failed to load demo images:", err);
      setError("Failed to load demo images. Please try uploading your own.");
    }
  };

  const handleGenerate = async () => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    if (!isAuthenticated) {
      navigate("/signin", { state: { from: "/upload" } });
      return;
    }

    if (!userFile || !outfitFile) return;

    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("userPhoto", userFile);
      formData.append("outfitPhoto", outfitFile);

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_URL}/api/tryon`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to generate try-on image");
      }

      navigate("/result", {
        state: {
          userImage,
          outfitImage,
          resultImage: data.generatedImage,
        },
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Create Your Virtual Look
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors">
            Upload a full-body photo of yourself and the outfit you want to try
            on. Our AI will do the magic.
          </p>
        </div>

        {/* Demo Images Button */}
        <div className="mb-8 flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDemoImages}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Try with Demo Images</span>
            <span className="sm:hidden">Demo Images</span>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <ImageUpload
              title="Upload Your Photo"
              onImageSelect={handleUserImageSelect}
              preview={userImage || undefined}
              allowCamera={false}
            />
          </div>
          <div>
            <ImageUpload
              title="Upload Outfit Image"
              onImageSelect={handleOutfitImageSelect}
              preview={outfitImage || undefined}
              allowCamera={false}
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 max-w-md text-center transition-colors">
              {error}
            </div>
          )}
          <Button
            size="lg"
            className="w-full md:w-auto min-w-[200px]"
            disabled={!userImage || !outfitImage || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <span className="animate-spin mr-2">⏳</span> Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" /> Generate Virtual Try-On
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
