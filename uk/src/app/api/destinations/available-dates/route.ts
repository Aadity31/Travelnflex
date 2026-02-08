import { NextResponse } from 'next/server';
import { getAvailableDates } from '@/lib/data/destinations/getAvailableDates';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get('destinationId');
    const packageType = searchParams.get('packageType');

    if (!destinationId) {
      return NextResponse.json(
        { error: 'destinationId is required' },
        { status: 400 }
      );
    }

    const dates = await getAvailableDates(destinationId, packageType || undefined);

    return NextResponse.json({
      success: true,
      destinationId,
      packageType: packageType || null,
      dates,
      count: Object.keys(dates).length,
    });
  } catch (error) {
    console.error('API /destinations/available-dates error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
