"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";

interface LoginFormProps {
  redirectUrl?: string;
  action?: string;
}

export default function LoginForm({ redirectUrl, action }: LoginFormProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  
  // Use passed redirectUrl or fallback to searchParams
  const finalRedirect = redirectUrl || searchParams.get("redirect");
  const finalAction = action || searchParams.get("action");

  // Check for stored booking intent on mount
  useEffect(() => {
    const storedIntent = sessionStorage.getItem("bookingIntent");
    if (storedIntent && finalAction === "book") {
      // Don't clear - will be used after login
    }
  }, [finalAction]);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    console.log("CREDENTIALS LOGIN RESULT:", res);

    if (res?.error) {
      setError(res.error);
      return;
    }

    // Handle redirect after successful login
    const storedIntent = sessionStorage.getItem("bookingIntent");
    if (storedIntent && finalAction === "book") {
      sessionStorage.removeItem("bookingIntent");
      window.location.href = "/booking/" + JSON.parse(storedIntent).destination + "/confirm";
    } else if (finalRedirect) {
      window.location.href = finalRedirect;
    } else {
      window.location.href = "/";
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);

    await signIn("google", {
      callbackUrl: finalRedirect || "/",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden px-3 sm:px-4 py-6 sm:py-8">
      {/* Background Animations - Responsive */}
      <div className="absolute top-0 right-0 w-48 h-48 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-gradient-to-br from-orange-300 to-emerald-400 rounded-full opacity-80 transform translate-x-16 sm:translate-x-24 lg:translate-x-32 -translate-y-16 sm:-translate-y-24 lg:-translate-y-32 animate-pulse"></div>

      <div
        className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-gradient-to-tr from-orange-500 to-purple-400 rounded-full opacity-70 transform -translate-x-16 sm:-translate-x-24 lg:-translate-x-32 translate-y-16 sm:translate-y-24 lg:translate-y-32 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-5 sm:p-6 border border-gray-100">
          {/* Logo & Brand */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-5 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Sacred Journey
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-5 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5 sm:mb-1">
              {finalAction === "book" ? "Login to complete booking" : "Welcome back"}
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm">
              {finalAction === "book" 
                ? "Sign in to continue with your booking" 
                : "Log in to continue your journey"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2 sm:p-2.5 bg-red-50 justify-center rounded-lg flex items-center gap-2 text-red-600 text-xs sm:text-sm mb-4">
              {error}
            </div>
          )}

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 sm:gap-2.5 border-2 border-gray-200 rounded-lg py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-gray-50 hover:border-orange-300 transition-all duration-300 group mb-4 sm:mb-5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-gray-700">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-gray-500 text-[10px] sm:text-xs font-medium">
              OR
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Email Input */}
          <div className="mb-3 sm:mb-3.5 group">
            <label className="block text-gray-700 font-medium text-[11px] sm:text-xs mb-1 sm:mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg 
                text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 bg-white
                focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-3 sm:mb-4 group">
            <label className="block text-gray-700 font-medium text-[11px] sm:text-xs mb-1 sm:mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 border-2 border-gray-200 rounded-lg 
                text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 bg-white
                focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-0 cursor-pointer"
              />
              <span className="text-[10px] sm:text-xs text-gray-700">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-[10px] sm:text-xs text-orange-600 hover:text-red-600 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-3.5 w-3.5 sm:h-4 sm:w-4"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Logging in...
              </span>
            ) : (
              "Log in"
            )}
          </button>

          {/* Sign Up Link */}
          <p className="mt-4 sm:mt-5 text-center text-[10px] sm:text-xs text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-orange-600 hover:text-red-600 hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Footer Privacy */}
        <p className="text-center text-[9px] sm:text-[10px] text-gray-500 mt-3 sm:mt-4 px-2">
          Protected by reCAPTCHA and subject to the{" "}
          <Link href="/privacy" className="text-orange-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
