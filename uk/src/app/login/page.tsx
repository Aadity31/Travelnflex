

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { authOptions } from "@/lib/auth";

interface PageProps {
  searchParams: Promise<{
    redirect?: string;
    action?: string;
  }>;
}

export default async function LoginPage({
  searchParams,
}: PageProps) {
  const session = await getServerSession(authOptions);
  const resolvedSearchParams = await searchParams;

  // already login → redirect to intended page
  if (session) {
    if (resolvedSearchParams.redirect) {
      redirect(resolvedSearchParams.redirect);
    }
    redirect("/");
  }

  return <LoginForm redirectUrl={resolvedSearchParams.redirect} action={resolvedSearchParams.action} />;
}
