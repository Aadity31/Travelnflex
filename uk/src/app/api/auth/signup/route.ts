import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import pool from "@/lib/db";
import { generateOTP, sendOTPEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { name, email, password, confirmPassword } = await request.json();

    // Validation
    if (!name?.trim()) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    if (!email?.trim()) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Passwords do not match" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists and is verified
    const existingUser = await pool.query(
      "SELECT id, email, email_verified FROM users WHERE email = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0 && existingUser.rows[0].email_verified) {
      return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP (plain text for email)
    const otp = generateOTP();
    
    // Hash OTP before storing in database
    const otpHash = await bcrypt.hash(otp, 10);
    
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this email
    await pool.query("DELETE FROM otp_verifications WHERE email = $1", [normalizedEmail]);

    // Store hashed OTP with user data
    await pool.query(
      `INSERT INTO otp_verifications (email, otp_hash, expires_at, user_data)
       VALUES ($1, $2, $3, $4)`,
      [
        normalizedEmail,
        otpHash, // Store hashed OTP
        expiresAt,
        JSON.stringify({
          name: name.trim(),
          password_hash: hashedPassword
        })
      ]
    );

    // Send plain OTP to email (not hashed)
    await sendOTPEmail(normalizedEmail, otp, name.trim());

    return NextResponse.json(
      {
        message: "OTP sent to your email. Please verify to complete registration.",
        requiresVerification: true,
        email: normalizedEmail,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Signup error:", error);
    
    // Handle duplicate email in otp_verifications table
    if (error.code === '23505') {
      return NextResponse.json(
        { message: "An OTP request is already pending for this email. Please wait or try resending." },
        { status: 409 }
      );
    }
    
    if (error.message === 'Failed to send OTP email') {
      return NextResponse.json(
        { message: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        message: "Failed to process signup. Please try again.",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
