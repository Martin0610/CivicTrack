import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CivicTrack database...");

  // Clean existing records
  await prisma.auditLog.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.upvote.deleteMany();
  await prisma.issueTimeline.deleteMany();
  await prisma.issue.deleteMany();
  await prisma.user.deleteMany();

  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedOfficialPassword = await bcrypt.hash("official123", 10);
  const hashedCitizenPassword = await bcrypt.hash("citizen123", 10);

  // 1. Create Municipal Admin
  const admin = await prisma.user.create({
    data: {
      name: "Mayor Office Commissioner",
      email: "admin@civictrack.org",
      passwordHash: hashedAdminPassword,
      role: "ADMIN",
      phone: "+1-555-0199",
    },
  });

  // 2. Create Department Officials
  const roadsOfficial = await prisma.user.create({
    data: {
      name: "Marcus Vance (Roads Dept)",
      email: "roads@civictrack.org",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "ROADS",
      phone: "+1-555-0121",
    },
  });

  const sanitationOfficial = await prisma.user.create({
    data: {
      name: "Elena Rostova (Sanitation)",
      email: "sanitation@civictrack.org",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "SANITATION",
      phone: "+1-555-0122",
    },
  });

  const waterOfficial = await prisma.user.create({
    data: {
      name: "David Chen (Water & Drainage)",
      email: "water@civictrack.org",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "WATER_DRAINAGE",
      phone: "+1-555-0123",
    },
  });

  const electricOfficial = await prisma.user.create({
    data: {
      name: "Sarah Jenkins (Electricity)",
      email: "electric@civictrack.org",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "ELECTRICITY",
      phone: "+1-555-0124",
    },
  });

  // 3. Create Citizens
  const citizen1 = await prisma.user.create({
    data: {
      name: "Alex Rivera",
      email: "citizen@civictrack.org",
      passwordHash: hashedCitizenPassword,
      role: "CITIZEN",
      phone: "+1-555-0301",
    },
  });

  const citizen2 = await prisma.user.create({
    data: {
      name: "Priya Sharma",
      email: "priya@example.com",
      passwordHash: hashedCitizenPassword,
      role: "CITIZEN",
      phone: "+1-555-0302",
    },
  });

  const now = new Date();

  // 4. Create Sample Grievances / Issues

  // Issue 1: Severe Pothole on Market Street (IN_PROGRESS)
  const issue1 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-2026-1001",
      title: "Deep crater-sized pothole causing traffic gridlock",
      description: "A 2-foot wide pothole opened up near the crosswalk outside Central Metro Station. Two scooter riders almost crashed this morning.",
      category: "ROADS",
      status: "IN_PROGRESS",
      priority: "HIGH",
      latitude: 40.7128,
      longitude: -74.006,
      address: "142 Central Avenue, Downtown Core",
      landmark: "Opposite Central Metro Station Exit 2",
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen1.id,
      assignedToId: roadsOfficial.id,
      slaDeadline: new Date(now.getTime() + 18 * 60 * 60 * 1000), // 18 hours left
      upvoteCount: 14,
      isEscalated: false,
    },
  });

  await prisma.issueTimeline.createMany({
    data: [
      {
        issueId: issue1.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        action: "Grievance registered by resident",
        note: "Submitted with GPS geotag and photo verification.",
        actorName: citizen1.name,
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        issueId: issue1.id,
        fromStatus: "SUBMITTED",
        toStatus: "ASSIGNED",
        action: "Automated routing to Roads & Infrastructure",
        note: "Auto-dispatched to Marcus Vance based on category.",
        actorName: "CivicTrack System",
        createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000),
      },
      {
        issueId: issue1.id,
        fromStatus: "ASSIGNED",
        toStatus: "IN_PROGRESS",
        action: "Asphalt repair crew dispatched",
        note: "Work order #RW-402 issued. Crew arriving with cold-mix asphalt.",
        actorName: roadsOfficial.name,
        createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      },
    ],
  });

  // Issue 2: Overflowing Municipal Dumpster (SLA Breached / Escalated)
  const issue2 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-2026-1002",
      title: "Commercial garbage dump blocking pedestrian sidewalk",
      description: "Dumpsters haven't been emptied in 5 days. Rotten organic waste is spilling into the street, creating a severe health hazard.",
      category: "SANITATION",
      status: "ASSIGNED",
      priority: "HIGH",
      latitude: 40.7145,
      longitude: -74.0082,
      address: "88 Greenway Blvd, Old Quarter",
      landmark: "Behind Green Valley Supermarket",
      imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen2.id,
      assignedToId: sanitationOfficial.id,
      slaDeadline: new Date(now.getTime() - 14 * 60 * 60 * 1000), // Breached by 14 hours
      upvoteCount: 22,
      isEscalated: true,
    },
  });

  await prisma.issueTimeline.createMany({
    data: [
      {
        issueId: issue2.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        action: "Grievance registered",
        note: "Multiple complaints merged via duplicate detection.",
        actorName: citizen2.name,
        createdAt: new Date(now.getTime() - 60 * 60 * 60 * 1000),
      },
      {
        issueId: issue2.id,
        fromStatus: "SUBMITTED",
        toStatus: "ASSIGNED",
        action: "Assigned to Sanitation Department",
        note: "Pending compactor truck scheduling.",
        actorName: "CivicTrack System",
        createdAt: new Date(now.getTime() - 55 * 60 * 60 * 1000),
      },
      {
        issueId: issue2.id,
        fromStatus: "ASSIGNED",
        toStatus: "ASSIGNED",
        action: "SLA Escalation Alert Triggered",
        note: "Deadline exceeded 48h SLA window without resolution. Escalated to Commissioner dashboard.",
        actorName: "SLA Automated Engine",
        createdAt: new Date(now.getTime() - 14 * 60 * 60 * 1000),
      },
    ],
  });

  // Issue 3: Broken Streetlight at School Crossing (RESOLVED with proof)
  const issue3 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-2026-1003",
      title: "Entire street dark due to non-functional LED streetlights",
      description: "Three consecutive streetlights are out outside St. Jude Elementary, creating dangerous conditions for students walking home in the evening.",
      category: "ELECTRICITY",
      status: "RESOLVED",
      priority: "MEDIUM",
      latitude: 40.718,
      longitude: -74.0015,
      address: "210 Pinecrest Lane, Ward 4",
      landmark: "Near St. Jude Elementary School gate",
      imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      resolvedImageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen1.id,
      assignedToId: electricOfficial.id,
      slaDeadline: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      upvoteCount: 8,
      isEscalated: false,
    },
  });

  await prisma.issueTimeline.createMany({
    data: [
      {
        issueId: issue3.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        action: "Reported by Alex Rivera",
        note: "Night safety concern noted.",
        actorName: citizen1.name,
        createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000),
      },
      {
        issueId: issue3.id,
        fromStatus: "SUBMITTED",
        toStatus: "IN_PROGRESS",
        action: "Technician unit dispatched",
        note: "Bucket truck #14 assigned for LED ballast replacement.",
        actorName: electricOfficial.name,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
      {
        issueId: issue3.id,
        fromStatus: "IN_PROGRESS",
        toStatus: "RESOLVED",
        action: "Repairs Completed & Verified",
        note: "Replaced faulty capacitor and LED drivers. Illumination test passed.",
        actorName: electricOfficial.name,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
    ],
  });

  // Issue 4: Main Water Pipeline Leak (EMERGENCY / NEW)
  const issue4 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-2026-1004",
      title: "Pressurized clean water leaking onto roadway",
      description: "Underground main pipe burst near the bus terminal. Thousands of gallons of clean drinking water are flooding the street.",
      category: "WATER_DRAINAGE",
      status: "SUBMITTED",
      priority: "EMERGENCY",
      latitude: 40.7112,
      longitude: -74.0045,
      address: "12 South Terminal Road",
      landmark: "Near Bus Bay 4",
      imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen2.id,
      assignedToId: waterOfficial.id,
      slaDeadline: new Date(now.getTime() + 16 * 60 * 60 * 1000),
      upvoteCount: 31,
      isEscalated: false,
    },
  });

  await prisma.issueTimeline.create({
    data: {
      issueId: issue4.id,
      fromStatus: null,
      toStatus: "SUBMITTED",
      action: "High priority report received",
      note: "Categorized as EMERGENCY due to drinking water loss.",
      actorName: citizen2.name,
      createdAt: new Date(now.getTime() - 45 * 60 * 1000),
    },
  });

  // Add upvotes
  await prisma.upvote.create({
    data: {
      issueId: issue1.id,
      userId: citizen2.id,
    },
  });

  await prisma.upvote.create({
    data: {
      issueId: issue4.id,
      userId: citizen1.id,
    },
  });

  // Add comments
  await prisma.comment.create({
    data: {
      issueId: issue1.id,
      userId: roadsOfficial.id,
      content: "Asphalt truck is queued in traffic, ETA 30 minutes. Road will be partially blocked for 2 hours during resurfacing.",
      isInternal: false,
    },
  });

  await prisma.comment.create({
    data: {
      issueId: issue2.id,
      userId: admin.id,
      content: "Sanitation supervisor contacted. Contractor penalized for missed schedule. Clear-up truck assigned for 6:00 AM.",
      isInternal: false,
    },
  });

  console.log("Seeding completed successfully!");
  console.log("Demo Credentials:");
  console.log("- Admin: admin@civictrack.org / admin123");
  console.log("- Roads Official: roads@civictrack.org / official123");
  console.log("- Sanitation Official: sanitation@civictrack.org / official123");
  console.log("- Citizen: citizen@civictrack.org / citizen123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
