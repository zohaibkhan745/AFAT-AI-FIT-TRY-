import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export function HomePage() {
  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-white/20 dark:from-purple-900/20 dark:to-gray-900/20 -z-10 transition-colors duration-300" />
        <div className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-purple-100 dark:border-purple-800 shadow-sm mb-8 animate-fade-in-up transition-colors duration-300">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Powered by Advanced AI
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-6 max-w-4xl transition-colors duration-300">
            Try Before You Buy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              Powered by AI
            </span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl leading-relaxed transition-colors duration-300">
            Upload your photo, try outfits virtually, and get accurate size
            recommendations instantly. No more returns, just perfect fits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/upload">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/upload?demo=1">
              <Button size="lg" variant="outline" className="group border-2 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20">
                <Sparkles className="mr-2 w-5 h-5 text-purple-600 dark:text-purple-400" />
                Try Demo
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span>Virtual Try-On</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
