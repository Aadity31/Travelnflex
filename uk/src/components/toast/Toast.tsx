"use client";

import { useEffect } from "react";

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "removed";
  isExiting: boolean;
}

interface ToastContainerProps {
  toasts: Toast[];
  onHideToast: (id: string) => void;
}

export default function ToastContainer({ toasts, onHideToast }: ToastContainerProps) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 sm:top-24 sm:right-6 z-50 pointer-events-none flex flex-col-reverse gap-3 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onHideToast={onHideToast} />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onHideToast: (id: string) => void;
}

function ToastItem({ toast, onHideToast }: ToastItemProps) {
  useEffect(() => {
    // Auto-hide is handled by the store, this is just a fallback
  }, []);

  return (
    <div
      className={`
        px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 min-w-[260px] 
        backdrop-blur-md pointer-events-auto relative overflow-hidden
        ${toast.isExiting ? "animate-toast-out" : "animate-toast-in"}
        ${
          toast.type === "success"
            ? "bg-white/75 border border-orange-200/60"
            : toast.type === "removed"
            ? "bg-white/75 border border-gray-200/60"
            : "bg-white/75 border border-red-200/60"
        }
      `}
    >
      {/* Progress Bar */}
      <div
        className={`
          absolute bottom-0 left-0 h-1 animate-toast-progress
          ${
            toast.type === "success"
              ? "bg-orange-500"
              : toast.type === "removed"
              ? "bg-gray-500"
              : "bg-red-500"
          }
        `}
        style={{ width: "100%" }}
      />

      {/* Icon */}
      <div
        className={`p-1.5 rounded-full flex-shrink-0 ${
          toast.type === "success"
            ? "bg-orange-100"
            : toast.type === "removed"
            ? "bg-gray-100"
            : "bg-red-100"
        }`}
      >
        {toast.type === "success" ? (
          <CheckIcon className="w-4 h-4 text-orange-600" />
        ) : toast.type === "removed" ? (
          <RemoveIcon className="w-4 h-4 text-gray-600" />
        ) : (
          <ErrorIcon className="w-4 h-4 text-red-600" />
        )}
      </div>

      {/* Message */}
      <span
        className={`text-sm font-medium flex-1 ${
          toast.type === "success"
            ? "text-orange-700"
            : toast.type === "removed"
            ? "text-gray-700"
            : "text-red-700"
        }`}
      >
        {toast.message}
      </span>

      {/* Close Button */}
      <button
        onClick={() => onHideToast(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        <CloseIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

// Icons
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ErrorIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function RemoveIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
