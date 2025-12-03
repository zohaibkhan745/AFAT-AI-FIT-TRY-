import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

export function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-white/20 -z-10" />
        <div className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-100 shadow-sm mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">
              Powered by Advanced AI
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 max-w-4xl">
            Try Before You Buy <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Powered by AI
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
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
            <Button variant="outline" size="lg">
              View Demo
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-4 md:gap-8 text-sm font-medium text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Virtual Try-On</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Size Recommendations</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Section */}
      <section className="container mx-auto px-6 pb-24">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100 aspect-[16/9] bg-gray-100">
          {/* Placeholder for a nice hero image or demo video */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200">
            <p className="text-gray-400 font-medium">App Demo Preview</p>
          </div>
        </div>
      </section>
    </div>
  );
}
