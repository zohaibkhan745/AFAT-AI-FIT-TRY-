import { cn } from "../lib/utils";

interface UnitToggleProps {
  unit: "cm" | "in";
  onToggle: (unit: "cm" | "in") => void;
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200">
      <button
        onClick={() => onToggle("cm")}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
          unit === "cm"
            ? "bg-white text-primary shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        cm
      </button>
      <button
        onClick={() => onToggle("in")}
        className={cn(
          "px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
          unit === "in"
            ? "bg-white text-primary shadow-sm"
            : "text-gray-500 hover:text-gray-700"
        )}
      >
        inches
      </button>
    </div>
  );
}
