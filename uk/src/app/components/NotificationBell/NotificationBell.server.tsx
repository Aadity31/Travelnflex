import NotificationBellClient from "./NotificationBell.client";
import { cookies } from "next/headers";

async function getNotifications() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/notifications`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookies().toString(),
        },
      }
    );

    if (!res.ok) return [];

    return res.json();
  } catch {
    return [];
  }
}

export default async function NotificationBellServer() {
  const notifications = await getNotifications();

  return <NotificationBellClient notifications={notifications} />;
}
