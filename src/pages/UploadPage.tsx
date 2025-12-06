import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "../components/ImageUpload";
import { Button } from "../components/ui/Button";
import { Wand2 } from "lucide-react";

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
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Create Your Virtual Look
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Upload a full-body photo of yourself and the outfit you want to try
            on. Our AI will do the magic.
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
            <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 max-w-md text-center">
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
