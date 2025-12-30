import { NextResponse } from 'next/server';
import { getActivitiesInfinite } from '@/lib/db/getActivitiesInfinite';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get('cursor');
    const limitParam = searchParams.get('limit');

    const limit = limitParam ? Number(limitParam) : 12;

    // Safety guard
    if (Number.isNaN(limit) || limit <= 0 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid limit' },
        { status: 400 }
      );
    }

    const activities = await getActivitiesInfinite({
      cursor: cursor ?? undefined,
      limit,
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('API /activities error:', error);

    return NextResponse.json(
      { error: 'Failed to load activities' },
      { status: 500 }
    );
  }
}
