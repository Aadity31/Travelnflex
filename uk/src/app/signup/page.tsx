"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleGoogleLogin = () => {
  signIn("google", { callbackUrl: "/" });
};

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Your signup logic here
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
      {/* LEFT – Enhanced Branding */}
      <div className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10">
          <div className="mb-6">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Begin Your Sacred Journey
          </h1>
          <p className="text-white/90 text-base max-w-md leading-relaxed mb-6">
            Create your account to explore sacred destinations, save your
            spiritual journeys, and manage your pilgrimage experiences with
            ease.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-2 mt-8">
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium">
              🗺️ Explore Destinations
            </span>
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium">
              📖 Save Journeys
            </span>
            <span className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium">
              ✨ Track Experiences
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT – Enhanced Signup Card */}
      <div className="flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-6 text-center">
            <div className="inline-flex w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl items-center justify-center mb-3">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
              </svg>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl shadow-orange-500/10 p-6 border border-gray-100">
            <div className="mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                Create Account
              </h2>
              <p className="text-gray-600 text-sm">
                Sign up to get started on your spiritual journey
              </p>
            </div>

            {/* OAuth Signup with Icon */}
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2.5 border-2 border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 hover:border-orange-300 transition-all duration-300 group"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
              />
              <span className="text-gray-700">Sign up with Google</span>
            </button>

            {/* Enhanced Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <span className="text-xs text-gray-500 font-medium">OR</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
            </div>

            {/* Enhanced Form with Icons */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name Input */}
              <div className="group">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="group">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Input with Toggle */}
              <div className="group">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
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

              {/* Enhanced Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 text-sm rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-5"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
                    Creating Account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            {/* Enhanced Footer */}
            <div className="mt-5 text-center">
              <p className="text-xs text-gray-600">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-orange-600 font-semibold hover:text-red-600 hover:underline transition-colors"
                >
                  Login
                </Link>
              </p>
            </div>

            {/* Terms & Privacy */}
            <p className="text-[10px] text-gray-500 text-center mt-4 leading-relaxed">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-orange-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-orange-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
