import pool from "@/lib/db";
import { notFound } from "next/navigation";

interface Props {
  params: {
    bookingId: string;
  };
}

export default async function PaymentPage({ params }: Props) {
  const { bookingId } = params;

  /* -------------------------
     Get Booking
  -------------------------- */
  const res = await pool.query(
    `
    SELECT b.*, u.name, u.email
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    WHERE b.id = $1
    LIMIT 1
    `,
    [bookingId]
  );

  if (res.rowCount === 0) {
    notFound();
  }

  const booking = res.rows[0];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

        <h1 className="text-xl font-bold mb-4">
          Complete Payment
        </h1>

        {/* Booking Info */}
        <div className="space-y-2 text-sm mb-6">

          <div>
            <b>Destination:</b> {booking.destination}
          </div>

          <div>
            <b>Dates:</b> {booking.start_date} → {booking.end_date}
          </div>

          <div>
            <b>Persons:</b> {booking.persons}
          </div>

          <div>
            <b>User:</b> {booking.name}
          </div>

          <div className="text-lg font-semibold mt-3">
            Amount: ₹{booking.amount}
          </div>

        </div>

        {/* Pay Button (Dummy for now) */}
        <button
          className="w-full py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition"
        >
          Pay Now
        </button>

      </div>
    </div>
  );
}
