import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch (err) {
    console.error("Auth check error:", err);
    return NextResponse.json({ authenticated: false });
  }
}
