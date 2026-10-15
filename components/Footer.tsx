import React from "react";
import Link from "next/link";
import { ShieldAlert, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-sm">
                🇮🇳
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Civic<span className="text-orange-500">Track</span> India
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Unified citizen grievance redressal and municipal infrastructure tracking for Indian urban local bodies (ULBs). Integrated with BBMP, BWSSB, and BESCOM.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Public Portals</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Bengaluru Ward Heatmap
                </Link>
              </li>
              <li>
                <Link href="/citizen/report" className="hover:text-white transition-colors">
                  Report Pothole / Leak / Black Spot
                </Link>
              </li>
              <li>
                <Link href="/citizen" className="hover:text-white transition-colors">
                  My Ward Complaints
                </Link>
              </li>
              <li>
                <Link href="/department" className="hover:text-white transition-colors">
                  BBMP / BWSSB Work Queue
                </Link>
              </li>
            </ul>
          </div>

          {/* Guaranteed Response SLAs */}
          <div>
            <h4 className="text-white font-semibold mb-3">Guaranteed Municipal SLAs</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex justify-between">
                <span>BWSSB Pipeline Burst:</span>
                <span className="font-semibold text-slate-200">24 Hours (Critical)</span>
              </li>
              <li className="flex justify-between">
                <span>SWM Garbage Black Spot:</span>
                <span className="font-semibold text-slate-200">48 Hours</span>
              </li>
              <li className="flex justify-between">
                <span>BESCOM Streetlight Out:</span>
                <span className="font-semibold text-slate-200">48 Hours</span>
              </li>
              <li className="flex justify-between">
                <span>BBMP Pothole Patching:</span>
                <span className="font-semibold text-slate-200">72 Hours</span>
              </li>
            </ul>
          </div>

          {/* Emergency & Municipal Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Official Control Room & Helplines</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>BBMP Sahaya Helpline: <strong>1533</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-yellow-400" />
                <span>BESCOM 24x7 Power: <strong>1912</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>BWSSB Water Leakage: <strong>1916</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400" />
                <span>N.R. Square, Corporation Circle, Bengaluru - 560002</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 CivicTrack India. Open civic data & urban transparency system.</p>
          <p className="flex items-center gap-1">
            Built for Smart Cities & Swachh Bharat with Next.js, Prisma & OpenStreetMap.
          </p>
        </div>
      </div>
    </footer>
  );
}
