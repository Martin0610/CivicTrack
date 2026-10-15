import React from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                🏛️
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                Civic<span className="text-emerald-500">Track</span> Tambaram
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Official public infrastructure monitoring and grievance redressal system covering Tambaram City Municipal Corporation (70 Wards) and Vandalur Suburban Zone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Public Portals</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Tambaram & Vandalur Ward Map
                </Link>
              </li>
              <li>
                <Link href="/citizen/report" className="hover:text-white transition-colors">
                  Report Mudichur / GST Road Problem
                </Link>
              </li>
              <li>
                <Link href="/citizen" className="hover:text-white transition-colors">
                  My Ward Grievances
                </Link>
              </li>
              <li>
                <Link href="/department" className="hover:text-white transition-colors">
                  TCMC / TANGEDCO Work Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Guaranteed Response SLAs */}
          <div>
            <h4 className="text-white font-semibold mb-3">Guaranteed Municipal SLAs</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex justify-between">
                <span>Palar/Metro Water Pipe Burst:</span>
                <span className="font-semibold text-slate-200">24 Hours (Critical)</span>
              </li>
              <li className="flex justify-between">
                <span>Vandalur/GST Road Waste:</span>
                <span className="font-semibold text-slate-200">48 Hours</span>
              </li>
              <li className="flex justify-between">
                <span>TANGEDCO Streetlight Out:</span>
                <span className="font-semibold text-slate-200">48 Hours</span>
              </li>
              <li className="flex justify-between">
                <span>Mudichur Pothole Patching:</span>
                <span className="font-semibold text-slate-200">72 Hours</span>
              </li>
            </ul>
          </div>

          {/* Emergency & Municipal Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Official Control Room & Helplines</h4>
            <ul className="space-y-2.5 text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>TCMC Toll-free Sahaya: <strong>1800 425 4355</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-yellow-400" />
                <span>TANGEDCO Minnagam: <strong>94987 94987</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Metro Water & Drainage: <strong>044-45674567 / 1916</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>28, Muthuranga Mudali St, West Tambaram, Chennai - 600045</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© 2026 Tambaram City Municipal Corporation (TCMC). Open civic transparency system.</p>
          <p className="flex items-center gap-1">
            Built for Tambaram, Vandalur, Chromepet & Perungalathur Wards.
          </p>
        </div>
      </div>
    </footer>
  );
}
