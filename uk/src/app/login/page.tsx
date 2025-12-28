

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { authOptions } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  // already login  → home bhejo
  if (session) {
    redirect("/");
  }

  return <LoginForm />;
}
