import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

// ============================================
// SECURE BOOKING API CONTRACT
// ============================================
// Client sends ONLY:
// {
//   destination: string,
//   startDate: "YYYY-MM-DD",
//   endDate: "YYYY-MM-DD",
//   persons: number,
//   packageType: "solo" | "family" | "group" | "private",
//   rooms: number
// }
//
// Client MUST NOT send:
// - amount
// - pricePerPerson
// - discountedPrice
// - Any calculated values
// ============================================

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
    
    const {
      destination,
      startDate,
      endDate,
      persons,
      packageType,
      rooms,
      // timestamp is used for security hashing, marked as unused
      timestamp: _timestamp,
    } = body;

    // Validate required fields
    if (!destination || !startDate || !endDate || !persons) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate destination format (alphanumeric, spaces, hyphens)
    if (!/^[a-zA-Z0-9\s\-]+$/.test(destination)) {
      return NextResponse.json(
        { error: "Invalid destination format" },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || 
        !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return NextResponse.json(
        { error: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 }
      );
    }

    // Validate package type
    const validPackageTypes = ["solo", "family", "group", "private"];
    const pkgType = validPackageTypes.includes(packageType) ? packageType : "solo";

    // Validate numeric bounds
    const numPersons = Number(persons);
    const numRooms = Number(rooms) || 1;
    
    if (!Number.isFinite(numPersons) || numPersons < 1 || numPersons > 50) {
      return NextResponse.json(
        { error: "Invalid number of persons. Must be between 1-50" },
        { status: 400 }
      );
    }

    if (!Number.isFinite(numRooms) || numRooms < 1 || numRooms > 20) {
      return NextResponse.json(
        { error: "Invalid number of rooms. Must be between 1-20" },
        { status: 400 }
      );
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      return NextResponse.json(
        { error: "Start date cannot be in the past" },
        { status: 400 }
      );
    }

    if (end < start) {
      return NextResponse.json(
        { error: "End date cannot be before start date" },
        { status: 400 }
      );
    }

    /* -------------------------
       3. GET USER ID
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
       4. FETCH PRICING FROM DATABASE
          (Server-side only - client cannot modify)
    -------------------------- */
    
    // Fetch destination prices
    const priceRes = await client.query(
      `SELECT 
        price_per_person,
        solo_traveler_price,
        family_package_price,
        join_group_price,
        own_group_price,
        hotel_per_person
      FROM destination_prices
      WHERE destination_id = $1`,
      [destination]
    );

    if (priceRes.rowCount === 0) {
      return NextResponse.json(
        { error: "Destination not found or pricing not available" },
        { status: 404 }
      );
    }

    const prices = priceRes.rows[0];

    // Fetch destination discounts
    const discountRes = await client.query(
      `SELECT 
        solo_traveler_discount,
        solo_traveler_valid_until,
        family_package_discount,
        family_package_valid_until,
        join_group_discount,
        join_group_valid_until,
        own_group_discount,
        own_group_valid_until
      FROM destination_discounts
      WHERE destination_id = $1`,
      [destination]
    );

    const discounts = discountRes.rows[0] || {};

    // Fetch available dates with slots
    const availabilityRes = await client.query(
      `SELECT available_date, available_slots, total_slots
       FROM destination_available_dates
       WHERE destination_id = $1 AND package_type = $2
       AND available_date >= CURRENT_DATE
       ORDER BY available_date`,
      [destination, pkgType]
    );

    /* -------------------------
       5. PACKAGE-SPECIFIC VALIDATION
    -------------------------- */
    
    // Get package-specific price
    let basePricePerPerson = 0;
    let discountPercentage = 0;
    let discountValidUntil = null;

    switch (pkgType) {
      case "solo":
        basePricePerPerson = prices.solo_traveler_price || prices.price_per_person || 0;
        discountPercentage = discounts.solo_traveler_discount || 0;
        discountValidUntil = discounts.solo_traveler_valid_until;
        break;
      case "family":
        basePricePerPerson = prices.price_per_person || 0;
        discountPercentage = discounts.family_package_discount || 0;
        discountValidUntil = discounts.family_package_valid_until;
        break;
      case "group":
        basePricePerPerson = prices.join_group_price || prices.price_per_person || 0;
        discountPercentage = discounts.join_group_discount || 0;
        discountValidUntil = discounts.join_group_valid_until;
        break;
      case "private":
        basePricePerPerson = prices.own_group_price || prices.price_per_person || 0;
        discountPercentage = discounts.own_group_discount || 0;
        discountValidUntil = discounts.own_group_valid_until;
        break;
    }

    // Validate discount expiration
    if (discountPercentage > 0 && discountValidUntil) {
      const validUntil = new Date(discountValidUntil);
      const now = new Date();
      if (validUntil < now) {
        discountPercentage = 0; // Expired discount
      }
    }

    // Validate package rules
    const totalTravelers = numPersons;
    
    switch (pkgType) {
      case "solo":
        if (totalTravelers > 1) {
          return NextResponse.json(
            { error: "Solo package allows only 1 person" },
            { status: 400 }
          );
        }
        if (numRooms > 1) {
          return NextResponse.json(
            { error: "Solo package allows only 1 room" },
            { status: 400 }
          );
        }
        break;
      case "family":
        if (totalTravelers > 10) {
          return NextResponse.json(
            { error: "Family package allows maximum 10 persons" },
            { status: 400 }
          );
        }
        break;
      case "group":
        if (totalTravelers > 30) {
          return NextResponse.json(
            { error: "Group package allows maximum 30 persons" },
            { status: 400 }
          );
        }
        break;
      case "private":
        if (totalTravelers < 5) {
          return NextResponse.json(
            { error: "Private package requires minimum 5 persons" },
            { status: 400 }
          );
        }
        if (totalTravelers > 100) {
          return NextResponse.json(
            { error: "Private package allows maximum 100 persons" },
            { status: 400 }
          );
        }
        break;
    }

    /* -------------------------
       6. SERVER-SIDE PRICE CALCULATION
          (Client cannot influence this)
    -------------------------- */
    
    // Calculate prices server-side
    const discountMultiplier = (100 - discountPercentage) / 100;
    const priceAfterDiscount = basePricePerPerson * discountMultiplier;
    
    // For family/private: fixed package price
    // For solo/group: per person pricing
    const isFixedPackage = pkgType === "family" || pkgType === "private";
    
    const peopleTotal = isFixedPackage 
      ? basePricePerPerson // Fixed package price
      : Math.round(priceAfterDiscount * totalTravelers);
    
    const roomCost = numRooms * (prices.hotel_per_person || 0);
    const subtotal = peopleTotal + roomCost;
    
    // Calculate discount amount
    const discountAmount = isFixedPackage
      ? Math.round(basePricePerPerson * discountMultiplier * discountPercentage / 100)
      : Math.round((basePricePerPerson - priceAfterDiscount) * totalTravelers);
    
    const finalAmount = subtotal;

    /* -------------------------
       7. DATE & SLOT AVAILABILITY CHECK
    -------------------------- */
    
    // Check if selected date is available
    const dateAvailability = availabilityRes.rows.find(
      (row: { available_date: Date }) => 
        row.available_date.toISOString().split('T')[0] === startDate
    );

    if (!dateAvailability) {
      return NextResponse.json(
        { error: "Selected date is not available for this package" },
        { status: 400 }
      );
    }

    if (dateAvailability.available_slots < totalTravelers) {
      return NextResponse.json(
        { error: `Only ${dateAvailability.available_slots} slots available for selected date` },
        { status: 400 }
      );
    }

    /* -------------------------
       8. ATOMIC BOOKING CREATION
    -------------------------- */
    
    await client.query("BEGIN");

    try {
      // Decrement available slots atomically
      const updateSlots = await client.query(
        `UPDATE destination_available_dates
         SET available_slots = available_slots - $1
         WHERE destination_id = $2 AND package_type = $3 AND available_date = $4
         AND available_slots >= $1`,
        [totalTravelers, destination, pkgType, startDate]
      );

      if (updateSlots.rowCount === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "Slots no longer available. Please select another date." },
          { status: 409 }
        );
      }

      // Insert booking with SERVER-CALCULATED amount
      const result = await client.query(
        `INSERT INTO bookings
        (user_id, destination, package_type, start_date, end_date, adults, children, rooms, amount, status, price_snapshot)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending', $10)
        RETURNING id, created_at`,
        [
          userId,
          destination,
          pkgType,
          startDate,
          endDate,
          numPersons, // Store as adults for now
          0, // children (not supported in current UI)
          numRooms,
          finalAmount,
          JSON.stringify({
            basePricePerPerson,
            discountPercentage,
            peopleTotal,
            roomCost,
            discountAmount,
            finalAmount,
            calculatedAt: new Date().toISOString(),
          })
        ]
      );

      await client.query("COMMIT");

      const booking = result.rows[0];

      /* -------------------------
         9. RETURN SECURE RESPONSE
      -------------------------- */
      return NextResponse.json({
        bookingId: booking.id,
        serverCalculatedAmount: finalAmount,
        pricingBreakdown: {
          basePricePerPerson,
          discountPercentage,
          peopleTotal,
          roomCost,
          discountAmount,
          finalAmount,
        },
        message: "Booking created successfully. Amount calculated server-side.",
      });

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }

  } catch (err) {
    console.error("[BOOKING_CREATE_ERROR]", err);
    return NextResponse.json(
      { error: "Failed to create booking. Please try again." },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
