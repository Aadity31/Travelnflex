import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  getAllAvailableDatesForDestination,
  bulkAddAvailableDates,
  deleteAllAvailableDatesForDestination,
  deleteAvailableDate,
} from '@/lib/data/destinations/getAvailableDates';

// GET - Get all available dates for a destination (admin)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated (you might want to add admin role check)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get('destinationId');

    if (!destinationId) {
      return NextResponse.json(
        { error: 'destinationId is required' },
        { status: 400 }
      );
    }

    const dates = await getAllAvailableDatesForDestination(destinationId);

    return NextResponse.json({
      success: true,
      destinationId,
      dates,
    });
  } catch (error) {
    console.error('API /admin/destinations/available-dates GET error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST - Bulk add available dates
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated (you might want to add admin role check)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { destinationId, packageType, dates, slotsPerDate } = body;

    if (!destinationId || !packageType || !dates || !Array.isArray(dates)) {
      return NextResponse.json(
        { error: 'destinationId, packageType, and dates array are required' },
        { status: 400 }
      );
    }

    await bulkAddAvailableDates(
      destinationId,
      packageType,
      dates,
      slotsPerDate || 50
    );

    return NextResponse.json({
      success: true,
      message: `Added ${dates.length} available dates`,
    });
  } catch (error) {
    console.error('API /admin/destinations/available-dates POST error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete all available dates for a destination
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated (you might want to add admin role check)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const destinationId = searchParams.get('destinationId');
    const packageType = searchParams.get('packageType');
    const date = searchParams.get('date');

    if (!destinationId) {
      return NextResponse.json(
        { error: 'destinationId is required' },
        { status: 400 }
      );
    }

    // If a specific date is provided, delete just that date
    if (date && packageType) {
      await deleteAvailableDate(destinationId, packageType, date);
      return NextResponse.json({
        success: true,
        message: 'Date deleted successfully',
      });
    }

    // Otherwise, delete all dates for the destination
    await deleteAllAvailableDatesForDestination(destinationId, packageType || undefined);

    return NextResponse.json({
      success: true,
      message: 'All available dates deleted',
    });
  } catch (error) {
    console.error('API /admin/destinations/available-dates DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
