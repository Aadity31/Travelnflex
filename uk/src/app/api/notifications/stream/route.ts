// app/api/notifications/stream/route.ts
// 🔴 DUMMY API: Server-Sent Events for real-time notifications

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 🔴 DUMMY: Send a test notification every 15 seconds
      const interval = setInterval(() => {
        const dummyNotification = {
          id: Date.now().toString(),
          title: "Test Notification",
          message: "This is a dummy real-time notification",
          timestamp: "Just now",
          read: false,
          type: "update",
        };

        const data = `data: ${JSON.stringify(dummyNotification)}\n\n`;
        controller.enqueue(encoder.encode(data));
      }, 15000);

      // Cleanup on disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

/* ✅ REPLACE entire file with this when backend is ready:

import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();

  // Get user from auth
  // const userId = await getUserIdFromRequest(request);

  const stream = new ReadableStream({
    async start(controller) {
      // Poll database or use Redis pub/sub
      const interval = setInterval(async () => {
        try {
          // Check for new notifications from database
          const newNotifications = await checkForNewNotifications(userId);

          if (newNotifications.length > 0) {
            for (const notification of newNotifications) {
              const data = `data: ${JSON.stringify(notification)}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
        } catch (error) {
          console.error("SSE Error:", error);
        }
      }, 5000);

      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

async function checkForNewNotifications(userId: string) {
  // Your database query here
  // return await db.notification.findMany({
  //   where: { userId, createdAt: { gt: lastCheck } }
  // });
  return [];
}
*/
