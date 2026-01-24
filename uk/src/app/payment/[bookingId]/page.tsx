"use client";

import { useState, use } from "react";

/* --------------------------------------------------
   Razorpay Types
-------------------------------------------------- */

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;

  handler: (response: RazorpayResponse) => void;

  prefill?: {
    email?: string;
    contact?: string;
  };

  theme?: {
    color?: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

/* --------------------------------------------------
   Page Props
-------------------------------------------------- */

interface PageProps {
  params: Promise<{
    bookingId: string;
  }>;
}

/* --------------------------------------------------
   Component
-------------------------------------------------- */

export default function PaymentPage({ params }: PageProps) {
  /* -----------------------------
     Unwrap Params (Next.js 15+)
  ------------------------------ */
  const { bookingId } = use(params);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* -----------------------------
     Handle Payment
  ------------------------------ */
  async function handlePay() {
    try {
      setLoading(true);
      setError("");

      /* -----------------------------
        Create Order
      ------------------------------ */
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          bookingId,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Order API Error:", text);
        throw new Error(text || "Order creation failed");
      }

      const data = await res.json();

      /* -----------------------------
        Load Razorpay
      ------------------------------ */
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = () => {
        const options: RazorpayOptions = {
          key: data.key,
          amount: data.amount, // backend should send paise
          currency: data.currency,

          name: "Devbhoomi Darshan",
          description: "Trip Booking Payment",
          order_id: data.orderId,

          handler: async (response) => {
            console.log("Payment success:", response);

            alert("Payment Successful!");

            // TODO: Verify on backend
          },

          prefill: {
            email: "",
            contact: "",
          },

          theme: {
            color: "#f97316",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      document.body.appendChild(script);

    } catch (err) {
      console.error(err);
      setError("Payment failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  /* -----------------------------
     UI
  ------------------------------ */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full text-center space-y-4">

        <h1 className="text-2xl font-bold text-gray-900">
          Payment
        </h1>

        <p className="text-sm text-gray-600">
          Booking ID
        </p>

        <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
          {bookingId}
        </p>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={loading}
          className="
            w-full mt-4
            bg-orange-500 hover:bg-orange-600
            text-white py-3 rounded-lg font-semibold
            transition
            disabled:opacity-60
          "
        >
          {loading ? "Processing..." : "Proceed to Pay"}
        </button>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500">
            {error}
          </p>
        )}

      </div>
    </div>
  );
}
