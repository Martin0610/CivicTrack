"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { SessionUser } from "@/lib/types";
import {
  MapPin,
  FileText,
  UserCheck,
  Building2,
  LogOut,
  PlusCircle,
  ChevronDown,
} from "lucide-react";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  const switchRole = async (email: string) => {
    setIsSwitching(true);
    try {
      const password =
        email.startsWith("admin") ? "admin123" :
        email.startsWith("citizen") ? "citizen123" : "official123";

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setDropdownOpen(false);

        if (data.user.role === "ADMIN") router.push("/admin");
        else if (data.user.role === "OFFICIAL") router.push("/department");
        else router.push("/citizen");

        router.refresh();
      }
    } catch (err) {
      console.error("Quick switch error:", err);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tambaram Municipal Badge */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:bg-emerald-800 transition-colors font-bold text-sm">
                🏛️
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  Civic<span className="text-emerald-700">Track</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  Tambaram & Vandalur Wards
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname === "/"
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <MapPin className="w-4 h-4 text-emerald-600" />
                Live Ward Map
              </Link>

              <Link
                href="/citizen"
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith("/citizen")
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <FileText className="w-4 h-4" />
                Citizen Desk
              </Link>

              <Link
                href="/department"
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith("/department")
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <UserCheck className="w-4 h-4" />
                TCMC / TANGEDCO Queue
              </Link>

              <Link
                href="/admin"
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname.startsWith("/admin")
                    ? "bg-emerald-50 text-emerald-800"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Building2 className="w-4 h-4" />
                TCMC Commissioner Hub
              </Link>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors"
                title="Switch demo personas"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Persona Switcher</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400 border-b border-slate-100">
                    Switch Active Persona (1-Click)
                  </div>
                  <button
                    onClick={() => switchRole("citizen@civictrack.in")}
                    disabled={isSwitching}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex flex-col transition-colors"
                  >
                    <span className="font-semibold text-slate-800">Karthik Ramaswamy (Citizen)</span>
                    <span className="text-[10px] text-slate-400">Mudichur Road, Tambaram West (Ward 42)</span>
                  </button>
                  <button
                    onClick={() => switchRole("roads@civictrack.in")}
                    disabled={isSwitching}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex flex-col transition-colors"
                  >
                    <span className="font-semibold text-slate-800">Thiru K. Saravanan</span>
                    <span className="text-[10px] text-slate-400">AEE (TCMC Road Infrastructure & Highways)</span>
                  </button>
                  <button
                    onClick={() => switchRole("sanitation@civictrack.in")}
                    disabled={isSwitching}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex flex-col transition-colors"
                  >
                    <span className="font-semibold text-slate-800">Dr. Deepa Sundaram</span>
                    <span className="text-[10px] text-slate-400">TCMC Chief City Health Officer (SWM)</span>
                  </button>
                  <button
                    onClick={() => switchRole("admin@civictrack.in")}
                    disabled={isSwitching}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 flex flex-col transition-colors border-t border-slate-100"
                  >
                    <span className="font-semibold text-emerald-800">Dr. Alby John Varghese, IAS</span>
                    <span className="text-[10px] text-slate-400">Commissioner, Tambaram Corporation</span>
                  </button>
                </div>
              )}
            </div>

            {/* User Session Info or Login */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold text-slate-800">{user.name}</span>
                  <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 inline-block self-end">
                    {user.role} {user.department ? `(${user.department})` : ""}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/citizen/report"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  Report Issue
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
