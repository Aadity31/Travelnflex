import NavbarClient from "./Navbar.client";
// export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


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
