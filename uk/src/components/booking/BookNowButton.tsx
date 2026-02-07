"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface BookNowButtonProps {
  destination: string;
  startDate: string;
  endDate: string;
  persons: number;
  amount: number;
}

export default function BookNowButton({
  destination,
  startDate,
  endDate,
  persons,
  amount,
}: BookNowButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleBooking() {
    // Prevent multiple clicks
    if (loading || success) return;

    try {
      setLoading(true);
      setError(null);

      // Validate input
      if (!destination || !startDate || persons < 1 || amount < 1) {
        throw new Error("Invalid booking parameters");
      }

      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          persons,
          amount,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Booking failed. Please try again.");
      }

      const data = await res.json();

      /* -----------------------------
         Validate Response
      ------------------------------ */
      if (!data?.bookingId) {
        console.error("Invalid API response:", data);
        throw new Error("Booking initialization failed");
      }

      setSuccess(true);

      // Short delay before redirect for UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      router.push(`/booking/${destination}/confirm?bookingId=${data.bookingId}`);

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
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
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
          <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-blue-800 block">Secure Payment</span>
            <span className="text-blue-600">SSL Encrypted</span>
          </div>
        </div>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        By booking, you agree to our{" "}
        <a href="/terms-and-conditions" className="text-orange-500 hover:underline">
          Terms & Conditions
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="text-orange-500 hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
