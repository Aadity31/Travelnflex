// lib/data/destinations/getAvailableDates.ts

import pool from '@/lib/db';

export interface AvailableDate {
  date: string;
  availableSlots: number;
  totalSlots: number;
  packageType: string;
}

export async function getAvailableDatesByDestination(
  destinationId: string,
  packageType?: string
): Promise<Record<string, number>> {
  let query = `
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

  if (packageType) {
    query += ` AND package_type = $2`;
    params.push(packageType);
  }

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
}
