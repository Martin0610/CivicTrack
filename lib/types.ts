export type Role = "CITIZEN" | "OFFICIAL" | "ADMIN";

export type IssueCategory =
  | "ROADS"
  | "SANITATION"
  | "WATER_DRAINAGE"
  | "ELECTRICITY"
  | "OTHER";

export type IssueStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED"
  | "CLOSED";

export type Priority = "LOW" | "MEDIUM" | "HIGH" | "EMERGENCY";

export interface CategoryMeta {
  key: IssueCategory;
  label: string;
  departmentName: string;
  authorityCode: string; // e.g. BBMP, BWSSB, BESCOM
  defaultSlaHours: number;
  icon: string;
  color: string;
  description: string;
}

export const CATEGORY_METADATA: Record<IssueCategory, CategoryMeta> = {
  ROADS: {
    key: "ROADS",
    label: "Roads & Pothole Hazards",
    departmentName: "BBMP Road Infrastructure & Traffic Engineering",
    authorityCode: "BBMP-ROADS",
    defaultSlaHours: 72, // 3 days
    icon: "Truck",
    color: "amber",
    description: "Potholes, broken footpaths, damaged median dividers, non-functional traffic signals",
  },
  SANITATION: {
    key: "SANITATION",
    label: "Solid Waste & Sanitation",
    departmentName: "BBMP Solid Waste Management (SWM / Swachhata)",
    authorityCode: "SWM-SWACHH",
    defaultSlaHours: 48, // 2 days
    icon: "Trash2",
    color: "emerald",
    description: "Black spots, overflowing community bins, unsegregated garbage, debris dumping",
  },
  WATER_DRAINAGE: {
    key: "WATER_DRAINAGE",
    label: "Water Supply & Storm Drains (SWD)",
    departmentName: "BWSSB & BBMP Storm Water Drain Division",
    authorityCode: "BWSSB-DRAIN",
    defaultSlaHours: 24, // 1 day (Critical)
    icon: "Droplets",
    color: "blue",
    description: "Cauvery pipe bursts, open stormwater drains (Rajakaluve), sewage overflow, low pressure",
  },
  ELECTRICITY: {
    key: "ELECTRICITY",
    label: "Power & Street Lighting",
    departmentName: "BESCOM (Electricity Supply & Public Lighting)",
    authorityCode: "BESCOM-LT",
    defaultSlaHours: 48, // 2 days
    icon: "Zap",
    color: "yellow",
    description: "Broken LED streetlights, dangling overhead cables, hazardous feeder boxes, transformer sparks",
  },
  OTHER: {
    key: "OTHER",
    label: "General Ward Grievance",
    departmentName: "Zonal Municipal Commissioner Office",
    authorityCode: "WARD-ADMIN",
    defaultSlaHours: 96, // 4 days
    icon: "AlertCircle",
    color: "purple",
    description: "Illegal hoardings, tree branch falls, footpath encroachments, public park maintenance",
  },
};

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: IssueCategory | null;
}
