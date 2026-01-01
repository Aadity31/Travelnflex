"use client";
import { useEffect } from "react";
import { useLoading } from "@/lib/use-loading";

export default function HomeLoader() {
  const { hideLoading } = useLoading();

  useEffect(() => {
    hideLoading();
  }, [hideLoading]);

  return null; // It renders nothing, just runs logic
}
