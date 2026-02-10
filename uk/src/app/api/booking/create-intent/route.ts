import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

// ============================================
// BOOKING INTENT API
// ============================================
// This endpoint creates a temporary booking intent that expires after a set time
// Client sends booking details, server validates and creates intent
// Client then redirects to confirm page with intent_id as reference
// ============================================

// Generate unique intent ID with agency code
async function generateIntentId(
  packageCode: string,
  type: string,
  client: any
): Promise<string> {
  const prefix = "INT";
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  // Shorten package code: take first letter of each word, remove special chars
  // e.g., "4-dham-yatra-uttarakhand" -> "4DYU"
  const shortenedCode = packageCode
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase())
    .filter(char => char >= 'A' && char <= 'Z')
    .join('')
    .slice(0, 6);
  
  // Fetch agency code from destination or activity
  let agencyCode = "GEN"; // Default for generic
  
  try {
    if (type === "destination") {
      const result = await client.query(
        `SELECT agency_code FROM destinations WHERE id = $1 LIMIT 1`,
        [packageCode]
      );
      if (result.rows[0]?.agency_code) {
        // Shorten agency code to first 8 chars
        agencyCode = result.rows[0].agency_code.substring(0, 8).toUpperCase();
      }
    } else {
      const result = await client.query(
        `SELECT agency_code FROM activities WHERE id = $1 LIMIT 1`,
        [packageCode]
      );
      if (result.rows[0]?.agency_code) {
        agencyCode = result.rows[0].agency_code.substring(0, 8).toUpperCase();
      }
    }
  } catch (e) {
    console.error("Failed to fetch agency code:", e);
  }
  
  return `${prefix}-${agencyCode}-${shortenedCode}-${year}-${random}`;
}

// Validate and sanitize input
function sanitizeInput(input: unknown, maxLength: number = 100): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[<>'"&\\]/g, "")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim()
    .slice(0, maxLength);
}

export async function POST(req: NextRequest) {
  const client = await pool.connect();

  try {
    /* -------------------------
       1. AUTHENTICATION
    -------------------------- */
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    /* -------------------------
       2. INPUT VALIDATION & SANITIZATION
    -------------------------- */
    const body = await req.json();
    
    const { packageCode, type = "destination" } = body;

    // Validate required fields
    if (!packageCode) {
      return NextResponse.json(
        { error: "Package code is required" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedPackageCode = sanitizeInput(packageCode, 20);
    const sanitizedType = sanitizeInput(type, 20);

    /* -------------------------
       3. GET USER ID
    -------------------------- */
    // Users table uses UUID for id
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
       4. GENERATE INTENT ID & SET EXPIRATION
    -------------------------- */
    const intentId = await generateIntentId(sanitizedPackageCode, sanitizedType, client);
    
    // Set expiration to 30 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30);

    /* -------------------------
       5. CREATE BOOKING INTENT
    -------------------------- */
    await client.query("BEGIN");

    try {
      const result = await client.query(
        `INSERT INTO booking_intents
        (intent_id, user_id, package_code, status, expires_at)
        VALUES ($1, $2, $3, 'HELD', $4)
        RETURNING id, created_at`,
        [
          intentId,
          userId,
          sanitizedPackageCode,
          expiresAt,
        ]
      );

      await client.query("COMMIT");

      const intent = result.rows[0];

      /* -------------------------
         6. RETURN SUCCESS RESPONSE
      -------------------------- */
      return NextResponse.json({
        intent_id: intentId,
        expires_at: expiresAt.toISOString(),
        message: "Booking intent created. Please confirm within 30 minutes.",
      });

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }

  } catch (err) {
    console.error("[BOOKING_INTENT_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to create booking intent. Please try again." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}

// GET endpoint to validate an intent
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const intentId = searchParams.get("intent_id");

  if (!intentId) {
    return NextResponse.json(
      { error: "Intent ID is required" },
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      `SELECT 
        intent_id, 
        package_code, 
        status, 
        expires_at, 
        created_at
      FROM booking_intents 
      WHERE intent_id = $1`,
      [intentId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Booking intent not found" },
        { status: 404 }
      );
    }

    const intent = result.rows[0];

    // Check if intent has expired
    const expiresAt = new Date(intent.expires_at);
    const now = new Date();
    
    if (expiresAt < now) {
      return NextResponse.json(
        { 
          error: "Booking intent has expired",
          status: "EXPIRED"
        },
        { status: 410 }
      );
    }

    return NextResponse.json({
      intent_id: intent.intent_id,
      package_code: intent.package_code,
      status: intent.status,
      expires_at: intent.expires_at,
      created_at: intent.created_at,
    });

  } catch (err) {
    console.error("[BOOKING_INTENT_GET_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to retrieve booking intent" },
      { status: 500 }
    );
  }
}
