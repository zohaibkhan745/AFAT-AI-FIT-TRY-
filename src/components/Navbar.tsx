import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/Button";
import { Shirt, Menu, X } from "lucide-react";
import { cn } from "../lib/utils";
import { UserMenu } from "./UserMenu";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        : "text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary"
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 !rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 dark:from-purple-500 dark:to-blue-500 flex items-center justify-center text-white shadow-lg transition-all duration-300">
            <Shirt size={20} strokeWidth={2.5} className="shrink-0" />
          </div>
          <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
            AI Fit & Try
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <Link to="/" className={getLinkClasses("/")}>
            Home
          </Link>
          <Link to="/upload" className={getLinkClasses("/upload")}>
            Try On
          </Link>
          <Link to="/check-size" className={getLinkClasses("/check-size")}>
            Check Size
          </Link>
          <Link to="/how-it-works" className={getLinkClasses("/how-it-works")}>
            How it Works
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <UserMenu user={user} onLogout={handleLogout} />
          ) : (
            <Link to="/signin">
              <Button variant="primary" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center gap-2">
          {isAuthenticated && <UserMenu user={user} onLogout={handleLogout} />}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link
              to="/"
              className={cn(
                "block py-2 px-3 rounded-lg transition-colors",
                isActive("/")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/upload"
              className={cn(
                "block py-2 px-3 rounded-lg transition-colors",
                isActive("/upload")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Try On
            </Link>
            <Link
              to="/check-size"
              className={cn(
                "block py-2 px-3 rounded-lg transition-colors",
                isActive("/check-size")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Check Size
            </Link>
            <Link
              to="/how-it-works"
              className={cn(
                "block py-2 px-3 rounded-lg transition-colors",
                isActive("/how-it-works")
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              How it Works
            </Link>
            {!isAuthenticated && (
              <Link
                to="/signin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block"
              >
                <Button variant="primary" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
