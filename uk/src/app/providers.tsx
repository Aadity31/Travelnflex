"use client";

import { SessionProvider } from "next-auth/react";
import LoadingOverlay from "./components/LoadingOverlay"; // ✅ Import yaha

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LoadingOverlay /> {/* ✅ Yaha move karo */}
      {children}
    </SessionProvider>
  );
}
