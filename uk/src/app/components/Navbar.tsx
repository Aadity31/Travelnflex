"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, LogIn, MapPin } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [hideNav, setHideNav] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // ---- TOP SAFE ZONE ----
      if (currentScrollY < 200) {
        setHideNav(false);
        setLastScrollY(currentScrollY);
        return;
      }

      // ---- FOLLOW LOGIC ----
      if (currentScrollY > lastScrollY) {
        setHideNav(true); // scroll down
      } else {
        setHideNav(false); // scroll up
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/destinations", label: "Destinations" },
    { href: "/activities", label: "Activities" },
    { href: "#", label: "Retreats" },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed w-full top-0 z-50
        transition-transform duration-300 ease-in-out
        ${hideNav ? "-translate-y-full" : "translate-y-0"}
        backdrop-blur-xl bg-white/10 dark:bg-slate-950/20
        shadow-lg shadow-orange-200/10 dark:shadow-orange-900/10
        border-b border-white/10 
        py-2.5`}
      >
        <div className="max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            {/* Logo */}
            <Link href="/" className="flex items-center group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-orange-500 rounded-lg opacity-0 group-hover:opacity-20 blur-lg transition-all duration-300" />

                <div className="relative flex items-center gap-2 px-3 py-2">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin size={22} />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 bg-clip-text text-transparent">
                      Devbhoomi
                    </span>
                    <span className="text-xs font-semibold text-orange-500 tracking-widest">
                      DARSHAN
                    </span>
                  </div>
                </div>
              </div>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="relative px-4 py-1 text-sm font-medium text-white dark:text-white transition-all duration-300 group"
                  >
                    <span className="relative z-10">{link.label}</span>
                    <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Link>
                ))}
              </div>
              <Link href="/login">
                <button className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold text-sm shadow-lg hover:shadow-orange-400/50 transition-all duration-300 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-2">
                    <LogIn size={18} />
                    Login
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-white/10 transition"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
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

        <div className="absolute top-20 left-4 right-4 p-6 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="px-4 py-3 rounded-lg font-medium hover:bg-orange-100 dark:hover:bg-orange-900/30 transition"
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setIsOpen(false)}>
              <button className="mt-4 px-4 py-3 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold flex items-center justify-center gap-2">
                <LogIn size={18} />
                Login
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-8" />
    </>
  );
}
