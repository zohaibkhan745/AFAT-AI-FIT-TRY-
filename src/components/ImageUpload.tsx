import React, { useState, useRef } from "react";
import { Upload, Camera, X } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { CameraCapture } from "./CameraCapture";
import { cn } from "../lib/utils";

interface ImageUploadProps {
  title: string;
  onImageSelect: (file: File | string) => void;
  preview?: string;
  allowCamera?: boolean;
}

export function ImageUpload({
  title,
  onImageSelect,
  preview,
  allowCamera = true,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageSelect(e.target.files[0]);
    }
  };

  const handleCameraCapture = (imageSrc: string) => {
    onImageSelect(imageSrc);
    setShowCamera(false);
  };

  return (
    <>
      <Card className="h-full flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        </div>

        <div className="flex-1 p-6 flex flex-col">
          {preview ? (
            <div className="relative flex-1 rounded-xl overflow-hidden bg-gray-50 group">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onImageSelect("")} // Clear image logic needs to be handled by parent really, but passing empty string or null
                >
                  <X className="mr-2 h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors cursor-pointer",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                <Upload size={32} />
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Click or drag image here
              </p>
              <p className="text-xs text-gray-500 text-center max-w-[200px]">
                Supports JPG, PNG, WEBP (Max 5MB)
              </p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
          )}

          {allowCamera && !preview && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setShowCamera(true)}
              >
                <Camera className="mr-2 h-4 w-4" /> Use Camera
              </Button>
            </div>
          )}
        </div>
      </Card>

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </>
  );
}
