import { NextResponse } from 'next/server';
import { getDestinationsInfinite } from '@/lib/db/getDestinationsInfinite';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const createdAt = searchParams.get('createdAt');
    const id = searchParams.get('id');

    let cursor:
      | {
          createdAt: string;
          id: string;
        }
      | undefined;

    if (createdAt && id) {
      const parsed = new Date(createdAt);

      if (isNaN(parsed.getTime())) {
        return NextResponse.json(
          { error: 'Invalid cursor createdAt' },
          { status: 400 }
        );
      }

      cursor = {
        createdAt: parsed.toISOString(), // 🔒 force UTC
        id,
      };
    }

    const destinations = await getDestinationsInfinite({
      limit: 4, // SSR + client SAME
      cursor,
    });
// console.log(
//   "[API /destinations] returned:",
//   destinations.map(d => ({
//     id: d.id,
//     createdAt: d.createdAt,
//   }))
// );

    return NextResponse.json(destinations);
  } catch (err) {
    console.error('API /destinations error:', err);

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
