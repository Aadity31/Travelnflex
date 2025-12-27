"use client";

import Link from "next/link";
import { useState, ChangeEvent } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";    
export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const handleLogin = async () => {
  const res = await fetch("/api/auth/manual-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      rememberMe,
    }),
  });

  if (!res.ok) {
    alert("Invalid email or password");
    return;
  }

  // login successful
  window.location.href = "/";
};


  const handleGoogleLogin = () => {
  signIn("google", { callbackUrl: "/" });
};

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setPassword(e.target.value);
  };

  const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRememberMe(e.target.checked);
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden">
      {/* Enhanced Animated Background Circles - Original Colors */}
      {/* Top Right Circle - Orange to Emerald */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300 to-emerald-400 rounded-full opacity-80 transform translate-x-32 -translate-y-32 animate-pulse"></div>

      {/* Bottom Left Circle - Orange to Purple */}
      <div
        className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-orange-500 to-purple-400 rounded-full opacity-70 transform -translate-x-32 translate-y-32 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Sacred Journey
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Welcome back
            </h1>
            <p className="text-gray-600 text-sm">
              Log in to continue your journey
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2.5 border-2 border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 hover:border-orange-300 transition-all duration-300 group mb-5"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
            />
            <span className="text-gray-700">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-gray-500 text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Email Input */}
          <div className="mb-3.5 group">
            <label className="block text-gray-700 font-medium text-xs mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 rounded-lg 
                text-sm text-gray-900 placeholder:text-gray-400 bg-white
                focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-3 group">
            <label className="block text-gray-700 font-medium text-xs mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={handlePasswordChange}
                className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-lg 
                text-sm text-gray-900 placeholder:text-gray-400 bg-white
                focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between mb-5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 cursor-pointer"
              />
              <span className="text-xs text-gray-700">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-xs text-orange-600 hover:text-red-600 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full py-2.5 text-sm rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/30"
          >
            Log in
          </button>

          {/* Signup Link */}
          <p className="mt-5 text-center text-xs text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-orange-600 hover:text-red-600 hover:underline transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-[10px] text-gray-500 mt-4">
          Protected by reCAPTCHA and subject to the{" "}
          <Link href="/privacy" className="text-orange-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
