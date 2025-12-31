import { NextResponse } from 'next/server';
import { getActivitiesInfinite } from '@/lib/db/getActivitiesInfinite';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const rawCursor = searchParams.get('cursor');

    let cursor: string | undefined = undefined;

    if (rawCursor) {
      const parsed = new Date(rawCursor);

      if (isNaN(parsed.getTime())) {
        return NextResponse.json(
          { error: 'Invalid cursor format' },
          { status: 400 }
        );
      }

      // 🔥 FORCE ISO UTC — THIS IS THE FIX
      cursor = parsed.toISOString();
    }

    const activities = await getActivitiesInfinite({
      limit: 12,
      cursor,
    });

    return NextResponse.json(activities);
  } catch (err) {
    console.error('API /activities error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
