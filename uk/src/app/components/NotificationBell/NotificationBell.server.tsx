// app/components/NotificationBell.server.tsx

import NotificationBellClient from "./NotificationBell.client";

// 🔴 DUMMY DATA - Replace this function when backend is ready
async function getDummyNotifications() {
  // Simulating server-side data fetch
  return [
    {
      id: "1",
      title: "Booking Confirmed",
      message: "Your Kedarnath trek booking is confirmed",
      timestamp: "2 min ago",
      read: false,
      type: "booking" as const,
    },
    {
      id: "2",
      title: "Reminder",
      message: "Your Ganga Aarti starts in 2 hours",
      timestamp: "1 hour ago",
      read: false,
      type: "reminder" as const,
    },
    {
      id: "3",
      title: "Special Offer",
      message: "20% off on Char Dham Yatra packages",
      timestamp: "3 hours ago",
      read: true,
      type: "promo" as const,
    },
  ];
}

/* ✅ REPLACE getDummyNotifications() with this when backend is ready:

import { cookies } from "next/headers";

async function getNotifications(userId: string) {
  try {
    const res = await fetch(`${process.env.API_URL}/api/notifications/${userId}`, {
      cache: "no-store", // Always fetch fresh data
      headers: {
        "Content-Type": "application/json",
        // Add auth token if needed
        // "Authorization": `Bearer ${token}`
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch notifications");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return []; // Return empty array on error
  }
}
*/

export default async function NotificationBellServer() {
  // 🔴 DUMMY: Using dummy data for now
  const notifications = await getDummyNotifications();

  /* ✅ REPLACE above line with this when backend is ready:
  
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value; // Or use your auth method
  
  // If user not logged in, don't show notifications
  if (!userId) {
    return null;
  }
  
  const notifications = await getNotifications(userId);
  */

  return <NotificationBellClient initialNotifications={notifications} />;
}
