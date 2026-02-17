"use client";

import { useEffect } from "react";
import { XMarkIcon, HeartIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface LoginPromptProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginPrompt({
  open,
  onClose,
}: LoginPromptProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleLogin = () => {
    const callbackUrl = encodeURIComponent(window.location.pathname);
    window.location.href = `/login?callbackUrl=${callbackUrl}`;
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md transition-opacity duration-300"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-prompt-title"
    >
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.3)] overflow-hidden transform transition-all duration-500 ease-out scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-all"
          aria-label="Close"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Icon Section */}
        <div className="pt-8 pb-6 px-6 text-center">
          {/* Animated Heart Icon */}
          <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-red-100 rounded-full animate-pulse" />
            <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-4 shadow-lg">
              <HeartSolidIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Title */}
          <h3 
            id="login-prompt-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Save to Wishlist
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
            Sign in to save your favorite destinations and access your wishlist from any device, anytime.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Actions */}
        <div className="p-6 space-y-3">
          {/* Primary Action - Login */}
          <button
            onClick={handleLogin}
            className="w-full bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl py-3.5 px-6 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>Continue with Login</span>
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>

          {/* Secondary Action - Cancel */}
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl py-3 px-6 font-medium transition-all duration-200"
          >
            Maybe Later
          </button>
        </div>

        {/* Optional: Benefits Section */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Why Sign In?
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">✓</span>
                <span>Save unlimited destinations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">✓</span>
                <span>Access from any device</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">✓</span>
                <span>Get personalized recommendations</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}