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
import { signOut } from "next-auth/react";

type UserType = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
};

export default function Navbar({
  user: initialUser,
}: {
  user: UserType | null;
  children?: React.ReactNode;
}) {
  const [currentUser] = useState(initialUser);
  const [isOpen, setIsOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ---------- HYDRATION ---------- */
  useEffect(() => {
    setIsHydrated(true);
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
        ${isHydrated && hideNav ? "-translate-y-full" : "translate-y-0"}
        backdrop-blur-xl bg-black/30 
        shadow-lg border-b border-white/10 py-2.5`}
      >
        <div className="max-w-8xl mx-auto px-4 sm:px-8 lg:px-10 xl:px-12">
          <div className="flex justify-between items-center h-12 sm:h-10">
            {/* LOGO */}
            <Link
              href="/"
              onClick={() => {
                setIsOpen(false);
                setMenuOpen(false);
              }}
              className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white flex items-center justify-center">
                <MapPin size="18" className="sm:w-5 sm:h-5 lg:w-[22px] lg:h-[22px]" />
              </div>
              <div className="xs:block">
                <div className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 bg-clip-text text-transparent">
                  TravelnFlex
                </div>
                {/* <div className="text-[10px] sm:text-xs font-semibold text-orange-500 tracking-widest">
                  DARSHAN
                </div> */}
              </div>
            </Link>

            {/* RIGHT */}
            <div className="flex items-center gap-0.5 lg:gap-1">
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

      {/* ================= MOBILE MENU (SLIDE FROM RIGHT) ================= */}
      <div
        className={`fixed inset-0 z-7000 md:hidden transition-all duration-300 ${
          isHydrated && isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 backdrop-blur-md bg-black/40"
          onClick={() => setIsOpen(false)}
        />

        <div 
          className={`absolute top-0 right-0 h-full w-80 sm:w-96 overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
            isHydrated && isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* ⭐ User Info Header */}
          {currentUser && (
            <div 
              className="p-5 border-b sticky top-0"
              style={{
                background: `linear-gradient(135deg, var(--color-primary-lightest) 0%, var(--color-primary-lighter) 100%)`,
                borderColor: `var(--color-primary-light)`
              }}
            >
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
                  <p 
                    className="text-sm font-bold truncate"
                    style={{ color: `var(--foreground)` }}
                  >
                    {currentUser.name}
                  </p>
                  <p 
                    className="text-xs truncate"
                    style={{ color: `var(--foreground-secondary)` }}
                  >
                    {currentUser.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="px-0 py-4">
            {navLinks.map((link) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                >
                  <div 
                    className="flex items-center gap-3 px-5 py-4 font-semibold text-base transition-all duration-200 active:scale-95 cursor-pointer"
                    style={{
                      color: `var(--foreground)`,
                      borderLeft: `4px solid transparent`
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.borderLeftColor = `var(--color-primary)`;
                      e.currentTarget.style.backgroundColor = `var(--color-primary-lightest)`;
                    }}
                    onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                      e.currentTarget.style.borderLeftColor = `transparent`;
                      e.currentTarget.style.backgroundColor = `transparent`;
                    }}
                  >
                    <LinkIcon size={22} style={{ color: `var(--color-primary)` }} />
                    <span>{link.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Profile Section */}
          {currentUser && (
            <div 
              className="my-2 py-4 border-y"
              style={{ borderColor: `var(--border-light)` }}
            >
              {profileLinks.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                  >
                    <div
                      className="flex items-center gap-3 px-5 py-4 font-semibold text-base transition-all duration-200 active:scale-95 cursor-pointer"
                      style={{
                        color: `var(--foreground)`,
                        borderLeft: `4px solid transparent`
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.currentTarget.style.borderLeftColor = `var(--color-primary)`;
                        e.currentTarget.style.backgroundColor = `var(--color-primary-lightest)`;
                      }}
                      onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                        e.currentTarget.style.borderLeftColor = `transparent`;
                        e.currentTarget.style.backgroundColor = `transparent`;
                      }}
                    >
                      <ItemIcon size={22} style={{ color: `var(--color-primary)` }} />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Auth Buttons */}
          <div className="p-5 border-t space-y-3" style={{ borderColor: `var(--border-light)` }}>
            {!currentUser ? (
              <Link href="/login" onClick={() => setIsOpen(false)} className="block">
                <button 
                  className="w-full px-5 py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)`
                  }}
                >
                  <LogIn size={20} />
                  Login Now
                </button>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full px-5 py-4 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, var(--color-error) 0%, var(--color-error-dark) 100%)`
                }}
              >
                <LogOut size={20} />
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
