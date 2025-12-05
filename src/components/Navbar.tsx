import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/Button";
import { Shirt } from "lucide-react";
import { cn } from "../lib/utils";

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClasses = (path: string) => {
    return cn(
      "text-sm font-medium transition-colors relative py-1",
      isActive(path)
        ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary after:rounded-full"
        : "text-gray-600 hover:text-primary"
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/50 backdrop-blur-md">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Shirt size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            AI Fit & Try
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/home" className={getLinkClasses("/home")}>
            Home
          </Link>
          <Link to="/upload" className={getLinkClasses("/upload")}>
            Try On
          </Link>
          <a
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            How it Works
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/signin">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
