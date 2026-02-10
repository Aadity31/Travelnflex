"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Shield, Loader2, AlertCircle, LogIn } from "lucide-react";

interface BookNowButtonProps {
  destination: string;
  startDate: string;
  endDate: string;
  persons: number;
  type?: "activity" | "destination";
  disabled?: boolean;
  packageType?: "solo" | "family" | "group" | "private";
  rooms?: number;
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

// Sanitize string input to prevent XSS
function sanitizeInput(input: string, maxLength: number = 100): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>'"&\\]/g, "")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim()
    .slice(0, maxLength);
}

// Sanitize and validate numeric input
function sanitizeNumber(value: unknown, min: number, max: number, defaultValue: number): number {
  const num = Number(value);
  if (!Number.isFinite(num) || Number.isNaN(num)) return defaultValue;
  return Math.max(min, Math.min(max, Math.round(num)));
}

export default function BookNowButton({
  destination,
  startDate,
  endDate,
  persons,
  type = "destination",
  disabled = false,
  packageType = "solo",
  rooms = 1,
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

  // Handle booking with stored intent (after login)
  const handleBookingWithIntent = useCallback(async (intent: {
    destination: string;
    startDate: string;
    endDate: string;
    persons: number;
    packageType?: string;
    rooms?: number;
  }) => {
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
          persons: sanitizeNumber(intent.persons, 1, 50, 1),
          packageType: sanitizeInput(intent.packageType || "solo", 20),
          rooms: sanitizeNumber(intent.rooms, 1, 20, 1),
          timestamp: Date.now(),
          // SECURITY: amount is NOT sent - server calculates price from database
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

      // Redirect to confirm page with booking ID
      const encodedDestination = encodeURIComponent(intent.destination);
      const encodedBookingId = encodeURIComponent(data.bookingId);
      router.push(`/booking/${type || 'destination'}/${encodedDestination}/confirm?bookingId=${encodedBookingId}`);
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
  }, [router, type]);

  // Check for stored booking intent after login redirect
  useEffect(() => {
    const storedIntent = sessionStorage.getItem("bookingIntent");
    if (storedIntent && isAuthenticated) {
      sessionStorage.removeItem("bookingIntent");
      // Auto-proceed with booking after login
      handleBookingWithIntent(JSON.parse(storedIntent));
    }
  }, [isAuthenticated, handleBookingWithIntent]);

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

    // Note: We don't validate amount because server calculates it
    // Security: Client cannot manipulate final price

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
  }, [destination, startDate, endDate, persons]);

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
        // Store booking intent for after login (WITHOUT amount)
        const bookingIntent = {
          destination,
          startDate,
          endDate,
          persons,
          packageType,
          rooms,
          // SECURITY: amount NOT stored - server will calculate
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

      // Navigate to confirm page - server will calculate price
      const encodedDestination = encodeURIComponent(destination);
      router.push(`/booking/${type || 'destination'}/${encodedDestination}/confirm`);
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
        aria-label="Book now - price will be calculated by server"
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
            Book Now
          </>
        ) : (
          <>
            <LogIn className="w-5 h-5" />
            Login to Book
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

      {/* Security Notice */}
      <p className="text-xs text-gray-500 text-center">
        Price will be calculated securely by the server
      </p>

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
