import { NextResponse } from 'next/server';
import { getDestinationsInfinite } from '@/lib/db/getDestinationsInfinite';

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

      // 🔥 FORCE ISO (timezone safe)
      cursor = parsed.toISOString();
    }

    const destinations = await getDestinationsInfinite({
      limit: 12,
      cursor,
    });

    return NextResponse.json(destinations);
  } catch (err) {
    console.error('API /destinations error:', err);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
