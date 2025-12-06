import React, { useState, useRef } from "react";
import { Upload, Camera, X, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/Button";
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
    <div className="w-full">
      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <div
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ease-in-out text-center group",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-gray-200 hover:border-primary/30 hover:bg-gray-50/50",
          preview
            ? "border-none p-0 overflow-hidden bg-gray-100 shadow-inner"
            : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {preview ? (
          <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onImageSelect("");
              }}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-gray-900 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 transform hover:scale-110"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div className="space-y-6 py-8">
            <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Upload size={36} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500 mt-2">
                Drag and drop or click to upload
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto rounded-xl"
              >
                <ImageIcon className="mr-2 h-4 w-4" /> Select File
              </Button>
              {allowCamera && (
                <Button
                  variant="secondary"
                  onClick={() => setShowCamera(true)}
                  className="w-full sm:w-auto rounded-xl"
                >
                  <Camera className="mr-2 h-4 w-4" /> Use Camera
                </Button>
              )}
            </div>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
