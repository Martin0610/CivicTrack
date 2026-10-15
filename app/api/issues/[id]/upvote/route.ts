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
        { error: "You must be logged in to upvote" },
        { status: 401 }
      );
    }

    const { id: issueId } = params;

    const existingUpvote = await prisma.upvote.findUnique({
      where: {
        issueId_userId: {
          issueId,
          userId: user.id,
        },
      },
    });

    let hasUpvoted = false;

    if (existingUpvote) {
      // Remove upvote
      await prisma.upvote.delete({
        where: { id: existingUpvote.id },
      });
      await prisma.issue.update({
        where: { id: issueId },
        data: { upvoteCount: { decrement: 1 } },
      });
      hasUpvoted = false;
    } else {
      // Add upvote
      await prisma.upvote.create({
        data: {
          issueId,
          userId: user.id,
        },
      });
      await prisma.issue.update({
        where: { id: issueId },
        data: { upvoteCount: { increment: 1 } },
      });
      hasUpvoted = true;
    }

    const issue = await prisma.issue.findUnique({
      where: { id: issueId },
      select: { upvoteCount: true },
    });

    return NextResponse.json({
      hasUpvoted,
      upvoteCount: issue?.upvoteCount ?? 0,
    });
  } catch (error) {
    console.error("Upvote toggle error:", error);
    return NextResponse.json(
      { error: "Failed to toggle upvote" },
      { status: 500 }
    );
  }
}
