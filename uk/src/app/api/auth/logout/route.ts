import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  // 1️⃣ Remove manual auth cookie
  (await
        // 1️⃣ Remove manual auth cookie
        cookies()).set({
    name: "manual-auth-token",
    value: "",
    path: "/",
    maxAge: 0,
  });

  // 2️⃣ Return success
  return NextResponse.json({ success: true });
}
