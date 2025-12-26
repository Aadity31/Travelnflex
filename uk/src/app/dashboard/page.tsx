'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // ✅ redirect only on client after auth status is known
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // ✅ loading state (build-safe)
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // ✅ prevent render before redirect
  if (!session) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Sacred Journeys Dashboard
          </h1>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold mb-4">
            Welcome, {session.user?.name}
          </h2>

          <p className="text-gray-600 mb-4">
            Email: {session.user?.email}
          </p>

          {session.user?.image && (
            <div className="mb-6">
              <Image
                src={session.user.image}
                alt={session.user.name || "User"}
                width={96}
                height={96}
                className="rounded-full"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                My Bookings
              </h3>
              <p className="text-gray-600">
                View your upcoming bookings and past experiences
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                Saved Destinations
              </h3>
              <p className="text-gray-600">
                Access your favorite destinations and activities
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-2">
                My Reviews
              </h3>
              <p className="text-gray-600">
                Manage reviews and ratings for your experiences
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
