"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  phone?: string;
  location?: string;
  joinedDate?: string;
  bio?: string;
};

export const useUserFetcher = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/user", {
          credentials: "include",
        });

        if (!res.ok) {
          router.replace("/login");
          return;
        }

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error("USER FETCH ERROR:", err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return { user, loading };
};
