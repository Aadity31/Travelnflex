import { NextResponse } from 'next/server';
import { getDestinationsInfinite } from '@/lib/db/getDestinationsInfinite';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // 🔑 composite cursor params
    const rawCreatedAt = searchParams.get('createdAt');
    const rawId = searchParams.get('id');

    let cursor:
      | {
          createdAt: string;
          id: string;
        }
      | undefined = undefined;

    // 🔒 validate cursor (PRODUCTION SAFE)
    if (rawCreatedAt && rawId) {
      const parsedDate = new Date(rawCreatedAt);

      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid cursor createdAt' },
          { status: 400 }
        );
      }

      cursor = {
        createdAt: parsedDate.toISOString(), // force UTC ISO
        id: rawId,
      };
    }

    const destinations = await getDestinationsInfinite({
      limit: 4, // 👈 same as SSR limit
      cursor,
    });

    return NextResponse.json(destinations);
  } catch (error) {
    console.error('API /destinations error:', error);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
