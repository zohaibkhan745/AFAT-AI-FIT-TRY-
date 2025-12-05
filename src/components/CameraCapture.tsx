import React, { useRef, useState, useCallback } from "react";
import { Button } from "./ui/Button";
import { X, RefreshCw } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  onClose: () => void;
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError(
        "Unable to access camera. Please ensure you have granted permission."
      );
      console.error(err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageSrc = canvas.toDataURL("image/jpeg");
        onCapture(imageSrc);
        stopCamera();
      }
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-white hover:bg-white/20"
          >
            <X size={24} />
          </Button>
        </div>

        {error ? (
          <div className="flex flex-col items-center justify-center h-[400px] text-white p-8 text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              onClick={startCamera}
              variant="outline"
              className="text-white border-white/20"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </div>
        ) : (
          <div className="relative aspect-[3/4] md:aspect-[4/3] bg-gray-900">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-0 right-0 flex justify-center">
              <button
                onClick={captureImage}
                className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
              >
                <div className="w-12 h-12 rounded-full bg-white border-2 border-black" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
