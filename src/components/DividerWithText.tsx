interface DividerWithTextProps {
  text?: string;
}

export function DividerWithText({ text = "or" }: DividerWithTextProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-200"></div>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-gray-400 font-medium tracking-wider">
          {text}
        </span>
      </div>
    </div>
  );
}
