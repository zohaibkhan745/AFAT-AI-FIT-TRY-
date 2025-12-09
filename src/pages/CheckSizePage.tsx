import { useState } from "react";
import { ImageUpload } from "../components/ImageUpload";
import { Button } from "../components/ui/Button";
import { UnitToggle } from "../components/UnitToggle";
import { LoadingIndicator } from "../components/LoadingIndicator";
import { Ruler, Download, RefreshCw, Info, AlertCircle } from "lucide-react";
import { convertValue } from "../utils/convertUnits";
import { Card } from "../components/ui/Card";

export function CheckSizePage() {
  const [activeTab, setActiveTab] = useState<"upload" | "camera">("upload");
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [isMeasuring, setIsMeasuring] = useState(false);
  const [result, setResult] = useState<{
    height: number;
    confidence: number;
  } | null>(null);

  // Calibration state
  const [calibrationMode, setCalibrationMode] = useState<
    "none" | "object" | "height"
  >("none");
  const [knownHeight, setKnownHeight] = useState<string>("");
  const [refObjectHeight, setRefObjectHeight] = useState<string>("8.56"); // Credit card default

  const handleImageSelect = (file: File | string) => {
    if (typeof file === "string") {
      setImage(file);
      // Convert data URI to File if needed for API
      fetch(file)
        .then((res) => res.blob())
        .then((blob) => {
          setImageFile(
            new File([blob], "camera-capture.jpg", { type: "image/jpeg" })
          );
        });
    } else {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
    setResult(null);
  };

  const handleMeasure = async () => {
    if (!imageFile) return;

    setIsMeasuring(true);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      if (calibrationMode === "height" && knownHeight) {
        formData.append("knownHeightCm", knownHeight);
      } else if (calibrationMode === "object" && refObjectHeight) {
        formData.append("referenceObjectHeightCm", refObjectHeight);
      }

      // TODO: Implement /api/measure endpoint that runs pose/height detection
      // For now, we'll simulate a response
      // const response = await fetch("/api/measure", { method: "POST", body: formData });
      // const data = await response.json();

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock response
      const mockHeight =
        calibrationMode === "height" && knownHeight
          ? parseFloat(knownHeight)
          : 172.4;

      setResult({
        height: mockHeight,
        confidence: 0.92,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsMeasuring(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const text = `My Height: ${convertValue(result.height, unit)}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-measurements.txt";
    a.click();
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Check Your Size
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload a full-body photo or use your camera. We'll measure your
            height accurately and show results in cm and inches.
          </p>
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 border border-purple-200 dark:border-purple-700 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column: Input */}
          <div className="md:col-span-2 space-y-6">
            <Card className="p-6 bg-white shadow-lg border-gray-100">
              {/* Tabs */}
              <div className="flex gap-4 mb-6 border-b border-gray-100 pb-4">
                <button
                  onClick={() => setActiveTab("upload")}
                  className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                    activeTab === "upload"
                      ? "text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Upload Photo
                  {activeTab === "upload" && (
                    <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("camera")}
                  className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                    activeTab === "camera"
                      ? "text-primary"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Use Camera
                  {activeTab === "camera" && (
                    <div className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
                <div className="ml-auto">
                  <UnitToggle unit={unit} onToggle={setUnit} />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-xl mb-6 text-sm text-blue-800 flex gap-3 items-start">
                <Info className="shrink-0 mt-0.5" size={18} />
                <ul className="list-disc list-inside space-y-1">
                  <li>Stand straight, feet together, arms relaxed at sides</li>
                  <li>Face the camera directly (front view)</li>
                  <li>Remove shoes and large outerwear</li>
                  <li>Use plain background if possible</li>
                </ul>
              </div>

              {/* Input Area */}
              <div className="min-h-[400px]">
                <ImageUpload
                  title={
                    activeTab === "upload"
                      ? "Upload Full Body Photo"
                      : "Take Photo"
                  }
                  onImageSelect={handleImageSelect}
                  preview={image || undefined}
                  allowCamera={activeTab === "camera"}
                />
              </div>

              {/* Calibration Options */}
              {image && !result && (
                <div className="mt-6 p-4 border border-gray-200 rounded-xl bg-gray-50">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Ruler size={16} /> Calibration (Optional)
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="calibration"
                        checked={calibrationMode === "none"}
                        onChange={() => setCalibrationMode("none")}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">
                        None (AI Estimate)
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="calibration"
                        checked={calibrationMode === "object"}
                        onChange={() => setCalibrationMode("object")}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">
                        Reference Object
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="calibration"
                        checked={calibrationMode === "height"}
                        onChange={() => setCalibrationMode("height")}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">
                        Known Height
                      </span>
                    </label>
                  </div>

                  {calibrationMode === "object" && (
                    <div className="mt-3 animate-fade-in">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Object Height (cm)
                      </label>
                      <select
                        value={refObjectHeight}
                        onChange={(e) => setRefObjectHeight(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="8.56">Credit Card (8.56 cm)</option>
                        <option value="29.7">A4 Paper (29.7 cm)</option>
                        <option value="custom">Custom...</option>
                      </select>
                    </div>
                  )}

                  {calibrationMode === "height" && (
                    <div className="mt-3 animate-fade-in">
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Your Height (cm)
                      </label>
                      <input
                        type="number"
                        value={knownHeight}
                        onChange={(e) => setKnownHeight(e.target.value)}
                        placeholder="e.g. 175"
                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!image || isMeasuring}
                  onClick={handleMeasure}
                >
                  {isMeasuring ? "Measuring..." : "Measure My Height"}
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Results */}
          <div className="md:col-span-1">
            {isMeasuring && (
              <div className="h-full flex items-center justify-center p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
                <LoadingIndicator message="Measuring your height... This may take a few seconds." />
              </div>
            )}

            {!isMeasuring && result && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-purple-50 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Your Result
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-primary">
                      {convertValue(result.height, unit)}
                    </span>
                  </div>

                  {/* Confidence Meter */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Confidence</span>
                      <span>{Math.round(result.confidence * 100)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          result.confidence > 0.8
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                        style={{ width: `${result.confidence * 100}%` }}
                      />
                    </div>
                    {result.confidence < 0.8 && (
                      <p className="text-xs text-yellow-600 mt-2 flex items-start gap-1">
                        <AlertCircle size={12} className="mt-0.5" />
                        Low confidence. Try a clearer photo or use calibration.
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleDownload}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Result
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      setImage(null);
                      setImageFile(null);
                      setResult(null);
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Measure Again
                  </Button>
                </div>
              </div>
            )}

            {!isMeasuring && !result && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <Ruler size={48} className="mb-4 opacity-20" />
                <p className="text-sm">
                  Upload a photo to see your measurements here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
