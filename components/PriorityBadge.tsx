import React from "react";
import { Priority } from "@/lib/types";

interface PriorityBadgeProps {
  priority: Priority | string;
  size?: "sm" | "md";
}

export function PriorityBadge({ priority, size = "md" }: PriorityBadgeProps) {
  const getStyles = () => {
    switch (priority) {
      case "EMERGENCY":
        return "bg-red-600 text-white border-red-700 animate-pulse font-bold";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-300 font-semibold";
      case "MEDIUM":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "LOW":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded border font-medium uppercase tracking-wider ${getStyles()} ${sizeClasses[size]}`}
    >
      {priority}
    </span>
  );
}
