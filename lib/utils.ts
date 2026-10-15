import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTicketNumber(): string {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `CIVIC-${year}-${randomSuffix}`;
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getSlaStatus(deadline: Date | string, status: string): {
  isBreached: boolean;
  hoursRemaining: number;
  label: string;
  badgeClass: string;
} {
  if (status === "RESOLVED" || status === "CLOSED") {
    return {
      isBreached: false,
      hoursRemaining: 0,
      label: "Completed",
      badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
  }

  const now = new Date().getTime();
  const target = new Date(deadline).getTime();
  const diffHours = Math.round((target - now) / (1000 * 60 * 60));

  if (diffHours < 0) {
    return {
      isBreached: true,
      hoursRemaining: diffHours,
      label: `SLA Breached (${Math.abs(diffHours)}h overdue)`,
      badgeClass: "bg-red-100 text-red-800 border-red-300 font-bold animate-pulse",
    };
  }

  if (diffHours <= 12) {
    return {
      isBreached: false,
      hoursRemaining: diffHours,
      label: `Warning (${diffHours}h left)`,
      badgeClass: "bg-amber-100 text-amber-800 border-amber-300 font-semibold",
    };
  }

  return {
    isBreached: false,
    hoursRemaining: diffHours,
    label: `On Track (${diffHours}h left)`,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  };
}
