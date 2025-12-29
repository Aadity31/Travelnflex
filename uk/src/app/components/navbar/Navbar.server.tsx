import NavbarClient from "./Navbar.client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ⭐ Optional: Force dynamic rendering for real-time session updates
export const dynamic = "force-dynamic";

export default async function NavbarServer() {
  const session = await getServerSession(authOptions);

  const user = session?.user
    ? {
        id: session.user.id ?? "",
        name: session.user.name ?? "",
        email: session.user.email ?? "",
        image: session.user.image ?? null,
      }
    : null;

  return <NavbarClient user={user} />;
}
