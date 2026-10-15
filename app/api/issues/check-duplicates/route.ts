import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateDistanceMeters, DUPLICATE_RADIUS_METERS, PotentialDuplicate } from "@/lib/geo";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");
    const category = searchParams.get("category");
    const radiusStr = searchParams.get("radius");

    if (!latStr || !lngStr) {
      return NextResponse.json(
        { error: "Latitude and longitude query parameters are required" },
        { status: 400 }
      );
    }

    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);
    const radius = radiusStr ? parseInt(radiusStr, 10) : DUPLICATE_RADIUS_METERS;

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Invalid coordinate values" },
        { status: 400 }
      );
    }

    // Query active grievances (exclude completed/rejected)
    const activeIssues = await prisma.issue.findMany({
      where: {
        status: {
          notIn: ["RESOLVED", "CLOSED", "REJECTED"],
        },
        ...(category ? { category } : {}),
      },
      select: {
        id: true,
        ticketNumber: true,
        title: true,
        category: true,
        status: true,
        latitude: true,
        longitude: true,
        address: true,
        imageUrl: true,
        upvoteCount: true,
        createdAt: true,
      },
    });

    const duplicates: PotentialDuplicate[] = [];

    for (const issue of activeIssues) {
      const distance = calculateDistanceMeters(
        lat,
        lng,
        issue.latitude,
        issue.longitude
      );

      if (distance <= radius) {
        duplicates.push({
          ...issue,
          distanceMeters: distance,
        });
      }
    }

    // Sort by closest proximity first
    duplicates.sort((a, b) => a.distanceMeters - b.distanceMeters);

    return NextResponse.json({
      hasDuplicates: duplicates.length > 0,
      radiusMeters: radius,
      count: duplicates.length,
      duplicates,
    });
  } catch (error) {
    console.error("Duplicate check error:", error);
    return NextResponse.json(
      { error: "Failed to perform duplicate check" },
      { status: 500 }
    );
  }
}
