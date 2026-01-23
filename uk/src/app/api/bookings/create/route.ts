import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    /* -------------------------
       Auth
    -------------------------- */
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* -------------------------
       Body
    -------------------------- */
    const {
      destination,
      startDate,
      endDate,
      persons,
      amount,
    } = await req.json();

    if (!destination || !startDate || !endDate || !persons || !amount) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    /* -------------------------
       Get User
    -------------------------- */
    const userRes = await pool.query(
      `SELECT id FROM users WHERE email = $1 LIMIT 1`,
      [session.user.email]
    );

    if (userRes.rowCount === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userId = userRes.rows[0].id;

    /* -------------------------
       Insert Booking
    -------------------------- */
    const result = await pool.query(
      `
      INSERT INTO bookings
      (user_id, destination, start_date, end_date, persons, amount, status)
      VALUES ($1,$2,$3,$4,$5,$6,'pending')
      RETURNING id
      `,
      [
        userId,
        destination,
        startDate,
        endDate,
        persons,
        amount,
      ]
    );

    const bookingId = result.rows[0].id;

    /* -------------------------
       Return Contract
    -------------------------- */
    return NextResponse.json({
      bookingId,
    });
  } catch (err) {
    console.error("Booking error:", err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
