<<<<<<< HEAD
// lib/data/destinations/getAvailableDates.ts

import pool from '@/lib/db';

export interface AvailableDate {
  date: string;
  availableSlots: number;
  totalSlots: number;
  packageType: string;
}

export async function getAvailableDatesByDestination(
=======
import pool from "@/lib/db";

export interface AvailableDate {
  destination_id: string;
  package_type: string;
  available_date: string;
  available_slots: number;
  total_slots: number;
}

// Get available dates for a destination
export async function getAvailableDates(
>>>>>>> 382046aa006be6bff0e9eab032277775ceb7e724
  destinationId: string,
  packageType?: string
): Promise<Record<string, number>> {
  let query = `
<<<<<<< HEAD
    SELECT 
      available_date::text as date,
      available_slots,
      total_slots,
      package_type
    FROM destination_available_dates
    WHERE destination_id = $1
      AND available_date >= CURRENT_DATE
      AND available_slots > 0
  `;

  const params: (string | undefined)[] = [destinationId];

=======
    SELECT available_date, available_slots
    FROM destination_available_dates
    WHERE destination_id = $1
    AND available_date >= CURRENT_DATE
    AND available_slots > 0
  `;
  
  const params: (string | number)[] = [destinationId];
  
>>>>>>> 382046aa006be6bff0e9eab032277775ceb7e724
  if (packageType) {
    query += ` AND package_type = $2`;
    params.push(packageType);
  }
<<<<<<< HEAD

  query += ` ORDER BY available_date ASC`;

  const { rows } = await pool.query(query, params);

  // Convert to Record<string, number> format for calendar
  const dates: Record<string, number> = {};
  for (const row of rows) {
    dates[row.date] = row.available_slots;
  }

  return dates;
}

export async function getAllAvailableDates(
  destinationId: string
): Promise<AvailableDate[]> {
  const { rows } = await pool.query(
    `
    SELECT 
      available_date::text as date,
      available_slots,
      total_slots,
      package_type
    FROM destination_available_dates
    WHERE destination_id = $1
      AND available_date >= CURRENT_DATE
      AND available_slots > 0
    ORDER BY available_date ASC
    `,
    [destinationId]
  );

  return rows.map((row) => ({
    date: row.date,
    availableSlots: row.available_slots,
    totalSlots: row.total_slots,
    packageType: row.package_type,
  }));
=======
  
  query += ` ORDER BY available_date ASC`;
  
  const result = await pool.query(query, params);
  
  const dates: Record<string, number> = {};
  
  result.rows.forEach((row) => {
    const dateStr = new Date(row.available_date).toISOString().split("T")[0];
    dates[dateStr] = row.available_slots;
  });
  
  return dates;
}

// Get all available dates for a destination (for admin)
export async function getAllAvailableDatesForDestination(
  destinationId: string
): Promise<AvailableDate[]> {
  const result = await pool.query(
    `SELECT * FROM destination_available_dates
     WHERE destination_id = $1
     ORDER BY available_date ASC`,
    [destinationId]
  );
  
  return result.rows;
}

// Add or update an available date
export async function upsertAvailableDate(
  destinationId: string,
  packageType: string,
  availableDate: string,
  totalSlots: number = 50
): Promise<void> {
  await pool.query(
    `INSERT INTO destination_available_dates 
     (destination_id, package_type, available_date, total_slots, available_slots)
     VALUES ($1, $2, $3, $4, $4)
     ON CONFLICT (destination_id, package_type, available_date)
     DO UPDATE SET total_slots = $4, available_slots = $4`,
    [destinationId, packageType, availableDate, totalSlots]
  );
}

// Delete an available date
export async function deleteAvailableDate(
  destinationId: string,
  packageType: string,
  availableDate: string
): Promise<void> {
  await pool.query(
    `DELETE FROM destination_available_dates
     WHERE destination_id = $1 AND package_type = $2 AND available_date = $3`,
    [destinationId, packageType, availableDate]
  );
}

// Bulk add available dates for a destination
export async function bulkAddAvailableDates(
  destinationId: string,
  packageType: string,
  dates: string[],
  slotsPerDate: number = 50
): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    for (const date of dates) {
      await client.query(
        `INSERT INTO destination_available_dates 
         (destination_id, package_type, available_date, total_slots, available_slots)
         VALUES ($1, $2, $3, $4, $4)
         ON CONFLICT (destination_id, package_type, available_date)
         DO UPDATE SET total_slots = $4, available_slots = $4`,
        [destinationId, packageType, date, slotsPerDate]
      );
    }
    
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// Delete all available dates for a destination
export async function deleteAllAvailableDatesForDestination(
  destinationId: string,
  packageType?: string
): Promise<void> {
  let query = `DELETE FROM destination_available_dates WHERE destination_id = $1`;
  const params: string[] = [destinationId];
  
  if (packageType) {
    query += ` AND package_type = $2`;
    params.push(packageType);
  }
  
  await pool.query(query, params);
>>>>>>> 382046aa006be6bff0e9eab032277775ceb7e724
}
