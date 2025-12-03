import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageUpload } from "../components/ImageUpload";
import { Button } from "../components/ui/Button";
import { Wand2 } from "lucide-react";

export function UploadPage() {
  const navigate = useNavigate();
  const [userImage, setUserImage] = useState<string | null>(null);
  const [outfitImage, setOutfitImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleUserImageSelect = (file: File | string) => {
    if (typeof file === "string") {
      setUserImage(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setUserImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOutfitImageSelect = (file: File | string) => {
    if (typeof file === "string") {
      setOutfitImage(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => setOutfitImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => {
    if (!userImage || !outfitImage) return;

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      navigate("/result", { state: { userImage, outfitImage } });
    }, 2000);
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
          <div className="h-[500px]">
            <ImageUpload
              title="Upload Your Photo"
              onImageSelect={handleUserImageSelect}
              preview={userImage || undefined}
              allowCamera={true}
            />
          </div>
          <div className="h-[500px]">
            <ImageUpload
              title="Upload Outfit Image"
              onImageSelect={handleOutfitImageSelect}
              preview={outfitImage || undefined}
              allowCamera={false}
            />
          </div>
        </div>

        <div className="flex justify-center">
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
