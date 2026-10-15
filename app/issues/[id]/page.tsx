"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { StatusBadge } from "@/components/StatusBadge";
import { PriorityBadge } from "@/components/PriorityBadge";
import { SlaBadge } from "@/components/SlaBadge";
import { TimelineView } from "@/components/TimelineView";
import { CATEGORY_METADATA, IssueCategory } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import {
  MapPin,
  ThumbsUp,
  MessageSquare,
  ArrowLeft,
  ShieldCheck,
  Send,
  User,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

const InteractiveMap = dynamic(
  () => import("@/components/InteractiveMap").then((mod) => mod.InteractiveMap),
  { ssr: false, loading: () => <div className="h-[220px] bg-slate-100 animate-pulse rounded-xl" /> }
);

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [issue, setIssue] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);

  useEffect(() => {
    fetchIssueDetail();
  }, [id]);

  const fetchIssueDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/issues/${id}`);
      if (res.ok) {
        const data = await res.json();
        setIssue(data.issue);
      } else {
        setIssue(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUpvote = async () => {
    if (!issue) return;
    try {
      setIsUpvoting(true);
      const res = await fetch(`/api/issues/${id}/upvote`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setIssue((prev: any) => ({
          ...prev,
          hasUpvoted: data.hasUpvoted,
          upvoteCount: data.upvoteCount,
        }));
      } else if (res.status === 401) {
        router.push(`/login?redirect=/issues/${id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpvoting(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setIsSubmittingComment(true);
      const res = await fetch(`/api/issues/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (res.ok) {
        const data = await res.json();
        setIssue((prev: any) => ({
          ...prev,
          comments: [...prev.comments, data.comment],
        }));
        setNewComment("");
      } else if (res.status === 401) {
        router.push(`/login?redirect=/issues/${id}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-slate-400">
        Loading ticket tracking data...
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Grievance Not Found</h2>
        <p className="text-xs text-slate-500">The requested ticket does not exist or was removed.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-civic-600 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to City Map
        </Link>
      </div>
    );
  }

  const catMeta = CATEGORY_METADATA[issue.category as IssueCategory];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Overview
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={issue.status} size="md" />
          <PriorityBadge priority={issue.priority} />
        </div>
      </div>

      {/* Main Grid: Left Details & Right Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                  {issue.ticketNumber}
                </span>
                <span className="text-xs font-semibold text-civic-700 bg-civic-50 px-2.5 py-1 rounded-lg border border-civic-200">
                  {catMeta?.label || issue.category}
                </span>
              </div>
              <SlaBadge deadline={issue.slaDeadline} status={issue.status} />
            </div>

            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {issue.title}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {issue.description}
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-civic-600 flex-shrink-0" />
                <span>
                  {issue.address} {issue.landmark ? `(${issue.landmark})` : ""}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-slate-400" />
                <span>Reported by: {issue.reportedBy?.name || "Verified Resident"}</span>
              </div>
            </div>

            {/* Upvote & Social Proof Action */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleToggleUpvote}
                  disabled={isUpvoting}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    issue.hasUpvoted
                      ? "bg-civic-600 text-white border-civic-600 shadow-sm shadow-civic-600/20"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-civic-50 hover:text-civic-700"
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{issue.hasUpvoted ? "Upvoted" : "Upvote Complaint"} ({issue.upvoteCount})</span>
                </button>
                <span className="text-xs text-slate-400">
                  {issue.upvoteCount} neighbor(s) confirmed this issue
                </span>
              </div>
            </div>
          </div>

          {/* Photo Verification Comparison (Before / After) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Visual Evidence & Verification Photos
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Problem Photo */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Reported Problem Photo
                </span>
                {issue.imageUrl ? (
                  <div className="h-52 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={issue.imageUrl}
                      alt="Reported problem"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-52 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                    No initial photo uploaded
                  </div>
                )}
              </div>

              {/* Resolution Proof */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Municipal Proof of Resolution
                </span>
                {issue.resolvedImageUrl ? (
                  <div className="h-52 rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50/50">
                    <img
                      src={issue.resolvedImageUrl}
                      alt="Resolution verification"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-52 rounded-xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-xs text-slate-400 p-4 text-center">
                    <Clock className="w-6 h-6 text-slate-300 mb-1" />
                    <span>Resolution photo will be uploaded once field unit completes repairs.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Comments & Updates Section */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-civic-600" />
              Citizen Feedback & Department Notes ({issue.comments?.length || 0})
            </h3>

            {/* Existing Comments */}
            <div className="space-y-3">
              {issue.comments?.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">No public comments yet.</p>
              ) : (
                issue.comments.map((comment: any) => (
                  <div
                    key={comment.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                      comment.isInternal
                        ? "bg-amber-50 border-amber-200"
                        : "bg-slate-50 border-slate-100"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{comment.user.name}</span>
                        {comment.user.role === "OFFICIAL" && (
                          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded">
                            Staff ({comment.user.department})
                          </span>
                        )}
                        {comment.user.role === "ADMIN" && (
                          <span className="text-[10px] font-bold bg-slate-900 text-white px-1.5 py-0.2 rounded">
                            City Admin
                          </span>
                        )}
                      </div>
                      <time className="text-[10px] text-slate-400">
                        {formatDate(comment.createdAt)}
                      </time>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{comment.content}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Post Form */}
            <form onSubmit={handlePostComment} className="pt-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                placeholder="Leave feedback or ask for an update..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-500"
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !newComment.trim()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-civic-600 hover:bg-civic-700 text-white text-xs font-semibold disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Location Map & Timeline Tracker */}
        <div className="space-y-6">
          {/* Location Map Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-civic-600" />
              Pinpoint Location
            </h3>
            <InteractiveMap
              issues={[issue]}
              center={[issue.latitude, issue.longitude]}
              zoom={15}
              height="200px"
            />
            <p className="text-xs text-slate-500">{issue.address}</p>
          </div>

          {/* Department Routing Info */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-slate-900">Department Routing</h3>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between">
                <span>Assigned Unit:</span>
                <span className="font-semibold text-slate-800">
                  {catMeta?.departmentName || issue.category}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Officer in Charge:</span>
                <span className="font-semibold text-slate-800">
                  {issue.assignedTo?.name || "Pending Allocation"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>SLA Threshold:</span>
                <span className="font-semibold text-slate-800">
                  {catMeta?.defaultSlaHours} Hours
                </span>
              </div>
            </div>
          </div>

          {/* Chronological Audit Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <TimelineView
              timeline={issue.timeline || []}
              currentStatus={issue.status}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
