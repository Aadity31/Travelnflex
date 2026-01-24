"use client";

import { useState, useEffect, useRef } from "react";
import UserAvatar from "@/components/UserAvatar";
import Link from "next/link";
import NotificationBellClient from "../NotificationBell/NotificationBell.client";
import {
  Menu,
  X,
  LogIn,
  MapPin,
  User,
  LogOut,
  Settings,
  Heart,
  BookMarked,
  Calendar,
  Home,
  Compass,
  Sunset,
} from "lucide-react";
import type { ReactNode } from "react";
import { signOut } from "next-auth/react";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export default function Navbar({
  user: initialUser,
  children,
}: {
  user: UserType | null;
  children?: React.ReactNode;
}) {
  const [currentUser] = useState(initialUser);
  const [isOpen, setIsOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    {
      href: "/",
      label: "Home",
      icon: Home,
    },
    {
      href: "/destinations",
      label: "Destinations",
      icon: MapPin,
    },
    {
      href: "/activities",
      label: "Activities",
      icon: Compass,
    },
    {
      href: "#",
      label: "Retreats",
      icon: Sunset,
    },
  ];

  const profileLinks = [
    {
      href: "/profile",
      label: "My Profile",
      icon: User,
    },
    {
      href: "/profile/bookings",
      label: "My Bookings",
      icon: Calendar,
    },
    {
      href: "/profile/favorites",
      label: "Favorites",
      icon: Heart,
    },
    {
      href: "/profile/saved",
      label: "Saved Places",
      icon: BookMarked,
    },
    {
      href: "/profile/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    await signOut({ redirect: false });
    setMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed w-full top-0 z-[7000] transition-transform duration-300
        ${hideNav ? "-translate-y-full" : "translate-y-0"}
        backdrop-blur-xl bg-white/10 dark:bg-slate-950/20
        shadow-lg border-b border-white/10 py-2.5`}
      >
        <div className="max-w-[95vw] mx-auto px-4">
          <div className="flex justify-between items-center h-10">
            {/* LOGO */}
            <Link
              href="/"
              onClick={() => {
                setIsOpen(false);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-2"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center">
                <MapPin size={22} />
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 bg-clip-text text-transparent">
                  Devbhoomi
                </div>
                <div className="text-xs font-semibold text-orange-500 tracking-widest">
                  DARSHAN
                </div>
              </div>
            </Link>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              
              <div className="hidden md:flex gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => {
                      setIsOpen(false);
                      setMenuOpen(false);
                    }}
                    className="relative px-4 py-1 text-sm text-white hover:text-orange-400 transition-colors group"
                  >
                    {l.label}

                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
                ))}
              </div>

              {/* ⭐ Notification Bell — LOGIN KE BAAD HI */}
              {currentUser && (
                <div className="hidden md:flex">
                  <NotificationBellClient />
                </div>
              )}


              {/* AUTH - DESKTOP ONLY */}
              {!currentUser ? (
                <Link href="/login">
                  <button className="hidden sm:flex gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold">
                    <LogIn size={18} />
                    Login
                  </button>
                </Link>
              ) : (
                <div className="relative hidden md:block" ref={dropdownRef}>
                  {/* ⭐ Profile Button */}
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/10 transition-all duration-300 group"
                  >
                    <div className="hidden lg:flex flex-col items-end">
                      <span className="text-xs font-semibold text-white">
                        {currentUser.name}
                      </span>
                      <span className="text-[10px] text-gray-300">
                        View Profile
                      </span>
                    </div>

                    {/* ⭐ Profile Avatar */}
                    <UserAvatar
                      name={currentUser.name}
                      image={currentUser.image}
                      size={36}
                      textSize="text-sm"
                      className="ring-2 ring-orange-400/60 group-hover:ring-orange-400 transition-all"
                      key={currentUser.image ?? "no-image"}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpen && (
                    <div
                      className="absolute right-0 mt-3 w-72 rounded-xl
    bg-stone-200/80 backdrop-blur-[32px]
    shadow-xl border border-stone-300/60
    overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      {/* USER INFO */}
                      <div className="px-4 py-4 border-b border-stone-300/60">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            name={currentUser.name}
                            image={currentUser.image}
                            size={48}
                            textSize="text-lg"
                            className="ring-2 ring-orange-400"
                            key={currentUser.image ?? "no-image"}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-stone-900 truncate">
                              {currentUser.name}
                            </p>
                            <p className="text-xs text-stone-600 truncate">
                              {currentUser.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* LINKS */}
                      <div className="py-2">
                        {profileLinks.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => {
                              setIsOpen(false);
                              setMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-3 text-sm
          text-stone-800
          hover:bg-orange-500/5
          transition-all duration-150"
                          >
                            <item.icon size={18} className="text-orange-600" />
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        ))}
                      </div>

                      {/* LOGOUT */}
                      <div className="border-t border-stone-300/60 p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium
        text-red-600
        hover:bg-red-500/5
        rounded-lg transition-all duration-150"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* MOBILE TOGGLE */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-gray-200 hover:bg-white/10"
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
          className="absolute inset-0 backdrop-blur-sm bg-black/30"
          onClick={() => setIsOpen(false)}
        />

        <div className="absolute top-20 left-4 right-4 p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 shadow-2xl">
          {/* ⭐ User Info in Mobile Menu */}
          {currentUser && (
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={currentUser.name}
                  image={currentUser.image}
                  size={48}
                  textSize="text-lg"
                  className="ring-2 ring-orange-400"
                  key={currentUser.image ?? "no-image"}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-lg font-medium text-white  hover:bg-orange-900 "
              >
                {link.label}
              </Link>
            ))}

            {/* Profile Links in Mobile */}
            {currentUser && (
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                {profileLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white  hover:bg-orange-900"
                  >
                    <item.icon size={18} className="text-orange-600" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}

            {!currentUser ? (
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <button className="mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  Login
                </button>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="mt-4 px-4 py-3 rounded-lg bg-red-600 text-white font-semibold flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="h-8 bg-black" />
    </>
  );
}
