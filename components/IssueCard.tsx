import React from "react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { SlaBadge } from "./SlaBadge";
import { CATEGORY_METADATA, IssueCategory } from "@/lib/types";
import { MapPin, ThumbsUp, MessageSquare, ArrowUpRight } from "lucide-react";

interface IssueCardProps {
  issue: {
    id: string;
    ticketNumber: string;
    title: string;
    description: string;
    category: string;
    status: string;
    priority: string;
    address: string;
    imageUrl?: string | null;
    resolvedImageUrl?: string | null;
    slaDeadline: Date | string;
    upvoteCount: number;
    isEscalated?: boolean;
    _count?: {
      comments: number;
      upvotes?: number;
    };
  };
  onUpvote?: (id: string) => void;
  hasUpvoted?: boolean;
}

export function IssueCard({ issue, onUpvote, hasUpvoted }: IssueCardProps) {
  const cat = CATEGORY_METADATA[issue.category as IssueCategory];

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-civic-300 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Top Banner / Image */}
      {issue.imageUrl ? (
        <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
          <img
            src={issue.imageUrl}
            alt={issue.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold bg-slate-900/80 text-white backdrop-blur-sm px-2 py-0.5 rounded shadow-sm">
              {issue.ticketNumber}
            </span>
            <PriorityBadge priority={issue.priority} size="sm" />
          </div>
          <div className="absolute bottom-3 right-3">
            <SlaBadge deadline={issue.slaDeadline} status={issue.status} />
          </div>
        </div>
      ) : (
        <div className="p-4 pb-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {issue.ticketNumber}
            </span>
            <PriorityBadge priority={issue.priority} size="sm" />
          </div>
          <SlaBadge deadline={issue.slaDeadline} status={issue.status} />
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-civic-700 bg-civic-50 px-2 py-0.5 rounded-full border border-civic-200">
              {cat?.label || issue.category}
            </span>
            <StatusBadge status={issue.status} size="sm" />
          </div>

          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-civic-700 transition-colors">
            {issue.title}
          </h3>

          <p className="mt-1 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {issue.description}
          </p>

          <p className="mt-2.5 text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{issue.address}</span>
          </p>
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onUpvote && onUpvote(issue.id)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                hasUpvoted
                  ? "bg-civic-600 text-white border-civic-600"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-civic-50 hover:text-civic-700"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{issue.upvoteCount}</span>
            </button>

            {issue._count?.comments !== undefined && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                <MessageSquare className="w-3.5 h-3.5" />
                {issue._count.comments}
              </span>
            )}
          </div>

          <Link
            href={`/issues/${issue.id}`}
            className="text-xs font-semibold text-civic-600 hover:text-civic-800 flex items-center gap-0.5"
          >
            Track Issue <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
