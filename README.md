# 🏙️ CivicTrack — Public Grievance & Urban Infrastructure Issue Management Platform

CivicTrack is an open civic engagement and municipal grievance management system enabling residents to report neighborhood infrastructure problems (potholes, garbage accumulation, broken streetlights, water supply leaks) with precise GPS geotagging and photo evidence.

Built with **Next.js 14**, **Tailwind CSS**, **Prisma ORM**, and **OpenStreetMap / Leaflet**, CivicTrack features automated proximity duplicate detection, intelligent departmental routing, strict service-level agreement (SLA) escalation engines, and a public transparency portal.

---

## 🌟 Key Highlights & Engineering Features

### 1. 📍 Geotagged Issue Reporting & Leaflet Map
- Citizens can pinpoint exact complaint locations on an interactive OpenStreetMap canvas or click **"Use Current GPS"** to automatically extract HTML5 coordinates.
- Supports image upload previews and address/landmark tagging.

### 2. 🔍 Proximity-Based Duplicate Complaint Detection
- Employs the **Haversine spherical distance formula** to check within a configurable **75-meter radius** whenever a citizen places a pin.
- If open issues exist in the vicinity, an interactive modal appears:
  - Citizens can click **"Upvote Existing Complaint"** to increment its priority score rather than filing duplicate tickets.
  - Or click **"Submit as New Issue"** if it is a distinct problem.

### 3. ⏱️ Automated Departmental Routing & SLA Escalation Engine
- Every category is mapped to a designated municipal department with guaranteed response windows:
  - **Water Supply & Drainage**: 24h SLA *(Critical)*
  - **Sanitation & Waste Management**: 48h SLA
  - **Electricity & Public Lighting**: 48h SLA
  - **Roads & Traffic Hazards**: 72h SLA
- Tickets that exceed the SLA threshold without resolution automatically trigger **SLA Breach Alerts** and are escalated directly to the Mayor / Commissioner dashboard with visual amber/red alert badges.

### 4. 👥 Role-Based Access Control (RBAC) & State Machine
- **Citizen Portal (`/citizen`)**: Submit grievances, monitor resolution progress, upvote neighborhood issues, and post comments.
- **Department Queue (`/department`)**: Specialized field operator workspace. Workers can claim tickets, transition status to `IN_PROGRESS`, and mark tickets as `RESOLVED` with required **Proof of Resolution photos**.
- **Admin Hub (`/admin`)**: Municipal overview, SLA breach monitoring, department performance benchmarks, and city-wide audit logs.
- **⚡ 1-Click Role Switcher**: A navbar switcher allows instant toggling between demo personas (Citizen, Roads Official, Sanitation Official, Mayor) for frictionless evaluation.

### 5. 📜 Immutable Timeline & Resolution Verification
- Every status transition (`SUBMITTED` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `RESOLVED`) logs an entry into the `IssueTimeline` table, recording the timestamp, actor name, action taken, and operational notes.
- Provides side-by-side **Before vs After photo comparisons** so the public can verify that road or lighting repairs were genuinely completed.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database & Seed Demo Data
CivicTrack uses SQLite by default for instant local execution without requiring a separate database server.

```bash
# Push schema to SQLite database (dev.db)
npx prisma db push

# Seed demo accounts and realistic city grievances
npx ts-node prisma/seed.ts
```

### 3. Launch Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Demo Personas & Credentials

| Role | Name | Email | Password | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **Citizen** | Alex Rivera | `citizen@civictrack.org` | `citizen123` | File complaints, upvote local issues, leave feedback |
| **Roads Official** | Marcus Vance | `roads@civictrack.org` | `official123` | Asphalt & traffic repair queue, dispatch crews |
| **Sanitation Official** | Elena Rostova | `sanitation@civictrack.org` | `official123` | Waste management work orders, compactor truck logs |
| **City Admin** | Mayor Office | `admin@civictrack.org` | `admin123` | SLA escalation hub, breach monitors, global analytics |

*(You can also use the **Role Switcher** in the top navigation bar to switch between any of these personas with a single click!)*

---

## 🗺️ Project Structure

```
civictrack/
├── app/
│   ├── layout.tsx                # App layout with Navbar & Footer
│   ├── page.tsx                  # Public City Heatmap & Complaints Feed
│   ├── globals.css               # Tailwind CSS & Leaflet pin styling
│   ├── login/page.tsx            # Login with 1-click persona fast buttons
│   ├── register/page.tsx         # Citizen registration form
│   ├── citizen/
│   │   ├── page.tsx              # Citizen dashboard (my submissions)
│   │   └── report/page.tsx       # Geotagged issue report + duplicate check
│   ├── department/page.tsx       # Department field staff work queue
│   ├── admin/page.tsx            # City Admin & SLA escalation hub
│   ├── issues/[id]/page.tsx      # Public tracking, before/after photos, timeline
│   └── api/
│       ├── auth/                 # Login, Register, Logout, Me
│       ├── issues/               # List, Create, Check-Duplicates, Details
│       └── stats/                # Municipal performance benchmarks
├── components/
│   ├── Navbar.tsx                # Navigation bar with live role switcher
│   ├── Footer.tsx                # Transparency footer & civic hotlines
│   ├── IssueCard.tsx             # Responsive complaint card
│   ├── InteractiveMap.tsx        # Leaflet OpenStreetMap pin & picker engine
│   ├── DuplicateWarningModal.tsx # Proximity duplicate warning modal
│   ├── TimelineView.tsx          # Stepper milestone & audit history log
│   ├── StatusBadge.tsx           # Color-coded status badge
│   ├── PriorityBadge.tsx         # Severity indicators
│   └── SlaBadge.tsx              # Dynamic SLA countdown & breach badge
├── lib/
│   ├── auth.ts                   # JWT & bcrypt authentication utilities
│   ├── geo.ts                    # Haversine distance & proximity math
│   ├── prisma.ts                 # Prisma Client singleton
│   ├── types.ts                  # Shared types & department metadata
│   └── utils.ts                  # Ticket numbers, SLA calculators
└── prisma/
    ├── schema.prisma             # Data model (User, Issue, Timeline, Upvote)
    └── seed.ts                   # Realistic city demo data seeder
```

---

## 📡 API Overview

- `GET /api/issues`: Query issues with filters (`category`, `status`, `search`, `isEscalated`).
- `POST /api/issues`: Submit new grievance, compute category SLA, and dispatch to department.
- `GET /api/issues/check-duplicates?lat={lat}&lng={lng}&category={cat}&radius=75`: Haversine proximity duplicate search.
- `GET /api/issues/[id]`: Detailed complaint with timeline, upvotes, and comments.
- `PATCH /api/issues/[id]/status`: Department status update, photo proof submission, and timeline logging.
- `POST /api/issues/[id]/upvote`: Upvote toggle for community priority scoring.
- `POST /api/issues/[id]/comments`: Post citizen feedback or department internal notes.
- `GET /api/stats`: City-wide resolution rate %, department scores, and SLA breach metrics.

---

## 📄 License
MIT License. Built for civic transparency and municipal excellence.
