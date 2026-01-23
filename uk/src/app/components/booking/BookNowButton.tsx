"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [error, setError] = useState("");

  async function handleBooking() {
    try {
      setLoading(true);
      setError("");

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
        const text = await res.text();
        console.error("Booking API failed:", text);
        throw new Error("Booking failed");
      }

      const data = await res.json();

      /* -----------------------------
         Validate Response
      ------------------------------ */
      if (!data?.bookingId) {
        console.error("Invalid API response:", data);
        throw new Error("No bookingId returned");
      }

      const bookingId: string = data.bookingId;

      /* -----------------------------
         Redirect
      ------------------------------ */
      router.push(`/payment/${bookingId}`);

    } catch (err: any) {
      console.error("Booking error:", err);
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleBooking}
        disabled={loading}
        className="
          px-6 py-3 rounded-xl
          bg-gradient-to-r from-orange-500 to-red-600
          text-white font-semibold
          hover:opacity-90
          disabled:opacity-60
          transition
        "
      >
        {loading ? "Booking..." : "Book Now"}
      </button>

      {error && (
        <p className="text-xs text-red-500 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
