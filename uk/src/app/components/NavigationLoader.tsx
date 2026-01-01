"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoading } from "@/lib/use-loading";

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hideLoading } = useLoading();
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      hideLoading();
      return;
    }
    const timer = setTimeout(() => {
      hideLoading();
    }, 500); // 👈 YAHAN TIME CHANGE KARO

    return () => clearTimeout(timer);
  }, [pathname, searchParams, hideLoading, isFirstLoad]);

  return null;
}
