

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { authOptions } from "@/lib/auth";

interface PageProps {
  searchParams: {
    redirect?: string;
    action?: string;
  };
}

export default async function LoginPage({
  searchParams,
}: PageProps) {
  const session = await getServerSession(authOptions);

  // already login → redirect to intended page
  if (session) {
    if (searchParams.redirect) {
      redirect(searchParams.redirect);
    }
    redirect("/");
  }

  return <LoginForm redirectUrl={searchParams.redirect} action={searchParams.action} />;
}
