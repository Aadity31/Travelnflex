"use client";

import { useEffect, useState } from "react";
import { loadingManager } from "./loading";

export function useLoading() {
  const [isLoading, setIsLoading] = useState(loadingManager.isLoading);
  const [loadingText, setLoadingText] = useState(loadingManager.loadingText);

  useEffect(() => {
    const unsubscribe = loadingManager.subscribe((loading, text) => {
      setIsLoading(loading);
      setLoadingText(text);
    });

    return unsubscribe;
  }, []);

  return {
    isLoading,
    loadingText,
    showLoading: (text?: string) => loadingManager.show(text),
    hideLoading: () => loadingManager.hide(),
    withLoading: <T>(fn: () => Promise<T>, text?: string) =>
      loadingManager.withLoading(fn, text),
  };
}
