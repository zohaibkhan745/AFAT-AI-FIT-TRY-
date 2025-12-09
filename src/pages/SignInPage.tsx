/*
  TODO: Integrate with Firebase Auth or your preferred OAuth provider.
  
  Integration Steps:
  1. Install firebase: npm install firebase
  2. Initialize firebase in a separate file (e.g., src/lib/firebase.ts)
  3. Replace handleEmailSignIn and handleGoogleSignIn with actual Firebase auth calls.
*/

import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signInWithGoogle } from "../lib/firebase";
import { AuthCard } from "../components/AuthCard";
import { InputField } from "../components/InputField";
import { Button } from "../components/ui/Button";
import { SocialSignInButton } from "../components/SocialSignInButton";
import { DividerWithText } from "../components/DividerWithText";
import { Mail, Lock } from "lucide-react";

export function SignInPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/upload";

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Sign in failed");
      }

      console.log("Signed in successfully", data);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("uid", data.data.uid);
      localStorage.setItem("email", formData.email); // Save email for profile

      window.dispatchEvent(new Event("auth-change"));

      navigate(from); // Redirect to previous page or default
    } catch (error) {
      console.error("Sign in failed", error);
      setErrors({
        form:
          error instanceof Error ? error.message : "Invalid email or password",
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

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
      const response = await fetch(`${API_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Google authentication failed");
      }

      console.log("Google Sign In Success", data);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("uid", data.data.uid);
      localStorage.setItem("authToken", idToken);

      if (user.displayName)
        localStorage.setItem("displayName", user.displayName);
      if (user.email) localStorage.setItem("email", user.email);
      if (user.photoURL) localStorage.setItem("photoURL", user.photoURL);

      window.dispatchEvent(new Event("auth-change"));

      navigate(from);
    } catch (error: any) {
      console.error("Google Sign In Failed", error);
      if (error.code === "auth/account-exists-with-different-credential") {
        setErrors({
          form: "An account with this email already exists. Please sign in with your email and password.",
        });
      } else if (error.code === "auth/popup-closed-by-user") {
        setErrors({ form: "Sign in cancelled." });
      } else {
        setErrors({
          form: "Google Sign In Failed. " + (error.message || ""),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to AI Fit & Try"
    >
      <form onSubmit={handleEmailSignIn} className="space-y-4">
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

        <div className="space-y-1">
          <InputField
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            icon={<Lock size={18} />}
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            error={errors.password}
          />
          <div className="flex justify-end">
            <Link
              to="#"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {errors.form && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm text-center border border-red-200 dark:border-red-800 transition-colors">
            {errors.form}
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <DividerWithText />

      <SocialSignInButton
        provider="google"
        onClick={handleGoogleSignIn}
        isLoading={isLoading}
      />

      <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-300 transition-colors">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-semibold text-primary dark:text-purple-400 hover:underline transition-colors"
        >
          Create account
        </Link>
      </div>
    </AuthCard>
  );
}
