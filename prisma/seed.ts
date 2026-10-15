import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CivicTrack with Chennai (Tambaram & Vandalur Wards) true context...");

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

  // 1. Municipal Commissioner (Admin)
  const admin = await prisma.user.create({
    data: {
      name: "Dr. Alby John Varghese, IAS (Commissioner, TCMC)",
      email: "admin@civictrack.in",
      passwordHash: hashedAdminPassword,
      role: "ADMIN",
      phone: "+91-44-2226-4444",
    },
  });

  // 2. Department Engineers & Officials (TCMC, CMWSSB, TANGEDCO)
  const roadsOfficial = await prisma.user.create({
    data: {
      name: "Thiru K. Saravanan, AEE (TCMC Road Infrastructure & Highways)",
      email: "roads@civictrack.in",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "ROADS",
      phone: "+91-94440-20011",
    },
  });

  const sanitationOfficial = await prisma.user.create({
    data: {
      name: "Dr. Deepa Sundaram (TCMC Chief City Health Officer - SWM)",
      email: "sanitation@civictrack.in",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "SANITATION",
      phone: "+91-94440-30022",
    },
  });

  const waterOfficial = await prisma.user.create({
    data: {
      name: "M. Selvakumar, AE (CMWSSB & Tambaram Water Supply)",
      email: "water@civictrack.in",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "WATER_DRAINAGE",
      phone: "+91-94440-40033",
    },
  });

  const electricOfficial = await prisma.user.create({
    data: {
      name: "P. Vignesh, AE (TANGEDCO Tambaram South O&M)",
      email: "electric@civictrack.in",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "ELECTRICITY",
      phone: "+91-94440-50044",
    },
  });

  // 3. Registered Citizens of Tambaram & Vandalur Wards
  const citizen1 = await prisma.user.create({
    data: {
      name: "Karthik Ramaswamy",
      email: "citizen@civictrack.in",
      passwordHash: hashedCitizenPassword,
      role: "CITIZEN",
      phone: "+91-98401-11223",
    },
  });

  const citizen2 = await prisma.user.create({
    data: {
      name: "Meenakshi Natarajan",
      email: "meenakshi@civictrack.in",
      passwordHash: hashedCitizenPassword,
      role: "CITIZEN",
      phone: "+91-98402-44556",
    },
  });

  const now = new Date();

  // 4. Sample True Grievances across Tambaram & Vandalur Wards

  // Issue 1: Mudichur Road, West Tambaram - Pothole near Railway Station (IN_PROGRESS)
  const issue1 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-TBM-1001",
      title: "Deep waterlogged crater pothole outside Tambaram West Bus Stand",
      description: "A 3-foot wide, 8-inch deep crater has formed on the Mudichur Road carriage-way right outside the Tambaram West railway station exit. Two MTC buses bottomed out this morning, creating a 1-km traffic jam towards Tambaram market.",
      category: "ROADS",
      status: "IN_PROGRESS",
      priority: "HIGH",
      latitude: 12.9238,
      longitude: 80.1135,
      address: "Mudichur Road, Ward 42, West Tambaram, Chennai - 600045",
      landmark: "Opposite National Theatre & Tambaram Railway Station West Exit",
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen1.id,
      assignedToId: roadsOfficial.id,
      slaDeadline: new Date(now.getTime() + 22 * 60 * 60 * 1000), // 22 hours left
      upvoteCount: 56,
      isEscalated: false,
    },
  });

  await prisma.issueTimeline.createMany({
    data: [
      {
        issueId: issue1.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        action: "Citizen report registered via CivicTrack",
        note: "Geotagged at Mudichur Road, Ward 42 with live camera verification.",
        actorName: citizen1.name,
        createdAt: new Date(now.getTime() - 26 * 60 * 60 * 1000),
      },
      {
        issueId: issue1.id,
        fromStatus: "SUBMITTED",
        toStatus: "ASSIGNED",
        action: "Assigned to TCMC Road Infrastructure",
        note: "Dispatched to AEE K. Saravanan. State Highways jurisdiction joint-inspection initiated.",
        actorName: "TCMC Control Room",
        createdAt: new Date(now.getTime() - 22 * 60 * 60 * 1000),
      },
      {
        issueId: issue1.id,
        fromStatus: "ASSIGNED",
        toStatus: "IN_PROGRESS",
        action: "Bitumen cold-patch gang dispatched",
        note: "Work order #TCMC-HW-7714 issued. Paver crew arriving tonight after 10:30 PM MTC bus schedule.",
        actorName: roadsOfficial.name,
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      },
    ],
  });

  // Issue 2: GST Road, Vandalur Crescent Junction - Garbage Dump (SLA Breached / Escalated)
  const issue2 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-TBM-1002",
      title: "Commercial garbage black spot on GST Road service lane near Crescent Institute",
      description: "Massive pile of unsegregated packaging waste, commercial food cartons, and plastic bottles dumped along the GST Road service lane near Vandalur overbridge. Dumper bins overflowed 4 days ago with no compactor clearance.",
      category: "SANITATION",
      status: "ASSIGNED",
      priority: "HIGH",
      latitude: 12.8752,
      longitude: 80.0832,
      address: "GST Road, Near B.S. Abdur Rahman Crescent Institute, Vandalur, Chennai - 600048",
      landmark: "Opposite Vandalur Flyover entry ramp, Crescent College Gate",
      imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen2.id,
      assignedToId: sanitationOfficial.id,
      slaDeadline: new Date(now.getTime() - 15 * 60 * 60 * 1000), // Breached by 15h
      upvoteCount: 78,
      isEscalated: true,
    },
  });

  await prisma.issueTimeline.createMany({
    data: [
      {
        issueId: issue2.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        action: "Reported by Vandalur Welfare Association",
        note: "Multiple proximity tickets merged via duplicate detection.",
        actorName: citizen2.name,
        createdAt: new Date(now.getTime() - 63 * 60 * 60 * 1000),
      },
      {
        issueId: issue2.id,
        fromStatus: "SUBMITTED",
        toStatus: "ASSIGNED",
        action: "Allocated to SWM Health Division",
        note: "Assigned to Chief Health Officer Dr. Deepa Sundaram.",
        actorName: "TCMC Control Room",
        createdAt: new Date(now.getTime() - 55 * 60 * 60 * 1000),
      },
      {
        issueId: issue2.id,
        fromStatus: "ASSIGNED",
        toStatus: "ASSIGNED",
        action: "SLA Breach Escalation Triggered",
        note: "Ticket exceeded 48-hour municipal window. Escalated to Commissioner IAS Dr. Alby John Varghese for contractor penalty review.",
        actorName: "SLA Automated Engine",
        createdAt: new Date(now.getTime() - 15 * 60 * 60 * 1000),
      },
    ],
  });

  // Issue 3: Gandhi Road, Tambaram Sanatorium - Non-functional Streetlights (RESOLVED with proof)
  const issue3 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-TBM-1003",
      title: "Five consecutive LED streetlights non-functional on Gandhi Road",
      description: "Complete dark stretch outside Tambaram Sanatorium railway station and TB Hospital gate. Pedestrians and college students returning late evening felt unsafe.",
      category: "ELECTRICITY",
      status: "RESOLVED",
      priority: "MEDIUM",
      latitude: 12.9298,
      longitude: 80.1215,
      address: "Gandhi Road, Tambaram Sanatorium, Chennai - 600047",
      landmark: "Near Tambaram Sanatorium Railway Station & Government Hospital for Thoracic Medicine",
      imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      resolvedImageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen1.id,
      assignedToId: electricOfficial.id,
      slaDeadline: new Date(now.getTime() + 16 * 60 * 60 * 1000),
      upvoteCount: 24,
      isEscalated: false,
    },
  });

  await prisma.issueTimeline.createMany({
    data: [
      {
        issueId: issue3.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        action: "Grievance lodged by resident",
        note: "Ward 45 lighting complaint recorded.",
        actorName: citizen1.name,
        createdAt: new Date(now.getTime() - 34 * 60 * 60 * 1000),
      },
      {
        issueId: issue3.id,
        fromStatus: "SUBMITTED",
        toStatus: "IN_PROGRESS",
        action: "TANGEDCO Line Gang deployed",
        note: "Hydraulic sky-lift truck #TN-11-BE-4412 dispatched with new 90W Philips LED fittings.",
        actorName: electricOfficial.name,
        createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
      {
        issueId: issue3.id,
        fromStatus: "IN_PROGRESS",
        toStatus: "RESOLVED",
        action: "Work Verified & Completed",
        note: "Replaced blown timer circuit and two LED luminaires. Lux meter verified and energized by TANGEDCO AE P. Vignesh.",
        actorName: electricOfficial.name,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
    ],
  });

  // Issue 4: Perungalathur GST Road - Drinking Water Pipe Burst (EMERGENCY / NEW)
  const issue4 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-TBM-1004",
      title: "Underground main drinking water pipe burst flooding GST Road pedestrian subway",
      description: "Severe pipeline breach on the 450mm Palar drinking water trunk line. Potable water is pouring down into the Perungalathur pedestrian subway, rendering it unusable for railway commuters.",
      category: "WATER_DRAINAGE",
      status: "SUBMITTED",
      priority: "EMERGENCY",
      latitude: 12.9056,
      longitude: 80.0882,
      address: "GST Road, Perungalathur Junction, Ward 58, Chennai - 600063",
      landmark: "Near Perungalathur Railway Station Pedestrian Subway & Kamarajar Bus Shelter",
      imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen2.id,
      assignedToId: waterOfficial.id,
      slaDeadline: new Date(now.getTime() + 18 * 60 * 60 * 1000),
      upvoteCount: 92,
      isEscalated: false,
    },
  });

  await prisma.issueTimeline.create({
    data: {
      issueId: issue4.id,
      fromStatus: null,
      toStatus: "SUBMITTED",
      action: "Tier-1 Emergency Alert Recorded",
      note: "Urgent Palar water pipeline rupture. CMWSSB Tambaram pumping station alerted for valve shut-off.",
      actorName: citizen2.name,
      createdAt: new Date(now.getTime() - 25 * 60 * 1000),
    },
  });

  // Upvotes
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

  // Comments
  await prisma.comment.create({
    data: {
      issueId: issue1.id,
      userId: roadsOfficial.id,
      content: "Cold-mix bitumen drums delivered to Tambaram West depot. Traffic diversion plan approved by Tambaram Traffic Police for midnight patching.",
      isInternal: false,
    },
  });

  await prisma.comment.create({
    data: {
      issueId: issue2.id,
      userId: admin.id,
      content: "Show-cause notice served to concessionaire for Vandalur sector waste default. Special dumper truck allocated for 6:00 AM clearance tomorrow.",
      isInternal: false,
    },
  });

  console.log("Seeding completed successfully with Chennai (Tambaram & Vandalur Wards) true context!");
  console.log("---------------------------------------------------------------------------------");
  console.log("Demo Credentials:");
  console.log("🏛️ TCMC Commissioner (Admin): admin@civictrack.in / admin123");
  console.log("🚧 TCMC Roads & Highways Engineer: roads@civictrack.in / official123");
  console.log("🧹 TCMC Chief Health Officer (SWM): sanitation@civictrack.in / official123");
  console.log("💧 CMWSSB / Metro Water Engineer: water@civictrack.in / official123");
  console.log("⚡ TANGEDCO Power Engineer: electric@civictrack.in / official123");
  console.log("👤 Citizen (Karthik Ramaswamy, Tambaram West): citizen@civictrack.in / citizen123");
  console.log("---------------------------------------------------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
