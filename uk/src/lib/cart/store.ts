"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import type { Activity } from "@/types";

export interface CartItem {
  activity: Activity;
  quantity: number;
  addedAt: string;
}

type CartMap = Record<string, CartItem>;

interface ToastData {
  id: string;
  message: string;
  type: "success" | "error" | "removed";
  isExiting: boolean;
}

export function useCartStore() {
  const { status } = useSession();

  const [items, setItems] = useState<CartMap>({});
  const [showLogin, setShowLogin] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  /* ---------------- TOAST MANAGEMENT ---------------- */
  const hideToastWithAnimation = useCallback((toastId: string) => {
    // Mark as exiting
    setToasts((prev) =>
      prev.map((t) =>
        t.id === toastId ? { ...t, isExiting: true } : t
      )
    );

    // Remove after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toastId));
      
      // Clear timeout ref
      const timeout = timeoutRefs.current.get(toastId);
      if (timeout) {
        clearTimeout(timeout);
        timeoutRefs.current.delete(toastId);
      }
    }, 400); // Match animation duration
  }, []);

  const showToastMessage = useCallback(
    (message: string, type: "success" | "error" | "removed" = "success") => {
      const newToast: ToastData = {
        id: Date.now().toString() + Math.random(),
        message,
        type,
        isExiting: false,
      };

      // Add to stack
      setToasts((prev) => [...prev, newToast]);

      // Auto-hide after 3 seconds
      const timeout = setTimeout(() => {
        hideToastWithAnimation(newToast.id);
      }, 3000);

      timeoutRefs.current.set(newToast.id, timeout);
    },
    [hideToastWithAnimation]
  );

  /* ---------------- HELPERS ---------------- */
  const get = useCallback((id: string) => items[id] || null, [items]);
  const isInCart = useCallback((id: string) => Boolean(items[id]), [items]);

  const cartCount = useMemo(() => Object.keys(items).length, [items]);
  const cartTotal = useMemo(
    () =>
      Object.values(items).reduce(
        (total, item) => total + item.activity.price.min * item.quantity,
        0
      ),
    [items]
  );

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = useCallback(
    async (activity: Activity, quantity: number = 1) => {
      if (status !== "authenticated") {
        setShowLogin(true);
        return false;
      }

      setItems((prev) => ({
        ...prev,
        [activity.id]: {
          activity,
          quantity: (prev[activity.id]?.quantity || 0) + quantity,
          addedAt: new Date().toISOString(),
        },
      }));

      showToastMessage(`${activity.name} added to cart!`, "success");

      try {
        return true;
      } catch {
        setItems((prev) => {
          const newItems = { ...prev };
          if (newItems[activity.id]) {
            newItems[activity.id].quantity -= quantity;
            if (newItems[activity.id].quantity <= 0) {
              delete newItems[activity.id];
            }
          }
          return newItems;
        });
        return false;
      }
    },
    [status, showToastMessage]
  );

  /* ---------------- REMOVE FROM CART ---------------- */
  const removeFromCart = useCallback(
    async (id: string) => {
      const item = items[id];
      const activityName = item?.activity.name || "Item";

      const previousItems = { ...items };
      setItems((prev) => {
        const newItems = { ...prev };
        delete newItems[id];
        return newItems;
      });

      showToastMessage(`${activityName} removed from cart`, "removed");

      try {
        return true;
      } catch {
        setItems(previousItems);
        return false;
      }
    },
    [items, showToastMessage]
  );

  /* ---------------- UPDATE QUANTITY ---------------- */
  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (quantity <= 0) {
        return removeFromCart(id);
      }

      setItems((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          quantity,
        },
      }));

      try {
        return true;
      } catch {
        return false;
      }
    },
    [removeFromCart]
  );

  /* ---------------- CLEAR CART ---------------- */
  const clearCart = useCallback(async () => {
    setItems({});
  }, []);

  return {
    items,
    get,
    isInCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    showLogin,
    closeLogin: () => setShowLogin(false),
    toasts,
    showToast: showToastMessage,
    hideToast: hideToastWithAnimation,
  };
}
