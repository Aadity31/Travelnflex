// app/api/notifications/mark-read/route.ts
// 🔴 DUMMY API: Mark notification as read

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { id } = await request.json();

  // 🔴 DUMMY: Just return success
  console.log(`[DUMMY] Marking notification ${id} as read`);

  return NextResponse.json({ success: true });
}

/* ✅ REPLACE with this when backend is ready:

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    // Update in database
    // await db.notification.update({
    //   where: { id },
    //   data: { read: true, readAt: new Date() }
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark as read" },
      { status: 500 }
    );
  }
}
*/
