import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateTicketNumber } from "@/lib/utils";
import { CATEGORY_METADATA, IssueCategory } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const isEscalated = searchParams.get("isEscalated");
    const reportedById = searchParams.get("reportedById");
    const assignedToId = searchParams.get("assignedToId");
    const search = searchParams.get("search");

    const where: any = {};

    if (category) where.category = category;
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (isEscalated === "true") where.isEscalated = true;
    if (reportedById) where.reportedById = reportedById;
    if (assignedToId) where.assignedToId = assignedToId;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { ticketNumber: { contains: search } },
        { address: { contains: search } },
      ];
    }

    const issues = await prisma.issue.findMany({
      where,
      include: {
        reportedBy: {
          select: { id: true, name: true, email: true },
        },
        assignedTo: {
          select: { id: true, name: true, department: true },
        },
        _count: {
          select: { comments: true, upvotes: true },
        },
      },
      orderBy: [
        { isEscalated: "desc" },
        { upvoteCount: "desc" },
        { createdAt: "desc" },
      ],
    });

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Fetch issues error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve issues" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to submit an issue" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      category,
      priority = "MEDIUM",
      latitude,
      longitude,
      address,
      landmark,
      imageUrl,
    } = body;

    if (!title || !description || !category || latitude === undefined || longitude === undefined || !address) {
      return NextResponse.json(
        { error: "Title, description, category, address, and GPS coordinates are required" },
        { status: 400 }
      );
    }

    // Determine SLA hours based on category
    const catMeta = CATEGORY_METADATA[category as IssueCategory];
    const slaHours = catMeta ? catMeta.defaultSlaHours : 48;
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    // Auto-assign to a department official if available
    const official = await prisma.user.findFirst({
      where: {
        role: "OFFICIAL",
        department: category,
      },
    });

    const ticketNumber = generateTicketNumber();

    const issue = await prisma.issue.create({
      data: {
        ticketNumber,
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        address: address.trim(),
        landmark: landmark ? landmark.trim() : null,
        imageUrl: imageUrl || null,
        reportedById: user.id,
        assignedToId: official ? official.id : null,
        status: official ? "ASSIGNED" : "SUBMITTED",
        slaDeadline,
        isEscalated: false,
      },
    });

    // Create initial timeline audit record
    await prisma.issueTimeline.create({
      data: {
        issueId: issue.id,
        fromStatus: null,
        toStatus: issue.status,
        action: "Grievance registered",
        note: official
          ? `Auto-assigned to ${catMeta?.departmentName || category} (${official.name})`
          : "Complaint submitted, pending department allocation.",
        actorName: user.name,
      },
    });

    return NextResponse.json(
      { message: "Grievance submitted successfully", issue },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create issue error:", error);
    return NextResponse.json(
      { error: "Failed to submit grievance" },
      { status: 500 }
    );
  }
}
