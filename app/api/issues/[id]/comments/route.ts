import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to comment" },
        { status: 401 }
      );
    }

    const { id: issueId } = params;
    const { content, isInternal = false } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content cannot be empty" },
        { status: 400 }
      );
    }

    // Only staff/admin can post internal notes
    const actualIsInternal =
      isInternal && (user.role === "OFFICIAL" || user.role === "ADMIN");

    const comment = await prisma.comment.create({
      data: {
        issueId,
        userId: user.id,
        content: content.trim(),
        isInternal: actualIsInternal,
      },
      include: {
        user: {
          select: { id: true, name: true, role: true, department: true },
        },
      },
    });

    return NextResponse.json({
      message: "Comment added successfully",
      comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    return NextResponse.json(
      { error: "Failed to add comment" },
      { status: 500 }
    );
  }
}
