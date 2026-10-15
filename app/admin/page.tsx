"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { SlaBadge } from "@/components/SlaBadge";
import { CATEGORY_METADATA, IssueCategory } from "@/lib/types";
import {
  Building2,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  ShieldAlert,
  ExternalLink,
  Users,
  BarChart3,
} from "lucide-react";

export default function AdminHubPage() {
  const [stats, setStats] = useState<any>(null);
  const [escalatedIssues, setEscalatedIssues] = useState<any[]>([]);
  const [allIssues, setAllIssues] = useState<any[]>([]);
  const [filterEscalatedOnly, setFilterEscalatedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, [filterEscalatedOnly]);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, issuesRes] = await Promise.all([
        fetch("/api/stats"),
        fetch(`/api/issues${filterEscalatedOnly ? "?isEscalated=true" : ""}`),
      ]);

      const statsData = await statsRes.json();
      const issuesData = await issuesRes.json();

      setStats(statsData);
      setAllIssues(issuesData.issues || []);

      // Filter escalated/overdue
      const now = new Date().getTime();
      const breached = (issuesData.issues || []).filter(
        (i: any) =>
          i.isEscalated ||
          (new Date(i.slaDeadline).getTime() < now &&
            i.status !== "RESOLVED" &&
            i.status !== "CLOSED")
      );
      setEscalatedIssues(breached);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold mb-2">
          <Building2 className="w-3.5 h-3.5 text-amber-400" />
          Municipal Administrator & Commissioner Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          City-wide SLA Escalation & Oversight Hub
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor service-level agreement adherence, resolve department bottlenecks, and audit civic infrastructure health.
        </p>
      </div>

      {/* KPI Counters */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase">Total City Grievances</span>
            <div className="text-3xl font-black text-slate-900 mt-1">{stats.total}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Registered in municipal log</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase">Resolution Rate</span>
            <div className="text-3xl font-black text-emerald-600 mt-1">{stats.resolutionRate}%</div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              {stats.resolved} of {stats.total} closed
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs font-semibold text-slate-400 uppercase">Active In Progress</span>
            <div className="text-3xl font-black text-indigo-600 mt-1">{stats.inProgress}</div>
            <span className="text-[11px] text-slate-500 mt-1 block">Field units on site</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-sm bg-red-50/20">
            <span className="text-xs font-semibold text-red-500 uppercase flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> SLA Breaches
            </span>
            <div className="text-3xl font-black text-red-600 mt-1">{stats.escalated}</div>
            <span className="text-[11px] text-red-600 font-bold mt-1 block">Requires Mayor review</span>
          </div>
        </div>
      )}

      {/* Urgent SLA Escalation Alert Section */}
      {escalatedIssues.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-red-950">
                  Critical SLA Escalation Alerts ({escalatedIssues.length})
                </h3>
                <p className="text-xs text-red-700">
                  These tickets have exceeded the guaranteed turnaround threshold without resolution.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {escalatedIssues.map((issue) => (
              <div
                key={issue.id}
                className="bg-white p-4 rounded-xl border border-red-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {issue.ticketNumber}
                    </span>
                    <SlaBadge deadline={issue.slaDeadline} status={issue.status} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{issue.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{issue.address}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-red-700 font-semibold bg-red-100 px-2 py-0.5 rounded text-[10px]">
                    Department: {issue.category}
                  </span>
                  <Link
                    href={`/issues/${issue.id}`}
                    className="font-bold text-civic-600 hover:text-civic-800 flex items-center gap-1"
                  >
                    Investigate Ticket &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Department Performance Breakdown */}
      {stats?.categoryStats && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-civic-600" />
            Department Performance & Resolution Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.categoryStats.map((item: any) => {
              const meta = CATEGORY_METADATA[item.category as IssueCategory];
              return (
                <div key={item.category} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {meta?.label || item.category}
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-slate-900">{item.resolutionRate}%</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {item.resolved} / {item.total} fixed
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-civic-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.resolutionRate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Issues Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Master Municipal Grievance Register ({allIssues.length})
          </h3>
          <button
            onClick={() => setFilterEscalatedOnly(!filterEscalatedOnly)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
              filterEscalatedOnly
                ? "bg-red-600 text-white border-red-600"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {filterEscalatedOnly ? "Showing Escalated Only" : "Filter Escalated"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Summary</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">SLA Status</th>
                <th className="px-4 py-3">Upvotes</th>
                <th className="px-4 py-3 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allIssues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900">
                    {issue.ticketNumber}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-600">
                    {issue.category}
                  </td>
                  <td className="px-4 py-3 max-w-xs font-medium text-slate-900 truncate">
                    {issue.title}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={issue.status} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <SlaBadge deadline={issue.slaDeadline} status={issue.status} />
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-700">
                    {issue.upvoteCount}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/issues/${issue.id}`}
                      className="text-civic-600 hover:text-civic-800 font-semibold"
                    >
                      Audit &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
