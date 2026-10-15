import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "OFFICIAL" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only department staff or administrators can update grievance status" },
        { status: 403 }
      );
    }

    const { id } = params;
    const { status, note, action, resolvedImageUrl, assignedToId } = await request.json();

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const existingIssue = await prisma.issue.findUnique({
      where: { id },
    });

    if (!existingIssue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (resolvedImageUrl) {
      updateData.resolvedImageUrl = resolvedImageUrl;
    }

    if (assignedToId !== undefined) {
      updateData.assignedToId = assignedToId;
    }

    if (status === "RESOLVED" || status === "CLOSED") {
      updateData.isEscalated = false;
    }

    const updatedIssue = await prisma.issue.update({
      where: { id },
      data: updateData,
    });

    // Record timeline audit trail
    await prisma.issueTimeline.create({
      data: {
        issueId: id,
        fromStatus: existingIssue.status,
        toStatus: status,
        action: action || `Status updated to ${status}`,
        note: note || (resolvedImageUrl ? "Resolution proof photo submitted." : null),
        actorName: `${user.name} (${user.role})`,
      },
    });

    return NextResponse.json({
      message: "Issue status updated successfully",
      issue: updatedIssue,
    });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
