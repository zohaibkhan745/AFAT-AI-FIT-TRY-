import React from "react";
import { Card } from "./ui/Card";
import { cn } from "../lib/utils";
import { Shirt } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  subtitle,
  children,
  className,
}: AuthCardProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gray-50">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-200/30 blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl" />
      </div>

      <Card
        className={cn(
          "w-full max-w-md p-8 backdrop-blur-xl bg-white/80 border-white/40 shadow-2xl",
          className
        )}
      >
        <div className="flex flex-col items-center text-center mb-8">
          <Link to="/" className="mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Shirt size={24} />
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        {children}
      </Card>
    </div>
  );
}
