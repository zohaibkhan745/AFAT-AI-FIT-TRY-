import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "../components/ImageUpload";
import { Button } from "../components/ui/Button";
import { Wand2, Sparkles, Image as ImageIcon } from "lucide-react";
import demoPerson1Img from "../assets/zohaib image.jpg";
import demoPerson2Img from "../assets/full body gemini.png";
import demoOutfitImg from "../assets/red_sweater.png";

// Demo images
const DEMO_SETS = [
  { person: demoPerson1Img, outfit: demoOutfitImg, name: "Demo 1" },
  { person: demoPerson2Img, outfit: demoOutfitImg, name: "Demo 2" },
];

// Loading messages that rotate during generation
const LOADING_MESSAGES = [
  "Analyzing your photo…",
  "Preparing garment…",
  "Generating AI try-on…",
  "Finalizing details…",
];

export function UploadPage() {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [userFile, setUserFile] = useState<File | null>(null);
  const [outfitFile, setOutfitFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  // Load demo images on mount if demo parameter is present
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const demoParam = params.get("demo");
    if (demoParam === "1") {
      loadDemoImages(0); // Load Demo 1
    }
  }, []);

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

  const loadDemoImages = async (demoIndex: number) => {
    try {
      setError(null);
      const demo = DEMO_SETS[demoIndex];

      // Helper function to convert blob to data URL
      const blobToDataURL = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };

      // Fetch and convert person image
      const personResponse = await fetch(demo.person);
      if (!personResponse.ok) throw new Error("Failed to fetch person image");
      const personBlob = await personResponse.blob();
      const personDataURL = await blobToDataURL(personBlob);
      const personFile = dataURLtoFile(personDataURL, "demo-person.png");

      // Fetch and convert outfit image
      const outfitResponse = await fetch(demo.outfit);
      if (!outfitResponse.ok) throw new Error("Failed to fetch outfit image");
      const outfitBlob = await outfitResponse.blob();
      const outfitDataURL = await blobToDataURL(outfitBlob);
      const outfitFile = dataURLtoFile(outfitDataURL, "demo-outfit.png");

      // Set the files and previews
      setUserFile(personFile);
      setUserImage(personDataURL);
      setOutfitFile(outfitFile);
      setOutfitImage(outfitDataURL);
    } catch (err) {
      console.error("Failed to load demo images:", err);
      setError("Failed to load demo images. Please try uploading your own.");
    }
  };

  // Rotate loading messages every 3.5 seconds
  useEffect(() => {
    if (!isGenerating) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isGenerating]);

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

        {/* Demo Images Buttons */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <ImageIcon className="h-5 w-5" />
            <p className="text-sm font-medium">Quick Start - Try Demo Images</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {DEMO_SETS.map((demo, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                onClick={() => loadDemoImages(index)}
                className="gap-3 px-6 py-6 text-base font-semibold border-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-300 shadow-md hover:shadow-xl"
              >
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span>{demo.name}</span>
              </Button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Click a demo to instantly load sample images and test the try-on feature
          </p>
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
          {isGenerating && (
            <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg border border-blue-200 dark:border-blue-800 max-w-md text-center transition-colors animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="animate-spin text-2xl">⏳</span>
                <p className="font-medium text-lg">
                  {LOADING_MESSAGES[loadingMessageIndex]}
                </p>
              </div>
              <p className="text-sm mt-1">This may take 30-60 seconds</p>
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
