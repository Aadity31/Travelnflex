"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

export default function SignupPage() {
  const [step, setStep] = useState<"signup" | "otp">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  // Timer for resend OTP
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (data.requiresVerification) {
        setSuccess("OTP sent to your email!");
        setStep("otp");
        setTimer(60); // 60 seconds countdown
        setCanResend(false);
        // Focus first OTP input
        setTimeout(() => {
          document.getElementById("otp-0")?.focus();
        }, 100);
      }
    } catch (error: any) {
      setError(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0]; // Only one digit
    if (!/^\d*$/.test(value)) return; // Only numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split("");
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpString }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setSuccess("Email verified successfully! Redirecting...");

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    console.log("Google signup clicked");
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setSuccess("New OTP sent to your email!");
      setOtp(["", "", "", "", "", ""]);
      setTimer(60);
      setCanResend(false);
      document.getElementById("otp-0")?.focus();
    } catch (error: any) {
      setError(error.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: "", color: "", text: "" };
    if (password.length < 6)
      return { strength: "weak", color: "bg-red-500", text: "Weak" };
    if (password.length < 10)
      return { strength: "medium", color: "bg-yellow-500", text: "Medium" };
    return { strength: "strong", color: "bg-green-500", text: "Strong" };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 bg-gray-50">
        {/* LEFT – Branding */}
        <div className="hidden lg:flex flex-col justify-center px-12 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "700ms" }}
            ></div>
          </div>

          <div className="relative z-10">
            <div className="mb-6">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-4 leading-tight">
              {step === "signup"
                ? "Begin Your Sacred Journey"
                : "Verify Your Email"}
            </h1>
            <p className="text-white/90 text-base max-w-md leading-relaxed mb-6">
              {step === "signup"
                ? "Create your account to explore sacred destinations, save your spiritual journeys, and manage your pilgrimage experiences with ease."
                : "We've sent a 6-digit verification code to your email. Please enter it below to complete your registration."}
            </p>

            {step === "signup" && (
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
            )}
          </div>
        </div>

        {/* RIGHT – Forms Container */}
        <div className="flex items-center justify-center px-6 py-8 relative overflow-hidden">
          <div className="w-full max-w-sm relative">
            {/* SIGNUP FORM */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                step === "signup"
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-full opacity-0 absolute inset-0"
              }`}
            >
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
                <div className="mb-5">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                    Create Account
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Sign up to get started on your spiritual journey
                  </p>
                </div>

                {/* Success Message */}
                {success && step === "signup" && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {success}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* Google Signup */}
                <button
                  onClick={handleGoogleSignup}
                  disabled={isLoading}
                  type="button"
                  className="w-full flex items-center justify-center gap-2.5 border-2 border-gray-200 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 hover:border-orange-300 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                >
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    alt="Google"
                    className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <span className="text-gray-700">Sign up with Google</span>
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <span className="text-xs text-gray-500 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSignupSubmit} className="space-y-3">
                  {/* Name */}
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
                        disabled={isLoading}
                        className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                        disabled={isLoading}
                        className="w-full pl-10 pr-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-gray-700">
                        Password
                      </label>
                      {/* Inline Password Strength - Better Design */}
                      {formData.password && (
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            passwordStrength.strength === "weak"
                              ? "bg-red-50 text-red-600"
                              : passwordStrength.strength === "medium"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-green-50 text-green-600"
                          }`}
                        >
                          {passwordStrength.text}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 6 characters"
                        disabled={isLoading}
                        className="w-full pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors disabled:cursor-not-allowed"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="group">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-gray-700">
                        Confirm Password
                      </label>
                      {/* Inline Password Match Indicator - Better Design */}
                      {formData.confirmPassword && (
                        <div
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            formData.password === formData.confirmPassword
                              ? "bg-green-50 text-green-600"
                              : "bg-orange-50 text-orange-600"
                          }`}
                        >
                          {formData.password === formData.confirmPassword ? (
                            <>
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Matched
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-3 h-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Not Match
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter your password"
                        disabled={isLoading}
                        className="w-full pl-10 pr-10 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors disabled:cursor-not-allowed"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 text-sm rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
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
                        Sending OTP...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="mt-4 text-center">
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

                {/* Terms */}
                <p className="text-[10px] text-gray-500 text-center mt-3 leading-relaxed">
                  By signing up, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-orange-600 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-orange-600 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            {/* OTP VERIFICATION FORM - Same as before */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                step === "otp"
                  ? "translate-x-0 opacity-100"
                  : "translate-x-full opacity-0 absolute inset-0"
              }`}
            >
              {/* Mobile Logo */}
              <div className="lg:hidden mb-6 text-center">
                <div className="inline-flex w-11 h-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl items-center justify-center mb-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl shadow-orange-500/10 p-6 border border-gray-100">
                {/* Back Button */}
                <button
                  onClick={() => setStep("signup")}
                  className="flex items-center gap-2 text-gray-600 hover:text-orange-600 text-sm mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to signup
                </button>

                <div className="mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
                    Verify Your Email
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Enter the 6-digit code sent to
                    <br />
                    <span className="font-semibold text-gray-900">
                      {formData.email}
                    </span>
                  </p>
                </div>

                {/* Success Message */}
                {success && step === "otp" && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    {success}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* OTP Form */}
                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* OTP Input */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-3 text-center">
                      Enter Verification Code
                    </label>
                    <div
                      className="flex gap-2 justify-center"
                      onPaste={handleOtpPaste}
                    >
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          id={`otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          onKeyDown={(e) => handleOtpKeyDown(index, e)}
                          disabled={isLoading}
                          className="w-12 h-14 text-center text-2xl font-bold text-gray-900 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resend Link with Timer */}
                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-sm text-gray-600">
                        Resend code in{" "}
                        <span className="font-semibold text-orange-600">
                          {Math.floor(timer / 60)}:
                          {(timer % 60).toString().padStart(2, "0")}
                        </span>
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={!canResend || isLoading}
                        className="text-sm text-orange-600 font-semibold hover:text-red-600 hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>

                  {/* Verify Button */}
                  <button
                    type="submit"
                    disabled={isLoading || otp.join("").length !== 6}
                    className="w-full py-2.5 text-sm rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold hover:from-orange-600 hover:to-red-700 transition-all duration-300 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4"
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
                        Verifying...
                      </span>
                    ) : (
                      "Verify Email"
                    )}
                  </button>
                </form>

                {/* Help Text */}
                <p className="text-[10px] text-gray-500 text-center mt-4 leading-relaxed">
                  Didn't receive the code? click
                  resend.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
