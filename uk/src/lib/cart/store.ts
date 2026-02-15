"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Activity } from "@/types";

const CART_STORAGE_KEY = "devbhoomi_cart";

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

// Minimal activity data for adding to cart from booking pages
interface MinimalActivityData {
  id: string;
  name: string;
  slug: string;
  location: string;
  price: number;
  image?: string;
}

// Helper to load cart from localStorage
function loadCartFromStorage(): CartMap {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

// Helper to save cart to localStorage
function saveCartToStorage(items: CartMap): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

export function useCartStore() {
  const { status } = useSession();

  const [items, setItems] = useState<CartMap>({});
  const [showLogin, setShowLogin] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = loadCartFromStorage();
    setItems(storedCart);
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage when items change
  useEffect(() => {
    if (isHydrated) {
      saveCartToStorage(items);
    }
  }, [items, isHydrated]);

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

  /* ---------------- ADD TO CART FROM DETAILS PAGE ---------------- */
  const addToCartFromDetails = useCallback(
    async (activityData: MinimalActivityData, quantity: number = 1) => {
      if (status !== "authenticated") {
        setShowLogin(true);
        return false;
      }

      // Construct a minimal Activity-like object
      const activity: Activity = {
        id: activityData.id,
        name: activityData.name,
        slug: activityData.slug,
        type: "adventure", // default type
        description: "",
        shortDescription: "",
        duration: "",
        location: activityData.location,
        difficulty: "moderate",
        rating: 0,
        reviewCount: 0,
        maxGroupSize: 20,
        images: activityData.image ? [activityData.image] : [],
        highlights: [],
        includes: [],
        isPopular: false,
        isTrending: false,
        price: {
          min: activityData.price,
          max: activityData.price,
          currency: "INR",
        },
        createdAt: new Date().toISOString(),
      };

      setItems((prev) => ({
        ...prev,
        [activity.id]: {
          activity,
          quantity: (prev[activity.id]?.quantity || 0) + quantity,
          addedAt: new Date().toISOString(),
        },
      }));

      showToastMessage(`${activity.name} added to cart!`, "success");

      return true;
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
    if (typeof window !== "undefined") {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  return {
    items,
    get,
    isInCart,
    addToCart,
    addToCartFromDetails,
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
    isHydrated,
  };
}
