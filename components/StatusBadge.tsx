import React from "react";
import { IssueStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: IssueStatus | string;
  size?: "sm" | "md" | "lg";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const getStyles = () => {
    switch (status) {
      case "SUBMITTED":
        return "bg-slate-100 text-slate-700 border-slate-300";
      case "UNDER_REVIEW":
        return "bg-yellow-50 text-yellow-800 border-yellow-300";
      case "ASSIGNED":
        return "bg-sky-50 text-sky-700 border-sky-300";
      case "IN_PROGRESS":
        return "bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold";
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold";
      case "CLOSED":
        return "bg-gray-100 text-gray-700 border-gray-300";
      case "REJECTED":
        return "bg-rose-50 text-rose-700 border-rose-300";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "SUBMITTED":
        return "Submitted";
      case "UNDER_REVIEW":
        return "Under Review";
      case "ASSIGNED":
        return "Assigned";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
      case "REJECTED":
        return "Rejected";
      default:
        return status;
    }
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1",
    lg: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${getStyles()} ${sizeClasses[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {getLabel()}
    </span>
  );
}
