import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { Shirt } from "lucide-react";
import { cn } from "../lib/utils";
import { UserMenu } from "./UserMenu";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  }>();

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem("isAuthenticated") === "true";
      setIsAuthenticated(isAuth);
      if (isAuth) {
        setUser({
          displayName: localStorage.getItem("displayName"),
          email: localStorage.getItem("email"),
          photoURL: localStorage.getItem("photoURL"),
        });
      }
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.clear();
      setIsAuthenticated(false);
      navigate("/signin");
      window.dispatchEvent(new Event("auth-change"));
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Shirt size={20} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            AI Fit & Try
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={getLinkClasses("/")}>
            Home
          </Link>
          <Link to="/upload" className={getLinkClasses("/upload")}>
            Try On
          </Link>
          <Link to="/check-size" className={getLinkClasses("/check-size")}>
            Check Size
          </Link>
          <a
            href="#"
            className="text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            How it Works
          </a>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <Link to="/signin">
              <Button
                variant="primary"
                size="sm"
                className="hidden sm:inline-flex"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
