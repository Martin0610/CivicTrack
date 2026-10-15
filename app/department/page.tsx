"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { SlaBadge } from "@/components/SlaBadge";
import { CATEGORY_METADATA, IssueCategory, IssueStatus } from "@/lib/types";
import {
  Wrench,
  Camera,
  ExternalLink,
  X,
  Building,
} from "lucide-react";

export default function DepartmentQueuePage() {
  const [issues, setIssues] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<string>("ROADS");
  const [loading, setLoading] = useState(true);

  // Status Update Modal state
  const [activeIssue, setActiveIssue] = useState<any | null>(null);
  const [newStatus, setNewStatus] = useState<IssueStatus>("IN_PROGRESS");
  const [actionNote, setActionNote] = useState("");
  const [resolvedImageUrl, setResolvedImageUrl] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchDepartmentIssues();
  }, [selectedDept]);

  const fetchDepartmentIssues = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/issues?category=${selectedDept}`);
      const data = await res.json();
      setIssues(data.issues || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (issue: any, statusToSet: IssueStatus) => {
    setActiveIssue(issue);
    setNewStatus(statusToSet);
    setActionNote("");
    setResolvedImageUrl("");
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIssue) return;

    try {
      setIsUpdating(true);
      const res = await fetch(`/api/issues/${activeIssue.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          note: actionNote || (newStatus === "RESOLVED" ? "Inspected and verified on site by TCMC engineer." : "TCMC/TANGEDCO field gang mobilized."),
          action: newStatus === "RESOLVED" ? "Marked as Resolved" : "Work Commenced",
          resolvedImageUrl: newStatus === "RESOLVED" ? resolvedImageUrl : undefined,
        }),
      });

      if (res.ok) {
        setActiveIssue(null);
        fetchDepartmentIssues();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const catMeta = CATEGORY_METADATA[selectedDept as IssueCategory];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Wrench className="w-3.5 h-3.5 text-emerald-700" />
            Tambaram City Municipal Corporation (TCMC) Field Operations
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Department Work Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Claim assigned ward complaints across Tambaram, Vandalur, and Mudichur sectors.
          </p>
        </div>
      </div>

      {/* Department Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setSelectedDept(key)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              selectedDept === key
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
            }`}
          >
            <span>{meta.authorityCode}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-current">
              {meta.defaultSlaHours}h SLA
            </span>
          </button>
        ))}
      </div>

      {/* Active Department Info Banner */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
        <div>
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-emerald-950">{catMeta.departmentName}</span>
          </div>
          <p className="text-slate-600 text-[11px] mt-0.5">{catMeta.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-900">{issues.length} active tickets</span>
          <span className="bg-white border border-emerald-200 px-2.5 py-1 rounded-lg text-emerald-800 font-bold">
            Target SLA: {catMeta.defaultSlaHours} Hours
          </span>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading work orders...</div>
        ) : issues.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No pending tickets in this department queue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Ticket</th>
                  <th className="px-5 py-3.5">Grievance Summary & Ward</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">SLA Countdown</th>
                  <th className="px-5 py-3.5">Upvotes</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {issues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {issue.ticketNumber}
                    </td>

                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate">{issue.title}</div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {issue.address}
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={issue.status} size="sm" />
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <SlaBadge deadline={issue.slaDeadline} status={issue.status} />
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-700 whitespace-nowrap">
                      {issue.upvoteCount} votes
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-2">
                      {issue.status !== "IN_PROGRESS" && issue.status !== "RESOLVED" && (
                        <button
                          onClick={() => handleOpenModal(issue, "IN_PROGRESS")}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200"
                        >
                          Start Work
                        </button>
                      )}

                      {issue.status !== "RESOLVED" && (
                        <button
                          onClick={() => handleOpenModal(issue, "RESOLVED")}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold border border-emerald-200"
                        >
                          Resolve
                        </button>
                      )}

                      <Link
                        href={`/issues/${issue.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 inline-block align-middle"
                        title="View Full Details"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {activeIssue && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in">
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Update Work Order: {activeIssue.ticketNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  Target status: <span className="font-bold text-emerald-800">{newStatus}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveIssue(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Department Work Log / Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={
                    newStatus === "RESOLVED"
                      ? "Detail the repairs completed (e.g., hot-mix asphalt patching completed on Mudichur Road, tested by TCMC engineer)..."
                      : "Provide gang dispatch details, vehicle number, and expected completion..."
                  }
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
                />
              </div>

              {newStatus === "RESOLVED" && (
                <div>
                  <label className="block font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Proof of Resolution Image URL (Recommended)
                  </label>
                  <div className="relative">
                    <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      placeholder="https://... photo link of completed work"
                      value={resolvedImageUrl}
                      onChange={(e) => setResolvedImageUrl(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveIssue(null)}
                  className="px-3 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-sm disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Confirm Status Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
