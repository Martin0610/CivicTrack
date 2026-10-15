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
  defaultSlaHours: number;
  icon: string;
  color: string;
  description: string;
}

export const CATEGORY_METADATA: Record<IssueCategory, CategoryMeta> = {
  ROADS: {
    key: "ROADS",
    label: "Roads & Traffic Hazards",
    departmentName: "Department of Roads & Infrastructure",
    defaultSlaHours: 72, // 3 days
    icon: "Truck",
    color: "amber",
    description: "Potholes, damaged asphalt, missing manhole covers, broken traffic signals",
  },
  SANITATION: {
    key: "SANITATION",
    label: "Sanitation & Waste Management",
    departmentName: "Municipal Solid Waste Management",
    defaultSlaHours: 48, // 2 days
    icon: "Trash2",
    color: "emerald",
    description: "Garbage accumulation, overflowing dumpsters, uncleaned public spaces",
  },
  WATER_DRAINAGE: {
    key: "WATER_DRAINAGE",
    label: "Water Supply & Drainage",
    departmentName: "Water Supply & Sewerage Board",
    defaultSlaHours: 24, // 1 day (urgent)
    icon: "Droplets",
    color: "blue",
    description: "Pipeline bursts, sewage overflow, contaminated water, blocked storm drains",
  },
  ELECTRICITY: {
    key: "ELECTRICITY",
    label: "Electricity & Public Lighting",
    departmentName: "Public Electricity Board",
    defaultSlaHours: 48, // 2 days
    icon: "Zap",
    color: "yellow",
    description: "Dark/broken streetlights, exposed dangling wires, transformer faults",
  },
  OTHER: {
    key: "OTHER",
    label: "General Civic Issue",
    departmentName: "Municipal General Administration",
    defaultSlaHours: 96, // 4 days
    icon: "AlertCircle",
    color: "purple",
    description: "Illegal construction, public park damage, encroachments, noise hazards",
  },
};

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: IssueCategory | null;
}
