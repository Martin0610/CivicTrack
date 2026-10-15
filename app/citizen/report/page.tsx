"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CATEGORY_METADATA, IssueCategory, Priority } from "@/lib/types";
import { DuplicateWarningModal } from "@/components/DuplicateWarningModal";
import { PotentialDuplicate } from "@/lib/geo";
import {
  MapPin,
  Camera,
  AlertTriangle,
  Send,
  Navigation,
  CheckCircle,
  Clock,
  ShieldAlert,
} from "lucide-react";

const InteractiveMap = dynamic(
  () => import("@/components/InteractiveMap").then((mod) => mod.InteractiveMap),
  { ssr: false, loading: () => <div className="h-[300px] bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-slate-400 text-xs">Loading map picker...</div> }
);

export default function ReportIssuePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IssueCategory>("ROADS");
  const [priority, setPriority] = useState<Priority>("MEDIUM");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [latitude, setLatitude] = useState<number | null>(40.7128);
  const [longitude, setLongitude] = useState<number | null>(-74.006);

  const [duplicates, setDuplicates] = useState<PotentialDuplicate[]>([]);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const catMeta = CATEGORY_METADATA[category];

  // Check proximity duplicates whenever location is picked
  const checkDuplicates = async (lat: number, lng: number, cat: string) => {
    try {
      setIsCheckingDuplicates(true);
      const res = await fetch(
        `/api/issues/check-duplicates?lat=${lat}&lng=${lng}&category=${cat}&radius=75`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.hasDuplicates && data.duplicates.length > 0) {
          setDuplicates(data.duplicates);
          setShowDuplicateModal(true);
        }
      }
    } catch (err) {
      console.error("Duplicate search failed:", err);
    } finally {
      setIsCheckingDuplicates(false);
    }
  };

  const handleSelectLocation = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
    checkDuplicates(lat, lng, category);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        setAddress(`GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Current Location)`);
        checkDuplicates(lat, lng, category);
      },
      (err) => {
        alert("Unable to retrieve your location: " + err.message);
      }
    );
  };

  const handleUpvoteExisting = async (issueId: string) => {
    try {
      await fetch(`/api/issues/${issueId}/upvote`, { method: "POST" });
      router.push(`/issues/${issueId}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title || !description || !address || latitude === null || longitude === null) {
      setErrorMsg("Please fill in all required fields and pick a map location.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          priority,
          latitude,
          longitude,
          address,
          landmark,
          imageUrl: imageUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/login?redirect=/citizen/report");
          return;
        }
        throw new Error(data.error || "Failed to submit complaint");
      }

      router.push(`/issues/${data.issue.id}`);
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-civic-50 text-civic-700 text-xs font-semibold mb-2">
          <ShieldAlert className="w-3.5 h-3.5" />
          Direct Citizen Grievance Portal
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Report an Urban Infrastructure Problem
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Every report is geotagged, routed automatically to the designated field department, and backed by a municipal SLA response guarantee.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Category & SLA info */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Issue Category <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {Object.entries(CATEGORY_METADATA).map(([key, meta]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setCategory(key as IssueCategory);
                  if (latitude && longitude) checkDuplicates(latitude, longitude, key);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  category === key
                    ? "border-civic-600 bg-civic-50/50 ring-2 ring-civic-500/20 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                }`}
              >
                <span className="text-xs font-bold text-slate-900">{meta.label}</span>
                <span className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-civic-600" />
                  {meta.defaultSlaHours}h SLA
                </span>
              </button>
            ))}
          </div>

          <div className="mt-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900">Assigned Department: </span>
              {catMeta.departmentName}
            </div>
            <span className="text-[11px] font-semibold text-civic-700 bg-civic-100/70 px-2.5 py-0.5 rounded-full">
              Guaranteed {catMeta.defaultSlaHours}h Turnaround
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Complaint Summary <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Broken streetlight causing dark pedestrian crossing"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-500"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Detailed Description <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Describe the severity, how long it has been present, and any immediate safety hazards..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-500"
          />
        </div>

        {/* Priority & Photo URL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Severity Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-500 bg-white"
            >
              <option value="LOW">Low (Cosmetic/Minor inconvenience)</option>
              <option value="MEDIUM">Medium (Normal priority)</option>
              <option value="HIGH">High (Impacts traffic or sanitation)</option>
              <option value="EMERGENCY">Emergency (Immediate hazard to life/health)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Problem Photo URL (Optional)
            </label>
            <div className="relative">
              <Camera className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                placeholder="https://... or photo link"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-500"
              />
            </div>
          </div>
        </div>

        {/* Map Location Picker */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-civic-600" />
              Geotagged Location (Click on map to pin) <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="inline-flex items-center gap-1 text-xs font-semibold text-civic-600 hover:text-civic-700 bg-civic-50 hover:bg-civic-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Navigation className="w-3.5 h-3.5" />
              Use Current GPS
            </button>
          </div>

          <InteractiveMap
            isPicker={true}
            onSelectLocation={handleSelectLocation}
            selectedPoint={latitude && longitude ? [latitude, longitude] : null}
            center={latitude && longitude ? [latitude, longitude] : [40.7128, -74.006]}
            height="320px"
          />

          {isCheckingDuplicates && (
            <p className="text-xs text-amber-600 font-medium animate-pulse">
              Scanning vicinity for duplicate complaints...
            </p>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-medium">Street Address / Area</label>
              <input
                type="text"
                required
                placeholder="e.g. 142 Central Avenue, Downtown"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-600 font-medium">Nearby Landmark (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Near Metro Station Gate 2"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-civic-500/20 focus:border-civic-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-civic-600 hover:bg-civic-700 text-white font-semibold text-xs shadow-md shadow-civic-500/20 disabled:opacity-50 transition-all"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Registering Grievance..." : "Submit Grievance"}
          </button>
        </div>
      </form>

      {/* Duplicate Warning Modal */}
      <DuplicateWarningModal
        duplicates={duplicates}
        isOpen={showDuplicateModal}
        onClose={() => setShowDuplicateModal(false)}
        onProceedAnyway={() => setShowDuplicateModal(false)}
        onUpvoteExisting={handleUpvoteExisting}
      />
    </div>
  );
}
