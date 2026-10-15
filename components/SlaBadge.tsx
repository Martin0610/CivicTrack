import React from "react";
import { getSlaStatus } from "@/lib/utils";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SlaBadgeProps {
  deadline: Date | string;
  status: string;
}

export function SlaBadge({ deadline, status }: SlaBadgeProps) {
  const { isBreached, label, badgeClass } = getSlaStatus(deadline, status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${badgeClass}`}
    >
      {status === "RESOLVED" || status === "CLOSED" ? (
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
      ) : isBreached ? (
        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
      ) : (
        <Clock className="w-3.5 h-3.5 text-sky-600" />
      )}
      <span>{label}</span>
    </span>
  );
}
