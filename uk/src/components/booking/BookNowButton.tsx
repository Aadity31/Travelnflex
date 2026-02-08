"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Shield, Loader2, AlertCircle, CheckCircle2, LogIn } from "lucide-react";

interface BookNowButtonProps {
  destination: string;
  startDate: string;
  endDate: string;
  persons: number;
  amount: number;
  type?: "activity" | "destination";
  disabled?: boolean;
}

// Rate limiting utility
const RateLimiter = {
  lastRequest: 0,
  minInterval: 2000,
  
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

export default function BookNowButton({
  destination,
  startDate,
  endDate,
  persons,
  amount,
  type = "destination",
  disabled = false,
}: BookNowButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [showDateWarning, setShowDateWarning] = useState(false);

  // Check authentication status on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        setIsAuthenticated(data.authenticated);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, []);

  // Check for stored booking intent after login redirect
  useEffect(() => {
    const storedIntent = sessionStorage.getItem("bookingIntent");
    if (storedIntent && isAuthenticated) {
      sessionStorage.removeItem("bookingIntent");
      // Auto-proceed with booking after login
      handleBookingWithIntent(JSON.parse(storedIntent));
    }
  }, [isAuthenticated]);

  // Validate booking parameters
  const validateBooking = useCallback((): boolean => {
    const sanitizedDestination = sanitizeInput(destination);
    const sanitizedStartDate = sanitizeInput(startDate);
    const sanitizedEndDate = sanitizeInput(endDate);

    if (!sanitizedDestination || !sanitizedStartDate || !sanitizedEndDate) {
      setError("Missing required booking information");
      return false;
    }

    if (persons < 1 || persons > 50) {
      setError("Invalid number of persons");
      return false;
    }

    if (amount <= 0) {
      setError("Invalid booking amount");
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(sanitizedStartDate);
    if (bookingDate < today) {
      setError("Booking date must be in the future");
      return false;
    }

    const start = new Date(sanitizedStartDate);
    const end = new Date(sanitizedEndDate);
    if (end < start) {
      setError("End date cannot be before start date");
      return false;
    }

    return true;
  }, [destination, startDate, endDate, persons, amount]);

  // Handle booking with stored intent (after login)
  async function handleBookingWithIntent(intent: {
    destination: string;
    startDate: string;
    endDate: string;
    persons: number;
    amount: number;
  }) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
        body: JSON.stringify({
          destination: sanitizeInput(intent.destination),
          startDate: sanitizeInput(intent.startDate),
          endDate: sanitizeInput(intent.endDate),
          persons: Number(intent.persons),
          amount: Number(intent.amount),
          timestamp: Date.now(),
        }),
      });

      if (res.status === 429) {
        throw new Error("Too many requests. Please try again later.");
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Booking failed. Please try again.");
      }

      const data = await res.json();

      if (!data?.bookingId || typeof data.bookingId !== "string") {
        throw new Error("Booking initialization failed");
      }

      router.push(`/booking/${type || 'destination'}/${encodeURIComponent(intent.destination)}/confirm?bookingId=${encodeURIComponent(data.bookingId)}`);
    } catch (err) {
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

  // Handle initial booking click
  async function handleBooking() {
    if (loading || !RateLimiter.canMakeRequest()) {
      if (!loading) {
        setError("Please wait before trying again");
      }
      return;
    }

    // Show warning if date not selected
    if (disabled) {
      setShowDateWarning(true);
      setTimeout(() => setShowDateWarning(false), 3000);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // First check auth
      const authRes = await fetch("/api/auth/check");
      const authData = await authRes.json();

      if (!authData.authenticated) {
        // Store booking intent for after login
        const bookingIntent = {
          destination,
          startDate,
          endDate,
          persons,
          amount,
        };
        sessionStorage.setItem("bookingIntent", JSON.stringify(bookingIntent));
        
        // Redirect to login with return URL
        router.push(`/login?redirect=${encodeURIComponent(pathname)}&action=book`);
        return;
      }

      // Validate booking parameters
      if (!validateBooking()) {
        setLoading(false);
        return;
      }

      // Navigate directly to confirm page without creating booking
      // Navigate directly to confirm page
      await new Promise((resolve) => setTimeout(resolve, 500));
      router.push(`/booking/${type || 'destination'}/${encodeURIComponent(destination)}/confirm`);

    } catch (err) {
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
        disabled={loading || disabled}
        className={`
          w-full py-4 px-6 rounded-xl font-bold text-lg
          flex items-center justify-center gap-2
          transition-all duration-300
          ${
            loading
              ? "bg-gray-400 text-white cursor-wait"
              : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40"
          }
          ${!loading ? "hover:scale-[1.02] active:scale-[0.98]" : ""}
        `}
        aria-label={`Book now for ₹${amount.toLocaleString("en-IN")}`}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : !authChecked ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Checking...
          </>
        ) : isAuthenticated ? (
          <>
            <Shield className="w-5 h-5" />
            Book Now - ₹{amount.toLocaleString("en-IN")}
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Login to Book - ₹{amount.toLocaleString("en-IN")}
          </>
        )}
      </button>

      {/* Auth Status Info */}
      {!authChecked && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Verifying your session...
        </div>
      )}

      {/* Warning Message */}
      {showDateWarning && (
        <div
          className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700">Please select a date first</p>
        </div>
      )}

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
    </div>
  );
}
