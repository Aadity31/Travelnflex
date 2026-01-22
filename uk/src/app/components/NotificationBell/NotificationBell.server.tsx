import NotificationBellClient from "./NotificationBell.client";
import { cookies } from "next/headers";

async function getNotifications() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/notifications`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookies().toString(), // pass session
        },
      }
    );

    if (!res.ok) {
      console.error("Notif API error:", res.status);
      return [];
    }

    return res.json();
  } catch (err) {
    console.error("Fetch notifications failed:", err);
    return [];
  }
}

export default async function NotificationBellServer() {
  const notifications = await getNotifications();

  return <NotificationBellClient initialNotifications={notifications} />;
}
