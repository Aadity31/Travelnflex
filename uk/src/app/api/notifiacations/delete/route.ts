// app/api/notifications/delete/route.ts
// 🔴 DUMMY API: Delete notification

import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();

  // 🔴 DUMMY: Just return success
  console.log(`[DUMMY] Deleting notification ${id}`);

  return NextResponse.json({ success: true });
}

/* ✅ REPLACE with this when backend is ready:

import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    
    // Delete from database
    // await db.notification.delete({
    //   where: { id }
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
*/
