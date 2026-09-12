"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  User,
} from "lucide-react";

/**
 * Header
 * ------
 * Sticky, translucent (70% white, blurred) top bar.
 */

const NAV_LINKS = [
  { label: "Overview", href: "/" },
  { label: "Risk Monitoring", href: "/risk-monitoring" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(Boolean(sessionStorage.getItem("mplads_access_token")));

    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/70 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo + Ministry identity */}
        <Link href="/" className="flex min-w-0 items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="MPLADS AI-Powered Monitoring - Government of India"
            className="h-12 w-auto object-contain py-0.5"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right cluster: auth */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Auth control */}
          {!isLoggedIn ? (
            <Link
              href="/login"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
            >
              Login
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-slate-700 transition-colors hover:bg-slate-50"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
                  <User size={16} />
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings size={15} />
                    Settings
                  </button>
                  <button
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
                    onClick={() => {
                      sessionStorage.removeItem("mplads_access_token");
                      setIsLoggedIn(false);
                      setMenuOpen(false);
                    }}
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white/95 px-4 pb-4 pt-2 backdrop-blur-md md:hidden">
          <div className="mb-3 flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-slate-800">
              Ministry of Statistics and Programme Implementation
            </span>
            <span className="text-[11px] text-slate-500">
              Members of Parliament Local Area Development Scheme
            </span>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

