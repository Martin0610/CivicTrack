"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, LogIn, AlertCircle, ArrowRight, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/citizen";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.role === "ADMIN") router.push("/admin");
      else if (data.user.role === "OFFICIAL") router.push("/department");
      else router.push(redirect);

      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const loginDemoAccount = async (demoEmail: string, demoPass: string, defaultPath: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: demoEmail, password: demoPass }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(defaultPath);
        router.refresh();
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-civic-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-civic-600/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to CivicTrack
          </h1>
          <p className="text-xs text-slate-500">
            Access your citizen reports, municipal dispatch queues, or admin dashboard.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Demo Fast-Login Box */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            One-Click Demo Personas:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => loginDemoAccount("citizen@civictrack.org", "citizen123", "/citizen")}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-civic-400 text-left transition-colors text-xs flex flex-col justify-between"
            >
              <span className="font-bold text-slate-900">Alex Rivera</span>
              <span className="text-[10px] text-slate-400">Citizen Persona</span>
            </button>

            <button
              type="button"
              onClick={() => loginDemoAccount("roads@civictrack.org", "official123", "/department")}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-civic-400 text-left transition-colors text-xs flex flex-col justify-between"
            >
              <span className="font-bold text-slate-900">Marcus Vance</span>
              <span className="text-[10px] text-slate-400">Roads Official</span>
            </button>

            <button
              type="button"
              onClick={() => loginDemoAccount("sanitation@civictrack.org", "official123", "/department")}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-civic-400 text-left transition-colors text-xs flex flex-col justify-between"
            >
              <span className="font-bold text-slate-900">Elena Rostova</span>
              <span className="text-[10px] text-slate-400">Sanitation Official</span>
            </button>

            <button
              type="button"
              onClick={() => loginDemoAccount("admin@civictrack.org", "admin123", "/admin")}
              className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-left transition-colors text-xs flex flex-col justify-between"
            >
              <span className="font-bold">City Admin</span>
              <span className="text-[10px] text-slate-300">Commissioner Hub</span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@civictrack.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-civic-600 hover:bg-civic-700 text-white font-semibold text-xs shadow-md shadow-civic-600/20 disabled:opacity-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{" "}
          <Link href="/register" className="font-bold text-civic-600 hover:underline">
            Register as a citizen
          </Link>
        </p>
      </div>
    </div>
  );
}
