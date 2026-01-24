"use client";

import { useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[90%] max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-4 text-white flex items-center justify-between">
          <h3 className="font-bold text-lg">
            Save to Wishlist
          </h3>
          <button
            onClick={onClose}
            className="hover:bg-white/20 p-1 rounded-full transition"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-center">
          <p className="text-gray-700 mb-6 leading-relaxed">
            ❤️ Sign in to save this destination and access your wishlist
            from any device.
          </p>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-xl py-2.5 text-gray-700 font-semibold hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleLogin}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white rounded-xl py-2.5 font-semibold shadow-md transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
