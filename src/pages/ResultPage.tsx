import { useLocation, Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Download, RefreshCw, Ruler } from "lucide-react";

export function ResultPage() {
  const location = useLocation();
  const {
    userImage,
    outfitImage,
    resultImage: generatedImage,
  } = location.state || {};

  // Use the generated image from API, or fallback to userImage for preview if testing without API
  const resultImage = generatedImage || userImage;

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
                <Button variant="secondary" className="mr-4">
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Size Recommendation */}
        <Card className="mb-12 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-100">
          <div className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-purple-600 shrink-0">
              <Ruler size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Recommended Size For You
              </h3>
              <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                <span className="text-4xl font-bold text-purple-600">L</span>
                <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                  92% Match
                </span>
              </div>
              <p className="text-gray-600 text-sm">
                Based on your body measurements: Shoulder <strong>42cm</strong>,
                Chest <strong>98cm</strong>, Waist <strong>82cm</strong>
              </p>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                Powered by AI Sizing
              </p>
            </div>
          </div>
        </Card>

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
