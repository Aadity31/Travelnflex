"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/lib/use-loading";

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hideLoading } = useLoading();

  useEffect(() => {
    // 🛑 STOP the loader whenever the URL changes
    hideLoading();
  }, [pathname, searchParams, hideLoading]);

  return null;
}