// lib/data/activities/getAvailableDates.ts

import pool from '@/lib/db';

export interface AvailableDate {
  date: string;
  availableSlots: number;
  totalSlots: number;
}

export async function getActivityAvailableDates(
  activityId: string
): Promise<Record<string, number>> {
  // For activities, we'll check if there's an activity_available_dates table
  // If not, we'll return an empty object and use mock dates
  try {
    const { rows } = await pool.query(
      `
      SELECT 
        available_date::text as date,
        available_slots,
        total_slots
      FROM activity_available_dates
      WHERE activity_id = $1
        AND available_date >= CURRENT_DATE
        AND available_slots > 0
      ORDER BY available_date ASC
      `,
      [activityId]
    );

    // Convert to Record<string, number> format for calendar
    // Handle both Date objects and string dates to avoid timezone issues
    const dates: Record<string, number> = {};
    for (const row of rows) {
      let dateStr: string;
      if (row.date instanceof Date) {
        // Format Date object to YYYY-MM-DD in local timezone
        const year = row.date.getFullYear();
        const month = String(row.date.getMonth() + 1).padStart(2, '0');
        const day = String(row.date.getDate()).padStart(2, '0');
        dateStr = `${year}-${month}-${day}`;
      } else {
        dateStr = String(row.date).split("T")[0];
      }
      dates[dateStr] = row.available_slots;
    }

    return dates;
  } catch (error) {
    // If table doesn't exist, return empty object
    console.warn('activity_available_dates table not found, using mock dates');
    return {};
  }
}
