import { useState } from "react";
import { ImageUpload } from "../components/ImageUpload";
import { ResultCard } from "../components/ResultCard";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { Button } from "../components/ui/Button";
import { Ruler, ArrowRight } from "lucide-react";

export function SizeMeasurementPage() {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any | null>(null);

  const handleImageSelect = (file: File | string) => {
    if (typeof file === "string") {
      setImage(file);
    } else {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setResults(null); // Reset results on new image
  };

  const handleMeasure = async () => {
    if (!image) return;

    setIsAnalyzing(true);

    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setResults({
        shoulder: 44,
        chest: 98,
        waist: 84,
        hip: 100,
        height: 178,
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl text-primary mb-2">
            <Ruler size={32} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Check Your Perfect Size
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a full-body photo or take a picture to let our AI precisely
            measure your body dimensions for the perfect fit.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Upload */}
          <div
            className="space-y-6 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-6 backdrop-blur-xl">
              <ImageUpload
                title="Upload Full Body Photo"
                onImageSelect={handleImageSelect}
                preview={image || undefined}
                allowCamera={true}
              />

              <div className="mt-6">
                <Button
                  onClick={handleMeasure}
                  disabled={!image || isAnalyzing}
                  className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300"
                >
                  {isAnalyzing ? (
                    "Analyzing..."
                  ) : (
                    <span className="flex items-center gap-2">
                      Measure My Size <ArrowRight size={20} />
                    </span>
                  )}
                </Button>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
              <h4 className="font-semibold text-blue-900 mb-2">
                For best results:
              </h4>
              <ul className="space-y-2 text-sm text-blue-800/80">
                <li>• Wear tight-fitting clothes</li>
                <li>• Stand straight facing the camera</li>
                <li>• Ensure good lighting</li>
                <li>• Include your full body from head to toe</li>
              </ul>
            </div>
          </div>

          {/* Right Column: Results */}
          <div
            className="space-y-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            {isAnalyzing ? (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-12 min-h-[400px] flex items-center justify-center">
                <LoadingIndicator />
              </div>
            ) : results ? (
              <ResultCard measurements={results} />
            ) : (
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-12 min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 text-gray-400 border-dashed border-2">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-2">
                  <Ruler size={32} className="opacity-50" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No measurements yet
                </h3>
                <p className="max-w-xs mx-auto">
                  Upload a photo and click "Measure My Size" to see your
                  AI-generated dimensions here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
