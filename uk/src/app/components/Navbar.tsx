'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, MapPin } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/activities', label: 'Activities' },
    { href: '/retreats', label: 'Retreats' },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'}
        border-b border-black/5 dark:border-white/5`}
      >
        <div className="max-w-[90vw] mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white">
                <MapPin size={18} />
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-lg tracking-tight">
                  Devbhoomi
                </div>
                <div className="text-[10px] tracking-widest text-orange-500">
                  DARSHAN
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {links.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300
                  hover:text-orange-600 dark:hover:text-orange-400 transition"
                >
                  {l.label}
                </Link>
              ))}
              <button className="px-4 py-2 rounded-full bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition">
                Login
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300
        ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute top-16 inset-x-4 rounded-2xl bg-white dark:bg-slate-900
          p-6 shadow-xl transition-all duration-300
          ${open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
          <div className="flex flex-col gap-4">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-gray-800 dark:text-gray-200
                hover:text-orange-500 transition"
              >
                {l.label}
              </Link>
            ))}

            <button className="mt-2 w-full py-3 rounded-xl bg-orange-500 text-white font-medium">
              Login
            </button>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
