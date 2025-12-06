import { Ruler, CheckCircle2 } from "lucide-react";

interface Measurement {
  label: string;
  value: string;
  unit: string;
}

interface ResultCardProps {
  measurements?: {
    shoulder?: number;
    chest?: number;
    waist?: number;
    hip?: number;
    height?: number;
  };
}

export function ResultCard({ measurements }: ResultCardProps) {
  // Mock data if no measurements provided yet
  const data: Measurement[] = [
    {
      label: "Shoulder Width",
      value: measurements?.shoulder?.toString() || "42",
      unit: "cm",
    },
    {
      label: "Chest",
      value: measurements?.chest?.toString() || "96",
      unit: "cm",
    },
    {
      label: "Waist",
      value: measurements?.waist?.toString() || "82",
      unit: "cm",
    },
    { label: "Hips", value: measurements?.hip?.toString() || "98", unit: "cm" },
    {
      label: "Height",
      value: measurements?.height?.toString() || "175",
      unit: "cm",
    },
  ];

  return (
    <div className="w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Ruler size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Your Measurements
            </h3>
            <p className="text-sm text-gray-500">
              AI-estimated body dimensions
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div
            key={index}
            className="group p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-primary/20 hover:shadow-md transition-all duration-300"
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              {item.label}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">
                {item.value}
              </span>
              <span className="text-sm text-gray-400">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
        <CheckCircle2 size={16} className="text-green-500" />
        <span>High confidence score (98%)</span>
      </div>
    </div>
  );
}
