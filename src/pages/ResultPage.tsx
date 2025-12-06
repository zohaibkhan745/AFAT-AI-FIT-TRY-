import { useLocation, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Download, RefreshCw } from "lucide-react";

export function ResultPage() {
  const location = useLocation();
  const {
    userImage,
    outfitImage,
    resultImage: generatedImage,
  } = location.state || {};

  // Use the generated image from API, or fallback to userImage for preview if testing without API
  const resultImage = generatedImage || userImage;

  const handleDownload = () => {
    if (!resultImage) return;

    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "virtual-try-on-result.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Your Virtual Try-On Result
          </h1>
          <p className="text-gray-600">
            Here is how you look in your new outfit!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Inputs (Small) */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <p className="text-xs text-center py-2 text-gray-500 font-medium">
                Original Photo
              </p>
              {userImage && (
                <img
                  src={userImage}
                  alt="User"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <p className="text-xs text-center py-2 text-gray-500 font-medium">
                Outfit
              </p>
              {outfitImage && (
                <img
                  src={outfitImage}
                  alt="Outfit"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Result (Large) */}
          <div className="md:col-span-2">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 shadow-2xl border border-white/20 relative group">
              {resultImage ? (
                <img
                  src={resultImage}
                  alt="Result"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No result generated
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-8">
                <Button
                  variant="secondary"
                  className="mr-4"
                  onClick={handleDownload}
                >
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link to="/upload">
            <Button variant="outline" size="lg">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Another Outfit
            </Button>
          </Link>
          <Button size="lg">Shop This Look</Button>
        </div>
      </div>
    </div>
  );
}
