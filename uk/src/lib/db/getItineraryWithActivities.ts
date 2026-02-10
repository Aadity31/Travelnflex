// lib/db/getItineraryWithActivities.ts

import pool from '@/lib/db';

export interface DayActivity {
  id: string;
  activityName: string;
  activityOrder: number;
}

export interface ItineraryDay {
  id: string;
  dayNumber: number;
  title: string;
  description: string | null;
  location: string | null;
  startTime: string | null;
  endTime: string | null;
  activities: DayActivity[];
}

export interface ItineraryWithActivities {
  destinationId: string;
  destinationName: string;
  days: ItineraryDay[];
}

/**
 * Fetch itinerary days and activities for a destination
 */
export async function getItineraryWithActivities(destinationId: string): Promise<ItineraryDay[]> {
  // First, get all days for the destination
  const daysQuery = await pool.query(
    `
    SELECT 
      id,
      day_number,
      title,
      description,
      location,
      start_time,
      end_time
    FROM destination_itinerary_days
    WHERE destination_id = $1
    ORDER BY day_number ASC
    `,
    [destinationId]
  );

  if (daysQuery.rows.length === 0) {
    return [];
  }

  // Get all activities for these days
  const dayIds = daysQuery.rows.map((row) => row.id);
  
  if (dayIds.length === 0) {
    return daysQuery.rows.map((row) => ({
      id: row.id,
      dayNumber: row.day_number,
      title: row.title,
      description: row.description,
      location: row.location,
      startTime: row.start_time,
      endTime: row.end_time,
      activities: [],
    }));
  }

  // Fetch activities for all days in one query
  const activitiesQuery = await pool.query(
    `
    SELECT 
      id,
      day_id,
      activity_name,
      activity_order
    FROM destination_day_activities
    WHERE day_id = ANY($1)
    ORDER BY day_id, activity_order ASC
    `,
    [dayIds]
  );

  // Map activities to their respective days
  const activitiesByDay = new Map<string, DayActivity[]>();
  
  for (const activity of activitiesQuery.rows) {
    const existing = activitiesByDay.get(activity.day_id) || [];
    existing.push({
      id: activity.id,
      activityName: activity.activity_name,
      activityOrder: activity.activity_order,
    });
    activitiesByDay.set(activity.day_id, existing);
  }

  // Combine days with their activities
  return daysQuery.rows.map((row) => ({
    id: row.id,
    dayNumber: row.day_number,
    title: row.title,
    description: row.description,
    location: row.location,
    startTime: row.start_time,
    endTime: row.end_time,
    activities: activitiesByDay.get(row.id) || [],
  }));
}

/**
 * Get itinerary for a destination by slug
 */
export async function getItineraryByDestinationSlug(slug: string): Promise<ItineraryWithActivities | null> {
  // First get the destination ID
  const destQuery = await pool.query(
    `
    SELECT id, name
    FROM destinations
    WHERE slug = $1 AND is_active = TRUE
    LIMIT 1
    `,
    [slug]
  );

  if (destQuery.rows.length === 0) {
    return null;
  }

  const destination = destQuery.rows[0];
  const days = await getItineraryWithActivities(destination.id);

  return {
    destinationId: destination.id,
    destinationName: destination.name,
    days,
  };
}
