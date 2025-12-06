import { Loader2 } from "lucide-react";

export function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
      </div>
      <p className="text-gray-500 font-medium animate-pulse">
        AI is measuring your dimensions...
      </p>
    </div>
  );
}
