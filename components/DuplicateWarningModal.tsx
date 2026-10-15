import React from "react";
import { PotentialDuplicate } from "@/lib/geo";
import { AlertCircle, ThumbsUp, ArrowRight, X, MapPin } from "lucide-react";

interface DuplicateWarningModalProps {
  duplicates: PotentialDuplicate[];
  isOpen: boolean;
  onClose: () => void;
  onProceedAnyway: () => void;
  onUpvoteExisting: (issueId: string) => void;
  isUpvoting?: boolean;
}

export function DuplicateWarningModal({
  duplicates,
  isOpen,
  onClose,
  onProceedAnyway,
  onUpvoteExisting,
  isUpvoting = false,
}: DuplicateWarningModalProps) {
  if (!isOpen || duplicates.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Possible Duplicate Detected!
              </h3>
              <p className="text-xs text-amber-900">
                Found {duplicates.length} open issue(s) reported within 75 meters of your location.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            A neighbor may have already reported this problem. Upvoting the existing ticket boosts its urgency in the municipal queue and avoids duplicate worker dispatch.
          </p>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {duplicates.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-civic-300 bg-slate-50 hover:bg-civic-50/40 transition-all flex items-start gap-4"
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-slate-200"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-civic-700 bg-civic-100 px-1.5 py-0.5 rounded">
                      {item.ticketNumber}
                    </span>
                    <span className="text-xs text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">
                      {item.distanceMeters}m away
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 truncate mt-1">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {item.address}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => onUpvoteExisting(item.id)}
                      disabled={isUpvoting}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-civic-600 hover:bg-civic-700 text-white transition-colors shadow-sm disabled:opacity-50"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      Upvote This ({item.upvoteCount})
                    </button>
                    <a
                      href={`/issues/${item.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1 px-2 py-1.5"
                    >
                      View Ticket <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Is this a different problem?</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-slate-600 hover:text-slate-800 px-3 py-1.5"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onProceedAnyway}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
            >
              No, Submit as New Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
