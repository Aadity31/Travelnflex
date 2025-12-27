import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { generateOTP, sendOTPEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Get pending OTP record with user data
    const otpResult = await pool.query(
      "SELECT user_data FROM otp_verifications WHERE email = $1 ORDER BY created_at DESC LIMIT 1",
      [normalizedEmail]
    );

    if (otpResult.rows.length === 0) {
      return NextResponse.json(
        { message: "No pending verification found. Please sign up again." },
        { status: 404 }
      );
    }

    const userData = otpResult.rows[0].user_data;

    if (!userData || !userData.name) {
      return NextResponse.json(
        { message: "User data not found. Please sign up again." },
        { status: 400 }
      );
    }

    // Generate new OTP
    const otp = generateOTP();
    
    // Hash new OTP
    const otpHash = await bcrypt.hash(otp, 10);
    
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Delete old OTPs
    await pool.query("DELETE FROM otp_verifications WHERE email = $1", [normalizedEmail]);

    // Insert new OTP
    await pool.query(
      `INSERT INTO otp_verifications (email, otp_hash, expires_at, user_data)
       VALUES ($1, $2, $3, $4)`,
      [normalizedEmail, otpHash, expiresAt, JSON.stringify(userData)]
    );

    // Send plain OTP to email
    await sendOTPEmail(normalizedEmail, otp, userData.name);

    return NextResponse.json(
      { message: "New OTP sent to your email" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { message: "Failed to resend OTP. Please try again." },
      { status: 500 }
    );
  }
}
