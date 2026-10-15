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
  authorityCode: string; // e.g. TCMC, CMWSSB, TANGEDCO
  defaultSlaHours: number;
  icon: string;
  color: string;
  description: string;
}

export const CATEGORY_METADATA: Record<IssueCategory, CategoryMeta> = {
  ROADS: {
    key: "ROADS",
    label: "Roads, Potholes & GST Road Hazards",
    departmentName: "Tambaram City Municipal Corporation (TCMC) & State Highways Dept",
    authorityCode: "TCMC-ROADS",
    defaultSlaHours: 72, // 3 days
    icon: "Truck",
    color: "amber",
    description: "Potholes on Mudichur Road, GST Road cracks, broken medians, damaged pedestrian footpaths",
  },
  SANITATION: {
    key: "SANITATION",
    label: "Solid Waste Management & Swachhata",
    departmentName: "TCMC Public Health & Solid Waste Management Division",
    authorityCode: "TCMC-SWM",
    defaultSlaHours: 48, // 2 days
    icon: "Trash2",
    color: "emerald",
    description: "Open black spots, overflowing dumper bins near Vandalur junction, roadside meat/vegetable waste",
  },
  WATER_DRAINAGE: {
    key: "WATER_DRAINAGE",
    label: "Drinking Water & Stormwater Drains (SWD)",
    departmentName: "Chennai Metro Water (CMWSSB) & Tambaram UGD Division",
    authorityCode: "CMWSSB-WATER",
    defaultSlaHours: 24, // 1 day (Critical)
    icon: "Droplets",
    color: "blue",
    description: "Palar/Chembarambakkam drinking water pipe burst, open storm drain culverts, Mudichur waterlogging",
  },
  ELECTRICITY: {
    key: "ELECTRICITY",
    label: "Power Distribution & Public Lighting",
    departmentName: "TANGEDCO (Tambaram & Vandalur Sub-Division)",
    authorityCode: "TANGEDCO-LT",
    defaultSlaHours: 48, // 2 days
    icon: "Zap",
    color: "yellow",
    description: "Failed LED streetlights on Gandhi Road, sagging overhead cables, junction box sparks",
  },
  OTHER: {
    key: "OTHER",
    label: "General Ward Infrastructure",
    departmentName: "Zonal Municipal Commissioner Office (Tambaram / Vandalur)",
    authorityCode: "TCMC-ADMIN",
    defaultSlaHours: 96, // 4 days
    icon: "AlertCircle",
    color: "purple",
    description: "Footpath encroachments, fallen tree branches, cattle nuisance, public park maintenance",
  },
};

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department?: IssueCategory | null;
}
