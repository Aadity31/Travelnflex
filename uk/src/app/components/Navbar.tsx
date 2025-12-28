"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, LogIn, MapPin, User, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [user, setUser] = useState<UserType | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ---------- AUTH ---------- */
  useEffect(() => {
    fetch("/api/auth/user")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => {});
  }, []);

  /* ---------- SCROLL ---------- */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      if (current < 200) {
        setHideNav(false);
        setLastScrollY(current);
        return;
      }

      setHideNav(current > lastScrollY);
      setLastScrollY(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* ---------- CLOSE DROPDOWN ---------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Destinations" },
    { href: "/activities", label: "Activities" },
    { href: "#", label: "Retreats" },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut({ redirect: false });
    window.location.href = "/";
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed w-full top-0 z-50 transition-transform duration-300
        ${hideNav ? "-translate-y-full" : "translate-y-0"}
        backdrop-blur-xl bg-gradient-to-r from-saffron-50/95 via-white/95 to-sky-50/95 dark:from-slate-900/95 dark:via-slate-950/95 dark:to-slate-900/95
        shadow-lg border-b border-saffron-200/30 dark:border-sky-700/30 py-2.5`}
      >
        <div className="max-w-[95vw] mx-auto px-4">
          <div className="flex justify-between items-center h-10">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 px-3 py-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-saffron-500 via-orange-600 to-red-600 shadow-md flex items-center justify-center">
                <MapPin size={22} className="text-white" />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-saffron-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Devbhoomi
                </div>
                <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 tracking-widest">
                  DARSHAN
                </div>
              </div>
            </Link>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {/* DESKTOP LINKS */}
              <div className="hidden md:flex gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="relative px-4 py-1 text-sm text-slate-700 dark:text-slate-200 font-medium group hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                  >
                    {l.label}
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-saffron-500 via-orange-500 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  </Link>
                ))}
              </div>

              {/* AUTH */}
              {!user ? (
                <Link href="/login">
                  <button className="hidden sm:flex gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-saffron-500 via-orange-600 to-red-600 hover:from-saffron-600 hover:via-orange-700 hover:to-red-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                    <LogIn size={18} />
                    Login
                  </button>
                </Link>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="w-9 h-9 rounded-full ring-2 ring-orange-500/70 hover:ring-orange-600 overflow-hidden transition-all duration-300"
                  >
                    <img
                      src={user.image || "/avatar.png"}
                      className="w-full h-full object-cover"
                      alt="avatar"
                    />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-3 w-44 rounded-xl bg-white dark:bg-slate-800 shadow-xl border border-orange-100 dark:border-slate-700 overflow-hidden">
                      <Link
                        href="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700/70 transition-colors"
                      >
                        <User size={16} className="text-orange-600" /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* MOBILE TOGGLE */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-orange-100/50 dark:hover:bg-slate-800/50 transition-colors"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MOBILE MENU ================= */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 backdrop-blur-sm bg-black/40"
          onClick={() => setIsOpen(false)}
        />

        <div className="absolute top-20 left-4 right-4 p-6 rounded-2xl bg-white/98 dark:bg-slate-800/98 shadow-2xl border border-orange-200/50 dark:border-slate-700/50">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-lg font-medium text-slate-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-950/30 dark:hover:to-red-950/30 hover:text-orange-600 dark:hover:text-orange-400 transition-all"
              >
                {link.label}
              </Link>
            ))}

            {!user ? (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <button className="mt-4 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-saffron-500 via-orange-600 to-red-600 hover:from-saffron-600 hover:via-orange-700 hover:to-red-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all">
                  <LogIn size={18} />
                  Login
                </button>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="mt-4 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-8" />
    </>
  );
}
