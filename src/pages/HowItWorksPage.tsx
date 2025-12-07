import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import {
  Upload,
  Sparkles,
  Image,
  Zap,
  CheckCircle,
  ArrowRight,
  Camera,
  Shirt,
  Download,
} from "lucide-react";

export function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Upload Your Photo",
      description:
        "Take or upload a clear, full-body photo of yourself. Stand straight, face the camera, and ensure good lighting for best results.",
      icon: Upload,
      color: "from-blue-500 to-cyan-500",
      tips: [
        "Stand against a plain background",
        "Wear fitted clothing",
        "Face the camera directly",
      ],
    },
    {
      number: "02",
      title: "Choose Your Outfit",
      description:
        "Select the clothing item you want to try on. Upload a product image or choose from our catalog of supported styles.",
      icon: Shirt,
      color: "from-purple-500 to-pink-500",
      tips: [
        "Use clear product photos",
        "Ensure the garment is visible",
        "Try different styles",
      ],
    },
    {
      number: "03",
      title: "AI Magic Happens",
      description:
        "Our advanced AI analyzes your body shape, pose, and the garment details to create a realistic virtual try-on in seconds.",
      icon: Sparkles,
      color: "from-orange-500 to-red-500",
      tips: [
        "Processing takes 5-10 seconds",
        "AI adjusts for lighting",
        "Maintains natural fit",
      ],
    },
    {
      number: "04",
      title: "View & Download",
      description:
        "See yourself wearing the outfit! Download your result, share it, or try more styles. Make confident purchase decisions.",
      icon: Download,
      color: "from-green-500 to-emerald-500",
      tips: [
        "High-quality output",
        "Share with friends",
        "Try multiple outfits",
      ],
    },
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Get results in under 10 seconds with our optimized AI processing",
    },
    {
      icon: Image,
      title: "Realistic Results",
      description:
        "Advanced algorithms ensure natural-looking, accurate virtual try-ons",
    },
    {
      icon: CheckCircle,
      title: "No Returns Needed",
      description:
        "See how clothes fit before buying, reducing returns and waste",
    },
    {
      icon: Camera,
      title: "Easy to Use",
      description:
        "Simple 4-step process with instant camera capture or upload",
    },
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-50/50 to-transparent dark:from-primary/10 dark:via-purple-900/20" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-primary/20 shadow-sm mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI-Powered Virtual Try-On
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
              How It{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                Works
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Experience the future of online shopping. Try on clothes virtually
              in just 4 simple steps with our cutting-edge AI technology.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-12 sm:mb-20">
            {[
              { label: "Processing Time", value: "< 10s" },
              { label: "Accuracy Rate", value: "95%" },
              { label: "Happy Users", value: "50K+" },
              { label: "Outfits Tried", value: "1M+" },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 sm:p-6 text-center shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:scale-105"
              >
                <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="space-y-12 sm:space-y-20">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`flex flex-col ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } gap-6 sm:gap-8 lg:gap-12 items-center`}
                >
                  {/* Content */}
                  <div className="flex-1 w-full">
                    <div className="max-w-xl">
                      <div
                        className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${step.color} text-white font-bold text-sm mb-4`}
                      >
                        Step {step.number}
                      </div>

                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        {step.title}
                      </h2>

                      <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                        {step.description}
                      </p>

                      {/* Tips */}
                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Pro Tips:
                        </p>
                        {step.tips.map((tip, tipIndex) => (
                          <div
                            key={tipIndex}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                              {tip}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Visual */}
                  <div className="flex-1 w-full">
                    <div
                      className={`relative aspect-square max-w-md mx-auto bg-gradient-to-br ${step.color} rounded-3xl shadow-2xl p-6 sm:p-8 overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                      <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
                        <Icon
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 mb-4 sm:mb-6 opacity-90"
                          strokeWidth={1.5}
                        />
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-center">
                          {step.title}
                        </p>
                      </div>
                      {/* Decorative Elements */}
                      <div className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-white/20 rounded-full blur-3xl" />
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 sm:w-40 sm:h-40 bg-white/20 rounded-full blur-3xl" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Why Choose Our Virtual Try-On?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Advanced AI technology meets simple user experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-primary to-purple-600 rounded-3xl p-8 sm:p-12 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
              Ready to Try It Yourself?
            </h2>
            <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Experience the magic of AI-powered virtual try-on. Upload your
              photo and see yourself in new outfits instantly!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/upload">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 border-white group"
                >
                  Start Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/check-size">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white/10"
                >
                  Check Your Size
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
