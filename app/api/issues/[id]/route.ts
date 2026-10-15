import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const currentUser = await getCurrentUser();

    const issue = await prisma.issue.findUnique({
      where: { id },
      include: {
        reportedBy: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, email: true, department: true },
        },
        timeline: {
          orderBy: { createdAt: "asc" },
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, role: true, department: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
        upvotes: {
          select: { userId: true },
        },
      },
    });

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const hasUpvoted = currentUser
      ? issue.upvotes.some((u) => u.userId === currentUser.id)
      : false;

    // Filter out internal comments if user is just a citizen
    const isStaffOrAdmin =
      currentUser && (currentUser.role === "OFFICIAL" || currentUser.role === "ADMIN");

    const visibleComments = isStaffOrAdmin
      ? issue.comments
      : issue.comments.filter((c) => !c.isInternal);

    return NextResponse.json({
      issue: {
        ...issue,
        comments: visibleComments,
        hasUpvoted,
      },
    });
  } catch (error) {
    console.error("Fetch issue detail error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve issue details" },
      { status: 500 }
    );
  }
}
