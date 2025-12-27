import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json(
        { message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Validate OTP format
    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { message: "Invalid OTP format. Please enter 6 digits." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Get OTP record with user data
    const otpResult = await pool.query(
      `SELECT * FROM otp_verifications 
       WHERE email = $1 AND verified = false 
       ORDER BY created_at DESC LIMIT 1`,
      [normalizedEmail]
    );

    if (otpResult.rows.length === 0) {
      return NextResponse.json(
        { message: "No OTP found. Please request a new one." },
        { status: 404 }
      );
    }

    const otpRecord = otpResult.rows[0];

    // Check if OTP expired
    if (new Date() > new Date(otpRecord.expires_at)) {
      // Delete expired OTP
      await pool.query("DELETE FROM otp_verifications WHERE id = $1", [otpRecord.id]);
      
      return NextResponse.json(
        { message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check max attempts (5 attempts as per CHECK constraint)
    if (otpRecord.attempts >= 5) {
      // Delete after max attempts
      await pool.query("DELETE FROM otp_verifications WHERE id = $1", [otpRecord.id]);
      
      return NextResponse.json(
        { message: "Too many failed attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    // Verify OTP using bcrypt.compare (compare plain OTP with hashed OTP)
    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp_hash);

    if (!isOtpValid) {
      // Increment attempts
      await pool.query(
        "UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = $1",
        [otpRecord.id]
      );

      return NextResponse.json(
        {
          message: "Invalid OTP. Please try again.",
          attemptsLeft: 5 - (otpRecord.attempts + 1)
        },
        { status: 400 }
      );
    }

    // OTP is correct - CREATE ACCOUNT
    const userData = otpRecord.user_data;

    if (!userData || !userData.name || !userData.password_hash) {
      return NextResponse.json(
        { message: "User data not found. Please sign up again." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      // Update existing unverified user
      await pool.query(
        `UPDATE users 
         SET name = $1, password_hash = $2, email_verified = true, updated_at = NOW()
         WHERE email = $3`,
        [userData.name, userData.password_hash, normalizedEmail]
      );
    } else {
      // Create new user
      await pool.query(
        `INSERT INTO users (name, email, password_hash, auth_provider, email_verified)
         VALUES ($1, $2, $3, $4, $5)`,
        [userData.name, normalizedEmail, userData.password_hash, 'credentials', true]
      );
    }

    // Mark OTP as verified
    await pool.query(
      "UPDATE otp_verifications SET verified = true WHERE id = $1",
      [otpRecord.id]
    );

    // Delete OTP record (cleanup)
    await pool.query(
      "DELETE FROM otp_verifications WHERE email = $1",
      [normalizedEmail]
    );

    return NextResponse.json(
      {
        message: "Email verified and account created successfully!",
        verified: true,
        accountCreated: true,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "OTP verification error:",
      error instanceof Error ? error.message : error
    );

    const errObj = error as { code?: string; message?: string } | undefined;

    if (errObj?.code === '23505') {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        message: "Verification failed. Please try again.",
        error: process.env.NODE_ENV === 'development' ? (errObj?.message ?? (typeof error === 'string' ? error : undefined)) : undefined,
      },
      { status: 500 }
    );
  }
}
