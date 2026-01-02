import NavbarClient from "./Navbar.client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

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

export default async function NavbarServer() {
  const session = await getServerSession(authOptions);
  const notifications = await getDummyNotifications();

  let user = null;
  // let notifications = [];

  if (session?.user?.email) {
    const res = await pool.query(
      `SELECT id, name, email, image
       FROM users
       WHERE email = $1
       LIMIT 1`,
      [session.user.email]
    );

    user = res.rows[0] ?? null;
  }

  // if (user) {
  // //   const notifRes = await pool.query(
  //     `SELECT id, title, message, read, type, created_at
  //        FROM notifications
  //        WHERE user_id = $1
  //        ORDER BY created_at DESC
  //        LIMIT 10`,
  //     [user.id]
  //   );

  //   notifications = notifRes.rows; // ✅ YAHAN ASSIGN
  // }

  return <NavbarClient user={user} initialNotifications={notifications} />;
}
