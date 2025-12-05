/*
  TODO: Integrate with Firebase Auth or your preferred OAuth provider.
  
  Integration Steps:
  1. Install firebase: npm install firebase
  2. Initialize firebase in a separate file (e.g., src/lib/firebase.ts)
  3. Replace handleEmailSignUp and handleGoogleSignIn with actual Firebase auth calls.
*/

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInWithGoogle } from "../lib/firebase";
import { AuthCard } from "../components/AuthCard";
import { InputField } from "../components/InputField";
import { Button } from "../components/ui/Button";
import { SocialSignInButton } from "../components/SocialSignInButton";
import { DividerWithText } from "../components/DividerWithText";
import { Mail, Lock, User } from "lucide-react";

export function SignUpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/upload";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5001/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Sign up failed");
      }

      console.log("Signed up successfully", data);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("uid", data.data.uid);

      navigate(from);
    } catch (error) {
      console.error("Sign up failed", error);
      setErrors({
        form:
          error instanceof Error
            ? error.message
            : "Failed to create account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken();

      const response = await fetch("http://localhost:5001/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Google authentication failed");
      }

      console.log("Google Sign Up Success", data);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("uid", data.data.uid);
      localStorage.setItem("authToken", idToken);
      navigate(from);
    } catch (error: any) {
      console.error("Google Sign Up Failed", error);
      if (error.code === "auth/account-exists-with-different-credential") {
        setErrors({
          form: "An account with this email already exists. Please sign in with your email and password.",
        });
      } else if (error.code === "auth/popup-closed-by-user") {
        setErrors({ form: "Sign in cancelled." });
      } else {
        setErrors({
          form: "Google Sign Up Failed. " + (error.message || ""),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Get personalized try-ons and accurate size recommendations."
    >
      <form onSubmit={handleEmailSignUp} className="space-y-4">
        <InputField
          id="fullName"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          icon={<User size={18} />}
          value={formData.fullName}
          onChange={(e) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          error={errors.fullName}
        />

        <InputField
          id="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          icon={<Mail size={18} />}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
        />

        <InputField
          id="password"
          type="password"
          label="Password"
          placeholder="Create a password"
          icon={<Lock size={18} />}
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          error={errors.password}
        />

        {errors.form && (
          <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
            {errors.form}
          </div>
        )}

        <div className="text-xs text-gray-500 text-center px-4">
          By signing up you agree to our{" "}
          <a href="#" className="text-primary hover:underline">
            Terms
          </a>{" "}
          &{" "}
          <a href="#" className="text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </span>
          ) : (
            "Sign up"
          )}
        </Button>
      </form>

      <DividerWithText />

      <SocialSignInButton
        provider="google"
        onClick={handleGoogleSignIn}
        isLoading={isLoading}
      />

      <div className="mt-8 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="font-semibold text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </AuthCard>
  );
}
