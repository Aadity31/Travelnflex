export const dynamic = "force-dynamic";

import NavbarClient from "./Navbar.client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export default async function NavbarServer() {
  const session = await getServerSession(authOptions);

  let user = null;

  if (session?.user?.email) {
    const res = await pool.query(
      `
      SELECT id, name, email, image
      FROM users
      WHERE email = $1
      LIMIT 1
      LIMIT 1
      `,
      [session.user.email]
    );

    user = res.rows[0] ?? null;
  }

  return <NavbarClient user={user} />;
}
