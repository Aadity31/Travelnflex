import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import pool from "@/lib/db";

export async function GET(req: NextRequest) {
  /* -----------------------------
     Auth
  ------------------------------ */
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return new Response("Unauthorized", { status: 401 });
  }

  /* -----------------------------
     Get User
  ------------------------------ */
  const userRes = await pool.query(
    `
    SELECT id
    FROM users
    WHERE email = $1
    LIMIT 1
    `,
    [session.user.email]
  );

  if (userRes.rowCount === 0) {
    return new Response("User not found", { status: 404 });
  }

  const userId = userRes.rows[0].id;

  /* -----------------------------
     SSE Setup
  ------------------------------ */
  const encoder = new TextEncoder();

  let lastCheck = new Date().toISOString();

  const stream = new ReadableStream({
    async start(controller) {
      /* Send initial ping */
      controller.enqueue(
        encoder.encode("event: connected\ndata: ok\n\n")
      );

      const interval = setInterval(async () => {
        try {
          /* -----------------------------
             Fetch new notifications
          ------------------------------ */
          const res = await pool.query(
            `
            SELECT id, title, message, type, is_read, created_at, link
            FROM notifications
            WHERE user_id = $1
              AND created_at > $2
            ORDER BY created_at ASC
            `,
            [userId, lastCheck]
          );

          if (res.rows.length > 0) {
            lastCheck = new Date().toISOString();

            for (const notif of res.rows) {
              const data = `data: ${JSON.stringify(notif)}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }
        } catch (err) {
          console.error("SSE error:", err);
        }
      }, 5000); // poll every 5s

      /* Cleanup */
      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
