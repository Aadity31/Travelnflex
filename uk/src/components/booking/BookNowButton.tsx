"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Shield, Loader2, AlertCircle, CheckCircle2, Lock, Eye, EyeOff } from "lucide-react";

interface BookNowButtonProps {
  destination: string;
  startDate: string;
  endDate: string;
  persons: number;
  amount: number;
}

// Rate limiting utility
const RateLimiter = {
  lastRequest: 0,
  minInterval: 2000, // 2 seconds between requests
  
  canMakeRequest(): boolean {
    const now = Date.now();
    if (now - this.lastRequest >= this.minInterval) {
      this.lastRequest = now;
      return true;
    }
    return false;
  },
};

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .trim();
}

// Validate amount to prevent price manipulation
function validateAmount(amount: number, basePrice: number): boolean {
  const minAmount = basePrice * 0.5; // Allow 50% discount
  const maxAmount = basePrice * 5; // Allow up to 5x markup
  return amount >= minAmount && amount <= maxAmount;
}

// CSRF token generator (simple version - in production, use proper crypto)
function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default function BookNowButton({
  destination,
  startDate,
  endDate,
  persons,
  amount,
}: BookNowButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [csrfToken, setCsrfToken] = useState<string>("");
  const [showSensitive, setShowSensitive] = useState(false);

  // Initialize CSRF token on mount
  useEffect(() => {
    setCsrfToken(generateCSRFToken());
  }, []);

  // Validate booking parameters
  const validateBooking = useCallback((): boolean => {
    // Sanitize inputs
    const sanitizedDestination = sanitizeInput(destination);
    const sanitizedStartDate = sanitizeInput(startDate);
    const sanitizedEndDate = sanitizeInput(endDate);

    // Check required fields
    if (!sanitizedDestination || !sanitizedStartDate || !sanitizedEndDate) {
      setError("Missing required booking information");
      return false;
    }

    // Validate persons
    if (persons < 1 || persons > 50) {
      setError("Invalid number of persons");
      return false;
    }

    // Validate amount is positive
    if (amount <= 0) {
      setError("Invalid booking amount");
      return false;
    }

    // Validate dates are in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(sanitizedStartDate);
    if (bookingDate < today) {
      setError("Booking date must be in the future");
      return false;
    }

    // Validate date range
    const start = new Date(sanitizedStartDate);
    const end = new Date(sanitizedEndDate);
    if (end < start) {
      setError("End date cannot be before start date");
      return false;
    }

    return true;
  }, [destination, startDate, endDate, persons, amount]);

  async function handleBooking() {
    // Prevent multiple clicks and check rate limiting
    if (loading || success || !RateLimiter.canMakeRequest()) {
      if (!loading && !success) {
        setError("Please wait before trying again");
      }
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Validate booking parameters
      if (!validateBooking()) {
        setLoading(false);
        return;
      }

      // Create booking with security headers
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
          "X-Requested-With": "XMLHttpRequest",
          "X-Rate-Limit-Policy": "strict",
        },
        credentials: "include",
        body: JSON.stringify({
          destination: sanitizeInput(destination),
          startDate: sanitizeInput(startDate),
          endDate: sanitizeInput(endDate),
          persons: Number(persons),
          amount: Number(amount),
          // Add timestamp to prevent replay attacks
          timestamp: Date.now(),
        }),
      });

      // Handle rate limiting response
      if (res.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }

      // Handle unauthorized
      if (res.status === 401) {
        // Store booking intent for after login
        sessionStorage.setItem("bookingIntent", JSON.stringify({
          destination,
          startDate,
          endDate,
          persons,
          amount,
        }));
        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Booking failed. Please try again.");
      }

      const data = await res.json();

      // Validate response structure
      if (!data?.bookingId || typeof data.bookingId !== "string") {
        console.error("Invalid API response:", data);
        throw new Error("Booking initialization failed");
      }

      setSuccess(true);

      // Short delay before redirect for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push(`/booking/${encodeURIComponent(destination)}/confirm?bookingId=${encodeURIComponent(data.bookingId)}`);

    } catch (err: unknown) {
      console.error("Booking error:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Book Now Button */}
      <button
        onClick={handleBooking}
        disabled={loading || success}
        className={`
          w-full py-4 px-6 rounded-xl font-bold text-lg
          flex items-center justify-center gap-2
          transition-all duration-300
          ${
            success
              ? "bg-green-500 text-white"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
          }
          ${loading ? "opacity-70 cursor-wait" : ""}
          ${!success && !loading ? "hover:scale-[1.02] active:scale-[0.98]" : ""}
        `}
        aria-label={success ? "Booking confirmed" : `Book now for ₹${amount.toLocaleString("en-IN")}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : success ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            Booking Confirmed!
          </>
        ) : (
          <>
            <Shield className="w-5 h-5" />
            Book Now - ₹{amount.toLocaleString("en-IN")}
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div
          className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-green-800 block">Free Cancellation</span>
            <span className="text-green-600">Up to 24 hours before</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-blue-800 block">SSL Encrypted</span>
            <span className="text-blue-600">256-bit security</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
          <Shield className="w-4 h-4 text-purple-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-purple-800 block">Secure Payment</span>
            <span className="text-purple-600">PCI DSS compliant</span>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <Eye className="w-4 h-4 text-orange-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-orange-800 block">Transparent</span>
            <span className="text-orange-600">No hidden fees</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        By booking, you agree to our{" "}
        <a
          href="/terms-and-conditions"
          className="text-orange-500 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read our terms and conditions"
        >
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a
          href="/privacy-policy"
          className="text-orange-500 hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Read our privacy policy"
        >
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
