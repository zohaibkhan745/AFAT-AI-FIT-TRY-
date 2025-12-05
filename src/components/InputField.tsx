import React from "react";
import { cn } from "../lib/utils";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <label
          className="text-sm font-medium text-gray-700 block"
          htmlFor={props.id}
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "w-full h-11 px-4 rounded-xl border bg-white/50 transition-all focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none disabled:opacity-50 disabled:cursor-not-allowed",
              icon ? "pl-10" : "",
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-gray-200",
              className
            )}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
              {icon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

InputField.displayName = "InputField";
