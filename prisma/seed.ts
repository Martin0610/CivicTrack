import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding CivicTrack with India (Bengaluru Municipal) context...");

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

  // 1. Zonal Municipal Commissioner (Admin)
  const admin = await prisma.user.create({
    data: {
      name: "Dr. Vikramaditya Rao, IAS (Zonal Commissioner)",
      email: "admin@civictrack.in",
      passwordHash: hashedAdminPassword,
      role: "ADMIN",
      phone: "+91-98450-10001",
    },
  });

  // 2. Department Engineers & Officials (BBMP, BWSSB, BESCOM)
  const roadsOfficial = await prisma.user.create({
    data: {
      name: "Rajesh Gowda, AEE (BBMP Road Infrastructure)",
      email: "roads@civictrack.in",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "ROADS",
      phone: "+91-98450-20002",
    },
  });

  const sanitationOfficial = await prisma.user.create({
    data: {
      name: "Pooja Nambiar (BBMP Chief Health Inspector - SWM)",
      email: "sanitation@civictrack.in",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "SANITATION",
      phone: "+91-98450-30003",
    },
  });

  const waterOfficial = await prisma.user.create({
    data: {
      name: "Suresh Kulkarni, AEE (BWSSB East Division)",
      email: "water@civictrack.in",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "WATER_DRAINAGE",
      phone: "+91-98450-40004",
    },
  });

  const electricOfficial = await prisma.user.create({
    data: {
      name: "Deepak Sharma (BESCOM Sub-Divisional Officer)",
      email: "electric@civictrack.in",
      passwordHash: hashedOfficialPassword,
      role: "OFFICIAL",
      department: "ELECTRICITY",
      phone: "+91-98450-50005",
    },
  });

  // 3. Registered Citizens
  const citizen1 = await prisma.user.create({
    data: {
      name: "Aarav Mehta",
      email: "citizen@civictrack.in",
      passwordHash: hashedCitizenPassword,
      role: "CITIZEN",
      phone: "+91-98801-12345",
    },
  });

  const citizen2 = await prisma.user.create({
    data: {
      name: "Ananya Iyer",
      email: "ananya@civictrack.in",
      passwordHash: hashedCitizenPassword,
      role: "CITIZEN",
      phone: "+91-98802-54321",
    },
  });

  const now = new Date();

  // 4. Sample Grievances across Bengaluru Wards

  // Issue 1: Indiranagar 100ft Road - Pothole outside Metro Pillar 84 (IN_PROGRESS)
  const issue1 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-BLR-1001",
      title: "Dangerous crater pothole near Indiranagar Metro Station",
      description: "A 3-foot wide asphalt pothole has formed right beneath Metro Pillar 84 on 100 Feet Road. Two two-wheeler riders skidded in waterlogged conditions yesterday during evening rush hour.",
      category: "ROADS",
      status: "IN_PROGRESS",
      priority: "HIGH",
      latitude: 12.9784,
      longitude: 77.6408,
      address: "100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru - 560038",
      landmark: "Opposite Toit Brewpub, near Metro Pillar 84",
      imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen1.id,
      assignedToId: roadsOfficial.id,
      slaDeadline: new Date(now.getTime() + 20 * 60 * 60 * 1000), // 20 hours left
      upvoteCount: 42,
      isEscalated: false,
    },
  });

  await prisma.issueTimeline.createMany({
    data: [
      {
        issueId: issue1.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        action: "Grievance filed via CivicTrack Mobile Portal",
        note: "Citizen geotagged location at Indiranagar Ward 112 with photo proof.",
        actorName: citizen1.name,
        createdAt: new Date(now.getTime() - 28 * 60 * 60 * 1000),
      },
      {
        issueId: issue1.id,
        fromStatus: "SUBMITTED",
        toStatus: "ASSIGNED",
        action: "Dispatched to BBMP Road Infrastructure",
        note: "Auto-assigned to AEE Rajesh Gowda for cold-mix patch repair.",
        actorName: "BBMP Sahaya Dispatch",
        createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        issueId: issue1.id,
        fromStatus: "ASSIGNED",
        toStatus: "IN_PROGRESS",
        action: "Asphalt patching gang mobilized",
        note: "Work Order #BBMP-ENG-4892 issued. Hot-mix bitumen roller arriving tonight post 11:00 PM to avoid traffic blockage.",
        actorName: roadsOfficial.name,
        createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000),
      },
    ],
  });

  // Issue 2: Koramangala 5th Block - Garbage Black Spot (SLA Breached / Escalated)
  const issue2 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-BLR-1002",
      title: "Commercial garbage black spot on 80 Feet Road footpath",
      description: "Commercial eateries are dumping bulk unsegregated wet waste on the pedestrian footpath. It has not been cleared by the SWM auto-tippers for over 4 days, causing foul smell and stray dog packs.",
      category: "SANITATION",
      status: "ASSIGNED",
      priority: "HIGH",
      latitude: 12.9352,
      longitude: 77.6245,
      address: "80 Feet Road, 5th Block, Koramangala, Bengaluru - 560095",
      landmark: "Adjacent to Sony World Signal junction",
      imageUrl: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen2.id,
      assignedToId: sanitationOfficial.id,
      slaDeadline: new Date(now.getTime() - 16 * 60 * 60 * 1000), // Breached by 16h
      upvoteCount: 68,
      isEscalated: true,
    },
  });

  await prisma.issueTimeline.createMany({
    data: [
      {
        issueId: issue2.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        action: "Registered by Koramangala Residents Association",
        note: "Multiple duplicate tickets merged via proximity engine.",
        actorName: citizen2.name,
        createdAt: new Date(now.getTime() - 64 * 60 * 60 * 1000),
      },
      {
        issueId: issue2.id,
        fromStatus: "SUBMITTED",
        toStatus: "ASSIGNED",
        action: "Assigned to SWM Zonal Health Inspector",
        note: "Pending compactor truck scheduling from Koramangala transfer station.",
        actorName: "BBMP Sahaya Dispatch",
        createdAt: new Date(now.getTime() - 58 * 60 * 60 * 1000),
      },
      {
        issueId: issue2.id,
        fromStatus: "ASSIGNED",
        toStatus: "ASSIGNED",
        action: "Automated SLA Breach Triggered",
        note: "Ticket exceeded 48-hour municipal turnaround threshold. Escalated to Commissioner IAS Dr. Vikramaditya Rao for immediate penal action against contractor.",
        actorName: "SLA Escalation Engine",
        createdAt: new Date(now.getTime() - 16 * 60 * 60 * 1000),
      },
    ],
  });

  // Issue 3: HSR Layout Sector 1 - Non-functional Streetlights (RESOLVED with proof)
  const issue3 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-BLR-1003",
      title: "Blackout on 27th Main Road due to failed LED driver circuit",
      description: "Five consecutive LED poles were completely dark outside Sector 1 park, causing safety concerns for women and evening walkers.",
      category: "ELECTRICITY",
      status: "RESOLVED",
      priority: "MEDIUM",
      latitude: 12.9166,
      longitude: 77.6521,
      address: "27th Main Road, Sector 1, HSR Layout, Bengaluru - 560102",
      landmark: "Near Agara Lake East Gate & CPWD Complex",
      imageUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80",
      resolvedImageUrl: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen1.id,
      assignedToId: electricOfficial.id,
      slaDeadline: new Date(now.getTime() + 14 * 60 * 60 * 1000),
      upvoteCount: 19,
      isEscalated: false,
    },
  });

  await prisma.issueTimeline.createMany({
    data: [
      {
        issueId: issue3.id,
        fromStatus: null,
        toStatus: "SUBMITTED",
        action: "Citizen report logged",
        note: "Ward 174 HSR Layout street illumination complaint.",
        actorName: citizen1.name,
        createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000),
      },
      {
        issueId: issue3.id,
        fromStatus: "SUBMITTED",
        toStatus: "IN_PROGRESS",
        action: "BESCOM Lineman Unit dispatched",
        note: "Hydraulic sky-lift vehicle #KA-01-EA-8841 sent for luminaire replacement.",
        actorName: electricOfficial.name,
        createdAt: new Date(now.getTime() - 14 * 60 * 60 * 1000),
      },
      {
        issueId: issue3.id,
        fromStatus: "IN_PROGRESS",
        toStatus: "RESOLVED",
        action: "Repairs Completed & Verified with Proof",
        note: "Replaced 120W LED fixtures and faulty miniature circuit breaker (MCB). Lux levels tested and confirmed by BESCOM AE Deepak Sharma.",
        actorName: electricOfficial.name,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      },
    ],
  });

  // Issue 4: Whitefield Main Road - BWSSB Cauvery Pipe Leak (EMERGENCY / NEW)
  const issue4 = await prisma.issue.create({
    data: {
      ticketNumber: "CIVIC-BLR-1004",
      title: "High-pressure Cauvery drinking water pipeline burst",
      description: "Major 600mm underground feeder pipeline cracked. Potable water is shooting up onto the main carriage-way, flooding the intersection outside Forum Mall.",
      category: "WATER_DRAINAGE",
      status: "SUBMITTED",
      priority: "EMERGENCY",
      latitude: 12.9698,
      longitude: 77.7499,
      address: "Whitefield Main Road, Prestige Ozone Junction, Bengaluru - 560066",
      landmark: "Opposite Forum Shantiniketan Mall, Pillar WP-12",
      imageUrl: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?auto=format&fit=crop&w=800&q=80",
      reportedById: citizen2.id,
      assignedToId: waterOfficial.id,
      slaDeadline: new Date(now.getTime() + 18 * 60 * 60 * 1000),
      upvoteCount: 84,
      isEscalated: false,
    },
  });

  await prisma.issueTimeline.create({
    data: {
      issueId: issue4.id,
      fromStatus: null,
      toStatus: "SUBMITTED",
      action: "Emergency priority alert registered",
      note: "Classified as TIER-1 EMERGENCY due to massive drinking water loss. BWSSB control room notified immediately.",
      actorName: citizen2.name,
      createdAt: new Date(now.getTime() - 35 * 60 * 1000),
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
      content: "Cold-mix asphalt has arrived at Indiranagar sub-divisional depot. Traffic police permission secured for night patching after 11 PM.",
      isInternal: false,
    },
  });

  await prisma.comment.create({
    data: {
      issueId: issue2.id,
      userId: admin.id,
      content: "Notice issued to Koramangala Ward 151 waste collection agency. Default penalty of ₹25,000 imposed. Special compactor deployed for 6:00 AM clearance.",
      isInternal: false,
    },
  });

  console.log("Seeding completed successfully with Indian Municipal Context!");
  console.log("------------------------------------------------------------");
  console.log("Demo Credentials:");
  console.log("🏛️ Zonal Commissioner (Admin): admin@civictrack.in / admin123");
  console.log("🚧 BBMP Roads Engineer: roads@civictrack.in / official123");
  console.log("🧹 SWM Health Inspector: sanitation@civictrack.in / official123");
  console.log("💧 BWSSB Water Engineer: water@civictrack.in / official123");
  console.log("⚡ BESCOM Power Engineer: electric@civictrack.in / official123");
  console.log("👤 Citizen (Aarav Mehta): citizen@civictrack.in / citizen123");
  console.log("------------------------------------------------------------");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
