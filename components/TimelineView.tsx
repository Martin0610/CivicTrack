import React from "react";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, Clock, AlertCircle, User, Wrench, ShieldCheck } from "lucide-react";

interface TimelineItem {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  action: string;
  note: string | null;
  actorName: string;
  createdAt: string | Date;
}

interface TimelineViewProps {
  timeline: TimelineItem[];
  currentStatus: string;
}

export function TimelineView({ timeline, currentStatus }: TimelineViewProps) {
  const steps = [
    { key: "SUBMITTED", label: "Submitted" },
    { key: "ASSIGNED", label: "Assigned" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "RESOLVED", label: "Resolved" },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return 0;
      case "ASSIGNED":
      case "UNDER_REVIEW":
        return 1;
      case "IN_PROGRESS":
        return 2;
      case "RESOLVED":
      case "CLOSED":
        return 3;
      default:
        return 0;
    }
  };

  const currentIndex = getStepIndex(currentStatus);

  return (
    <div className="space-y-6">
      {/* Visual Milestone Stepper */}
      <div className="relative border border-slate-200 bg-slate-50/70 p-4 rounded-xl">
        <div className="grid grid-cols-4 gap-2 text-center">
          {steps.map((step, idx) => {
            const isDone = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={step.key} className="flex flex-col items-center relative">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold z-10 transition-colors ${
                    isDone
                      ? "bg-civic-600 text-white shadow-sm ring-4 ring-civic-100"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isCurrent
                      ? "text-civic-700 font-bold"
                      : isDone
                      ? "text-slate-800"
                      : "text-slate-400"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Audit Log / Event Feed */}
      <div className="flow-root">
        <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          Resolution Audit Log & History
        </h4>
        <ul className="-mb-8">
          {timeline.map((event, idx) => {
            const isLast = idx === timeline.length - 1;
            return (
              <li key={event.id} className="relative pb-8">
                {!isLast && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-civic-100 text-civic-700 flex items-center justify-center ring-4 ring-white">
                      {event.toStatus === "RESOLVED" ? (
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                      ) : event.toStatus === "IN_PROGRESS" ? (
                        <Wrench className="h-4 w-4 text-indigo-600" />
                      ) : (
                        <User className="h-4 w-4 text-civic-600" />
                      )}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <p className="text-sm font-medium text-slate-900">
                        {event.action}
                      </p>
                      <time className="text-xs text-slate-400 whitespace-nowrap">
                        {formatDate(event.createdAt)}
                      </time>
                    </div>
                    {event.note && (
                      <p className="mt-1 text-sm text-slate-600 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm">
                        {event.note}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-400">
                      Logged by: <span className="font-medium text-slate-600">{event.actorName}</span>
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
