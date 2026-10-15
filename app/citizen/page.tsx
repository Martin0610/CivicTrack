"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IssueCard } from "@/components/IssueCard";
import { PlusCircle, FileText, CheckCircle, Clock, ShieldAlert } from "lucide-react";

export default function CitizenDashboardPage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadCitizenData();
  }, []);

  const loadCitizenData = async () => {
    try {
      setLoading(true);
      const userRes = await fetch("/api/auth/me");
      const userData = await userRes.json();
      setUser(userData.user);

      if (userData.user) {
        const issuesRes = await fetch(`/api/issues?reportedById=${userData.user.id}`);
        const issuesData = await issuesRes.json();
        setIssues(issuesData.issues || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resolvedCount = issues.filter((i) => i.status === "RESOLVED" || i.status === "CLOSED").length;
  const inProgressCount = issues.filter((i) => i.status === "IN_PROGRESS").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Citizen Grievance Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time resolution progress and department updates on your submitted reports.
          </p>
        </div>

        <Link
          href="/citizen/report"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-civic-600 hover:bg-civic-700 text-white font-semibold text-xs shadow-md shadow-civic-500/20 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          File New Grievance
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">My Submissions</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{issues.length}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-civic-50 text-civic-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">In Progress</span>
            <div className="text-2xl font-black text-indigo-600 mt-1">{inProgressCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase">Resolved</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">{resolvedCount}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* My Issues Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          My Reported Complaints ({issues.length})
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : issues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No grievances filed yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You haven't reported any civic infrastructure issues yet. Help improve your community by submitting your first report.
            </p>
            <Link
              href="/citizen/report"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-civic-600 text-white text-xs font-semibold hover:bg-civic-700 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Report Issue Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
