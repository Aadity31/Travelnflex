import { NextResponse } from "next/server";
import db from "@/lib/db"; 

export async function GET() {
  try {
    await db.query(`
      DELETE FROM otp_verifications
      WHERE expires_at < NOW()
    `);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("OTP cleanup failed:", err);
    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}
