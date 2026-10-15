"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { IssueCard } from "@/components/IssueCard";
import { CATEGORY_METADATA, IssueCategory } from "@/lib/types";
import {
  ShieldAlert,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
} from "lucide-react";

// Dynamically import Leaflet Map to avoid SSR errors
const InteractiveMap = dynamic(
  () => import("@/components/InteractiveMap").then((mod) => mod.InteractiveMap),
  { ssr: false, loading: () => <div className="h-[450px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-sm">Loading interactive city map...</div> }
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
      <section className="relative bg-gradient-to-b from-sky-50 via-white to-transparent pt-12 pb-8 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-civic-100 text-civic-800 text-xs font-semibold">
                <ShieldAlert className="w-4 h-4 text-civic-600" />
                Next-Gen Municipal Transparency System
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Fix your city. Track every pothole, leak, and streetlight.
              </h1>

              <p className="text-base text-slate-600 leading-relaxed">
                Report infrastructure breakdowns with geotagged accuracy. Our proximity engine eliminates duplicates and enforces strict departmental response SLAs.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/citizen/report"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-civic-600 hover:bg-civic-700 text-white font-semibold text-sm shadow-lg shadow-civic-600/25 transition-all"
                >
                  <PlusCircle className="w-5 h-5" />
                  Report Infrastructure Issue
                </Link>

                <Link
                  href="/citizen"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm shadow-sm transition-all"
                >
                  Track My Complaints
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Performance Metric Counters */}
            <div className="w-full md:w-auto grid grid-cols-2 gap-3 min-w-[300px]">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-medium">Total Registered</span>
                  <TrendingUp className="w-4 h-4 text-civic-500" />
                </div>
                <div className="text-2xl font-black text-slate-900">{stats.total}</div>
                <div className="text-[11px] text-slate-400 mt-1">Across all 5 wards</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-emerald-600 mb-2">
                  <span className="text-xs font-medium text-slate-500">Resolved</span>
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-emerald-600">{stats.resolved}</div>
                <div className="text-[11px] text-slate-400 mt-1">{stats.resolutionRate}% resolution rate</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-indigo-600 mb-2">
                  <span className="text-xs font-medium text-slate-500">In Progress</span>
                  <Clock className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="text-2xl font-black text-indigo-600">{stats.inProgress}</div>
                <div className="text-[11px] text-slate-400 mt-1">Field teams active</div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between text-red-600 mb-2">
                  <span className="text-xs font-medium text-slate-500">SLA Escalated</span>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
                <div className="text-2xl font-black text-red-600">{stats.escalated}</div>
                <div className="text-[11px] text-red-500 font-medium mt-1">Under Mayor review</div>
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
                <MapPin className="w-5 h-5 text-civic-600" />
                Live Civic Heatmap & Geotagged Issues
              </h2>
              <p className="text-xs text-slate-500">
                Explore open complaints across your municipality. Click any pin for tracking details.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-civic-600 inline-block" /> Active
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> In Progress
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Resolved
              </span>
            </div>
          </div>

          <InteractiveMap issues={issues} height="440px" />
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search form */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket, address, keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-500 bg-slate-50/50"
              />
            </form>

            {/* Status Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-stretch sm:self-auto overflow-x-auto">
              {[
                { key: "ALL", label: "All Status" },
                { key: "SUBMITTED", label: "Submitted" },
                { key: "IN_PROGRESS", label: "In Progress" },
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

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1 pr-1">
              <Filter className="w-3.5 h-3.5" /> Department:
            </span>
            <button
              onClick={() => setSelectedCategory("ALL")}
              className={`px-3 py-1 rounded-full border font-medium transition-colors ${
                selectedCategory === "ALL"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
              }`}
            >
              All Categories
            </button>
            {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1 rounded-full border font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === key
                    ? "bg-civic-600 text-white border-civic-600 shadow-sm"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              Community Complaints Feed ({issues.length})
            </h2>
            <span className="text-xs text-slate-400">
              Ranked by community upvotes & SLA priority
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
              <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">No grievances found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No active complaints match your current filter settings. Try switching categories or submit a new grievance.
              </p>
              <Link
                href="/citizen/report"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-civic-600 text-white text-xs font-semibold hover:bg-civic-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                Submit New Complaint
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
