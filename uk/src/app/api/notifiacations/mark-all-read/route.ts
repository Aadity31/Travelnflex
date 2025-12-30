// app/api/notifications/mark-all-read/route.ts
// 🔴 DUMMY API: Mark all notifications as read

import { NextResponse } from "next/server";

export async function POST() {
  // 🔴 DUMMY: Just return success
  console.log("[DUMMY] Marking all notifications as read");

  return NextResponse.json({ success: true });
}

/* ✅ REPLACE with this when backend is ready:

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Get user from auth
    // const userId = await getUserIdFromRequest(request);
    
    // Update all unread notifications
    // await db.notification.updateMany({
    //   where: { userId, read: false },
    //   data: { read: true, readAt: new Date() }
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking all as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark all as read" },
      { status: 500 }
    );
  }
}
*/
