"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapIssue {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  status: string;
  latitude: number;
  longitude: number;
  address: string;
  imageUrl?: string | null;
}

interface InteractiveMapProps {
  issues?: MapIssue[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  isPicker?: boolean;
  onSelectLocation?: (lat: number, lng: number) => void;
  selectedPoint?: [number, number] | null;
}

export function InteractiveMap({
  issues = [],
  center = [40.7128, -74.006],
  zoom = 13,
  height = "450px",
  isPicker = false,
  onSelectLocation,
  selectedPoint,
}: InteractiveMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Fix leaflet marker icon paths
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;

      if (isPicker && onSelectLocation) {
        map.on("click", (e: L.LeafletMouseEvent) => {
          const { lat, lng } = e.latlng;
          onSelectLocation(lat, lng);
        });
      }
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center if props change
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center);
    }
  }, [center[0], center[1], zoom]);

  // Handle selected picker point
  useEffect(() => {
    if (!mapInstanceRef.current || !isPicker) return;

    if (selectedPoint) {
      const [lat, lng] = selectedPoint;
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.setLatLng([lat, lng]);
      } else {
        const customIcon = L.divIcon({
          className: "custom-picker-pin",
          html: `<div style="background-color: #0284c7; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3);"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        pickerMarkerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(
          mapInstanceRef.current
        );
      }
    } else if (pickerMarkerRef.current && mapInstanceRef.current) {
      mapInstanceRef.current.removeLayer(pickerMarkerRef.current);
      pickerMarkerRef.current = null;
    }
  }, [selectedPoint, isPicker]);

  // Render issue markers
  useEffect(() => {
    if (!markersRef.current || isPicker) return;

    markersRef.current.clearLayers();

    issues.forEach((issue) => {
      let pinColor = "#0284c7"; // default civic blue
      if (issue.status === "RESOLVED") pinColor = "#10b981"; // green
      else if (issue.status === "IN_PROGRESS") pinColor = "#6366f1"; // indigo
      else if (issue.category === "WATER_DRAINAGE") pinColor = "#0ea5e9";
      else if (issue.category === "SANITATION") pinColor = "#14b8a6";

      const customIcon = L.divIcon({
        className: "custom-issue-pin",
        html: `<div style="background-color: ${pinColor}; width: 22px; height: 22px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.25);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      const popupHtml = `
        <div style="font-family: inherit; font-size: 13px; min-width: 180px;">
          <div style="font-size: 11px; font-weight: bold; color: ${pinColor}; margin-bottom: 2px;">
            ${issue.ticketNumber} • ${issue.status}
          </div>
          <div style="font-weight: 600; color: #0f172a; margin-bottom: 4px;">
            ${issue.title}
          </div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">
            ${issue.address}
          </div>
          <a href="/issues/${issue.id}" style="display: inline-block; font-size: 11px; font-weight: 600; color: #0284c7; text-decoration: underline;">
            View Tracking Details &rarr;
          </a>
        </div>
      `;

      const marker = L.marker([issue.latitude, issue.longitude], {
        icon: customIcon,
      }).bindPopup(popupHtml);

      markersRef.current?.addLayer(marker);
    });
  }, [issues, isPicker]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
      <div ref={mapContainerRef} style={{ width: "100%", height }} />
      {isPicker && (
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 shadow-md pointer-events-none z-[1000]">
          Click on the map to pin exact complaint location
        </div>
      )}
    </div>
  );
}
