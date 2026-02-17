import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignupClient from "./SignupClient";

export const metadata: Metadata = {
  title: "Create Account | Devbhoomi Darshan",
  description:
    "Create your Devbhoomi Darshan account to explore sacred destinations and manage your spiritual journeys.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignupPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/"); // already logged in → block signup
  }

  return <SignupClient />;
}

