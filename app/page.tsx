"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { IssueCard } from "@/components/IssueCard";
import { CATEGORY_METADATA, IssueCategory } from "@/lib/types";
import {
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Building,
} from "lucide-react";

// Dynamically import Leaflet Map to avoid SSR errors
const InteractiveMap = dynamic(
  () => import("@/components/InteractiveMap").then((mod) => mod.InteractiveMap),
  { ssr: false, loading: () => <div className="h-[450px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-sm">Loading Bengaluru ward map...</div> }
);

export default function HomePage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    total: 0,
    resolved: 0,
    inProgress: 0,
    escalated: 0,
    resolutionRate: 100,
  });
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIssues();
    fetchStats();
  }, [selectedCategory, selectedStatus]);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== "ALL") params.append("category", selectedCategory);
      if (selectedStatus !== "ALL") params.append("status", selectedStatus);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/issues?${params.toString()}`);
      const data = await res.json();
      setIssues(data.issues || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvote = async (issueId: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/upvote`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setIssues((prev) =>
          prev.map((item) =>
            item.id === issueId
              ? { ...item, upvoteCount: data.upvoteCount }
              : item
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchIssues();
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-b from-orange-50/60 via-white to-transparent pt-12 pb-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-semibold">
                <span className="text-sm">🇮🇳</span>
                Bengaluru Municipal Grievance Redressal Portal
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Fix your ward. Track every pothole, pipeline burst, and dark street.
              </h1>

              <p className="text-base text-slate-600 leading-relaxed">
                Empowering Bengaluru residents to report civic breakdowns directly to BBMP, BWSSB, and BESCOM. Automated proximity duplicate detection eliminates repeated tickets, while strict SLA countdowns ensure accountability.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/citizen/report"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm shadow-lg shadow-orange-600/25 transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  Report Civic Issue in 60s
                </Link>

                <Link
                  href="/citizen"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm shadow-sm transition-all"
                >
                  Track My Ward Complaints
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Performance Metric Counters */}
            <div className="w-full md:w-auto grid grid-cols-2 gap-3 min-w-[310px]">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-medium">Ward Grievances</span>
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">{stats.total}</div>
                <div className="text-[11px] text-slate-400 mt-1">Across 198 BBMP Wards</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-600 mb-2">
                  <span className="text-xs font-medium text-slate-500">Resolved Work</span>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-emerald-600">{stats.resolved}</div>
                <div className="text-[11px] text-slate-400 mt-1">{stats.resolutionRate}% SLA clearance</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-indigo-600 mb-2">
                  <span className="text-xs font-medium text-slate-500">Field Units Active</span>
                  <Clock className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-black text-indigo-600">{stats.inProgress}</div>
                <div className="text-[11px] text-slate-400 mt-1">BBMP / BESCOM crews</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-red-200 shadow-sm bg-red-50/20 flex flex-col justify-between">
                <div className="flex items-center justify-between text-red-600 mb-2">
                  <span className="text-xs font-medium text-slate-500">SLA Breaches</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-black text-red-600">{stats.escalated}</div>
                <div className="text-[11px] text-red-600 font-bold mt-1">Escalated to Zonal IAS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Interactive Public Map */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Live Bengaluru Ward Heatmap & Pothole Pins
              </h2>
              <p className="text-xs text-slate-500">
                Live geotagged grievances across Indiranagar, Koramangala, HSR Layout, Whitefield, and Central wards.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-600 inline-block" /> Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> Gang Working
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Verified Fixed
              </span>
            </div>
          </div>

          <InteractiveMap
            issues={issues}
            center={[12.9716, 77.5946]}
            zoom={12}
            height="460px"
          />
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket, ward, road name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 bg-slate-50/50"
              />
            </form>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto overflow-x-auto">
              {[
                { key: "ALL", label: "All Grievances" },
                { key: "SUBMITTED", label: "Registered" },
                { key: "IN_PROGRESS", label: "Work In Progress" },
                { key: "RESOLVED", label: "Resolved" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    selectedStatus === tab.key
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Department Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 pr-1 whitespace-nowrap">
              <Filter className="w-3.5 h-3.5" /> Authority:
            </span>
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1 rounded-full border font-medium transition-colors whitespace-nowrap ${
                selectedCategory === "ALL"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Municipal Bodies
            </button>
            {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 rounded-full border font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === key
                    ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {meta.authorityCode} ({meta.label})
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Ward Infrastructure Register ({issues.length} Active Records)
            </h2>
            <span className="text-xs text-slate-400">
              Prioritized by citizen upvotes & municipal SLA urgency
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-xl bg-slate-100 animate-pulse border border-slate-200"
                />
              ))}
            </div>
          ) : issues.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
              <Building className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No active complaints found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No open complaints match your current filter selection. Report a new grievance to alert the ward engineer.
              </p>
              <Link
                href="/citizen/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-semibold hover:bg-orange-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Report Problem
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onUpvote={handleUpvote}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
