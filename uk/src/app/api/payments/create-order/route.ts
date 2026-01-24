export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/* --------------------------------------------------
   POST: Create Payment Order
-------------------------------------------------- */

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    /* -----------------------------
       Env Check + Razorpay Init
    ------------------------------ */
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: "Razorpay configuration missing" },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    /* -----------------------------
       Auth
    ------------------------------ */
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* -----------------------------
       Get User ID
    ------------------------------ */
    const userRes = await client.query(
      `SELECT id FROM users WHERE email = $1`,
      [session.user.email]
    );

    if ((userRes.rowCount ?? 0) === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId: string = userRes.rows[0].id;

    /* -----------------------------
       Parse Body
    ------------------------------ */
    let body: { bookingId?: string };

    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        { error: "Missing bookingId" },
        { status: 400 }
      );
    }

    /* -----------------------------
       Transaction Start
    ------------------------------ */
    await client.query("BEGIN");

    /* -----------------------------
       Validate Booking
    ------------------------------ */
    const bookingRes = await client.query(
      `
      SELECT id, amount, user_id, status
      FROM bookings
      WHERE id = $1
      FOR UPDATE
      `,
      [bookingId]
    );

    if ((bookingRes.rowCount ?? 0) === 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const booking = bookingRes.rows[0];

    /* -----------------------------
       Ownership Check
    ------------------------------ */
    if (booking.user_id !== userId) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { error: "Unauthorized booking access" },
        { status: 403 }
      );
    }

    /* -----------------------------
       Already Paid?
    ------------------------------ */
    if (booking.status === "paid") {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { error: "Booking already paid" },
        { status: 400 }
      );
    }

    /* -----------------------------
       Amount Validation
    ------------------------------ */
    const amountInINR = Number(booking.amount);

    if (!Number.isFinite(amountInINR) || amountInINR <= 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { error: "Invalid booking amount" },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(amountInINR * 100);

    /* -----------------------------
       Prevent Duplicate Pending
    ------------------------------ */
    const pendingRes = await client.query(
      `
      SELECT 1
      FROM payments
      WHERE booking_id = $1
        AND status = 'pending'
      LIMIT 1
      `,
      [bookingId]
    );

    if ((pendingRes.rowCount ?? 0) > 0) {
      await client.query("ROLLBACK");

      return NextResponse.json(
        { error: "Payment already initiated" },
        { status: 409 }
      );
    }

    /* -----------------------------
       Create Razorpay Order
    ------------------------------ */
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `bk_${bookingId.slice(0, 40)}`,
      payment_capture: true,
    });

    /* -----------------------------
       Insert Payment Row
    ------------------------------ */
    await client.query(
      `
      INSERT INTO payments
        (
          user_id,
          booking_id,
          amount,
          currency,
          status,
          gateway,
          gateway_order_id
        )
      VALUES
        ($1, $2, $3, 'INR', 'pending', 'razorpay', $4)
      `,
      [
        userId,
        bookingId,
        amountInINR,
        order.id,
      ]
    );

    /* -----------------------------
       Commit
    ------------------------------ */
    await client.query("COMMIT");

    /* -----------------------------
       Response
    ------------------------------ */
    return NextResponse.json({
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR",
      key: keyId, // public key only
    });

  } catch (err) {
    await client.query("ROLLBACK");

    console.error("[PAYMENT_CREATE_ERROR]", err);

    return NextResponse.json(
      { error: "Payment initialization failed" },
      { status: 500 }
    );

  } finally {
    client.release();
  }
}
