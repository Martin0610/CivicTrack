import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const total = await prisma.issue.count();
    const resolved = await prisma.issue.count({
      where: { status: { in: ["RESOLVED", "CLOSED"] } },
    });
    const inProgress = await prisma.issue.count({
      where: { status: "IN_PROGRESS" },
    });
    const submitted = await prisma.issue.count({
      where: { status: { in: ["SUBMITTED", "UNDER_REVIEW", "ASSIGNED"] } },
    });

    // Check for SLA breaches in open tickets
    const now = new Date();
    const escalated = await prisma.issue.count({
      where: {
        status: { notIn: ["RESOLVED", "CLOSED", "REJECTED"] },
        OR: [
          { isEscalated: true },
          { slaDeadline: { lt: now } },
        ],
      },
    });

    // Category breakdown
    const categories = ["ROADS", "SANITATION", "WATER_DRAINAGE", "ELECTRICITY", "OTHER"];
    const categoryStats = await Promise.all(
      categories.map(async (cat) => {
        const catTotal = await prisma.issue.count({ where: { category: cat } });
        const catResolved = await prisma.issue.count({
          where: { category: cat, status: { in: ["RESOLVED", "CLOSED"] } },
        });
        return {
          category: cat,
          total: catTotal,
          resolved: catResolved,
          pending: catTotal - catResolved,
          resolutionRate: catTotal > 0 ? Math.round((catResolved / catTotal) * 100) : 100,
        };
      })
    );

    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

    return NextResponse.json({
      total,
      resolved,
      inProgress,
      submitted,
      escalated,
      resolutionRate,
      categoryStats,
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json(
      { error: "Failed to load municipal statistics" },
      { status: 500 }
    );
  }
}
