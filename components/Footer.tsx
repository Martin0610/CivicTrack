import React from "react";
import Link from "next/link";
import { ShieldAlert, Heart, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-civic-500 text-white flex items-center justify-center font-bold">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Civic<span className="text-civic-400">Track</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Empowering citizens and municipal departments through transparent issue reporting, automated department routing, duplicate detection, and real-time SLA accountability.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Public Portals</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Live Public Map
                </Link>
              </li>
              <li>
                <Link href="/citizen/report" className="hover:text-white transition-colors">
                  Report a Problem
                </Link>
              </li>
              <li>
                <Link href="/citizen" className="hover:text-white transition-colors">
                  Track My Complaints
                </Link>
              </li>
              <li>
                <Link href="/department" className="hover:text-white transition-colors">
                  Department Work Queue
                </Link>
              </li>
            </ul>
          </div>

          {/* Municipal SLAs */}
          <div>
            <h4 className="text-white font-semibold mb-3">Guaranteed Response SLAs</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex justify-between">
                <span>Water Bursts:</span>
                <span className="font-semibold text-slate-200">24 Hours</span>
              </li>
              <li className="flex justify-between">
                <span>Sanitation & Waste:</span>
                <span className="font-semibold text-slate-200">48 Hours</span>
              </li>
              <li className="flex justify-between">
                <span>Broken Streetlights:</span>
                <span className="font-semibold text-slate-200">48 Hours</span>
              </li>
              <li className="flex justify-between">
                <span>Potholes & Asphalt:</span>
                <span className="font-semibold text-slate-200">72 Hours</span>
              </li>
            </ul>
          </div>

          {/* Emergency & Municipal Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Municipal Control Room</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-civic-400" />
                <span>Toll-Free Helpline: 311 / 1800-CIVIC</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-civic-400" />
                <span>support@civictrack.org</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-civic-400" />
                <span>City Hall, Municipal Secretariat</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 CivicTrack Municipal System. Open data & transparency platform.</p>
          <p className="flex items-center gap-1">
            Built for civic impact with Next.js, Prisma & OpenStreetMap.
          </p>
        </div>
      </div>
    </footer>
  );
}
