// app/api/available-dates/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { getAvailableDatesByDestination } from '@/lib/data/destinations/getAvailableDates';
import { getActivityAvailableDates } from '@/lib/data/activities/getAvailableDates';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');
  const id = searchParams.get('id');
  const packageType = searchParams.get('packageType');

  if (!type || !id) {
    return NextResponse.json(
      { error: 'Missing required parameters: type and id' },
      { status: 400 }
    );
  }

  try {
    let availableDates;

    if (type === 'destination') {
      availableDates = await getAvailableDatesByDestination(id, packageType || undefined);
    } else if (type === 'activity') {
      availableDates = await getActivityAvailableDates(id);
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "destination" or "activity"' },
        { status: 400 }
      );
    }

    return NextResponse.json({ availableDates });
  } catch (error) {
    console.error('Error fetching available dates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch available dates' },
      { status: 500 }
    );
  }
}
