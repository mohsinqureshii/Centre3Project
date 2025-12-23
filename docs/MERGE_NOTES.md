# Centre3 Merge Notes (aggregated)

## Centre3_Credentials.zip

# Centre3 Credentials (Module Patch)

## Merge
1) Extract ZIP
2) Copy `frontend/` and `backend/` into your Centre3 repo root and Replace when prompted.
3) Register router in `backend/src/server.ts`:

```ts
import { credentialsRouter } from "./modules/credentials.routes.js";
...
app.use("/api/credentials", credentialsRouter);
```

## Routes
- POST /api/credentials/issue
- POST /api/credentials/:id/suspend
- POST /api/credentials/:id/revoke
- POST /api/credentials/:id/replace
- GET  /api/credentials?requestId=

---

## Centre3_Settings_Admin.zip

# Centre3 – Settings (Admin) FULL Module (Merge Patch)

This ZIP is a **mergeable patch** to add the full **Settings (Admin)** module to the Centre3 monorepo.

## What it adds
- Settings pages (Next.js):
  - /settings/users
  - /settings/roles
  - /settings/locations
  - /settings/zones
  - /settings/activities
  - /settings/processes
  - /settings/alert-types
- Backend APIs (Express + Prisma) for:
  - users, locations, zones, rooms, activity categories, activities, processes, process stages
  - roles + permissions matrix (config-backed)
  - alert types (config-backed)
- Config store: `backend/src/utils/settingsStore.ts` writes `backend/data/settings.json`
- All Settings endpoints are restricted to **SUPER_ADMIN** via RBAC middleware.

> Prisma schema is **NOT modified**.

---

## Merge steps

### Backend
Copy the following into your repo (merge folders):
- `backend/src/modules/settings/**`
- `backend/src/utils/settingsStore.ts`
- `backend/data/settings.json` (optional, seed defaults)

Register routes in `backend/src/server.ts` (example):
```ts
import usersRouter from "./modules/settings/users.routes";
import rolesRouter from "./modules/settings/roles.routes";
import locationsRouter from "./modules/settings/locations.routes";
import zonesRouter from "./modules/settings/zones.routes";
import roomsRouter from "./modules/settings/rooms.routes";
import activitiesRouter from "./modules/settings/activities.routes";
import activityCategoriesRouter from "./modules/settings/activityCategories.routes";
import processesRouter from "./modules/settings/processes.routes";
import alertTypesRouter from "./modules/settings/alertTypes.routes";

app.use("/api/users", usersRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/locations", locationsRouter);
app.use("/api/zones", zonesRouter);
app.use("/api/rooms", roomsRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/activity-categories", activityCategoriesRouter);
app.use("/api/processes", processesRouter);
app.use("/api/alert-types", alertTypesRouter);
```

### Frontend
Copy (merge folders):
- `frontend/app/settings/**`
- `frontend/components/settings/**`

Ensure your sidebar includes the Settings links listed in the BRD.

---

## Validation checklist
1) Login as SUPER_ADMIN
2) Settings → Users: create user, disable/enable, reset password
3) Settings → Locations/Zones/Rooms CRUD
4) Settings → Activities: create category + activity, map default process
5) Settings → Processes: create process + stages + conditionJson
6) Settings → Roles: edit permissions matrix, verify stored in backend/data/settings.json
7) Settings → Alert Types: edit alert types, verify stored in backend/data/settings.json

---

## Centre3_Reports_Export.zip

# Centre3 Reports + Export (Module Patch)

## How to merge

1) Extract this ZIP.
2) Copy `frontend/` and `backend/` into the root of your Centre3 monorepo (on top of existing files) and **Replace** when prompted.
3) Register the router in `backend/src/server.ts`:

```ts
import { reportsRouter } from "./modules/reports.routes.js";
...
app.use("/api/reports", reportsRouter);
```

## Routes added
- GET /api/reports/admin-visits
- GET /api/reports/temporary-entry-logs
- GET /api/reports/tep-lists
- GET /api/reports/export?type=admin-visits|temporary-entry|tep&format=csv

> Note: XLSX export can be added later; this module ships CSV export as a safe baseline.

---

## Centre3_Security_Alerts_Emergency_Lock.zip

# Centre3 Module Patch: Security Alerts + Emergency Lock

This patch adds **Security Alerts** and **Emergency Lock** to your existing Centre3 monorepo.

## Backend merge

Copy these folders into your existing `backend/src/`:

- `modules/alerts/`
- `modules/emergency-lock/`
- `utils/occupancy.ts`
- `lib/prisma.ts` (ONLY if you do not already have a prisma singleton)

### Register routes
In `backend/src/server.ts` add:

```ts
import { alertsRouter } from "./modules/alerts/alerts.routes";
import { emergencyLockRouter } from "./modules/emergency-lock/emergencyLock.routes";

app.use("/api/alerts", alertsRouter);
app.use("/api", emergencyLockRouter); // mounts /api/zones/...
```

### RBAC
This patch expects:
- `authMiddleware` at `src/middlewares/auth.middleware.ts`
- `rbacMiddleware` at `src/middlewares/rbac.middleware.ts`

Roles used:
- Alerts view/mark: SECURITY_OFFICER, SECURITY_SUPERVISOR, DC_MANAGER, SUPER_ADMIN
- Lock/unlock zones: SECURITY_OFFICER, SECURITY_SUPERVISOR, SUPER_ADMIN
- Lock all zones: SECURITY_SUPERVISOR, SUPER_ADMIN

### Seed (optional but recommended)
To see sample alerts/locks immediately, append to your `prisma/seed.ts`:
- Create a few `SecurityAlert` records (mixed severities)
- Create a `ZoneLockEvent` record for at least one zone

No Prisma schema changes are required.

## Frontend merge

Copy into your `frontend/`:

- `app/security-alerts/page.tsx`
- `app/emergency-lock/page.tsx`
- `components/alerts/*`
- `components/emergency-lock/*`

### Sidebar
Add routes:
- `/security-alerts`
- `/emergency-lock`

### ENV
Frontend expects:
- `NEXT_PUBLIC_API_URL` (e.g., `http://localhost:4000`)

Token is read from `localStorage.token` (matches existing auth flow in many Centre3 builds).

## Quick test

1) Login as Security Officer
2) Open `/security-alerts` and mark alerts as seen
3) Open `/emergency-lock`, lock/unlock zones, and lock all zones

---

## Centre3_WP_MOP_MVP.zip

# Centre3 WP/MOP/MVP Module (UI + Backend)

This package is a **drop-in module** intended to be merged into your existing Centre3 monorepo (the one that already has auth/RBAC, base requests CRUD, and approvals).

## What this module provides
### Frontend (Next.js App Router)
- `/requests/new` multi-step wizard (Request Type → Requestor → Site → Details → Attachments → Review/Submit)
- Full detail forms for:
  - **Work Permit (WP)**: Method Statement (multi-row) + Risk List (multi-row)
  - **Method of Procedure (MOP)**: Readiness checklist, Implementation steps, Participants, Rollback, and **Risk Matrix with auto scoring**
  - **Material & Vehicle Permit (MVP)**: Materials (multi-row) + conditional vehicle details
- Client-side validation and **submit blocking** (mirrors backend)

### Backend (Express + Prisma; **no schema changes**)
- Server-side validators for WP/MOP/MVP
- Storage strategy:
  - WP/MOP form payload stored in `AccessRequest.comments` as JSON string
  - MVP materials stored in `MaterialItem[]` (existing model)
  - Visitors stored in `RequestVisitor[]` (existing model)
- Submit endpoint enforces:
  - Duration limits (WP/MOP/MVP max 14 days)
  - Minimum rows in multi-row sections
  - MOP mitigation required for High/Critical
  - Required attachments list (MOP requires MOP PDF; WP requires WP doc; visitor ID docs)

> **Important**: This module assumes your existing backend already exposes upload endpoint + attachment table, or you will wire the `attachments` array from the wizard into your existing uploads flow.

---

## Merge instructions
### Frontend
1. Copy everything under `frontend/` into your repo’s `frontend/` (merge folders).
2. Ensure your sidebar includes a link to `/requests/new`.
3. Ensure you have basic UI components available (shadcn-style): `Button`, `Input`, `Select`, `Textarea`, `Card`, `Badge`, `Table`, `Dialog`.
   - If your project names differ, update imports in these files.

### Backend
1. Copy everything under `backend/src/modules/requests/` into your repo’s `backend/src/modules/requests/` (merge folders).
2. Register the new router or merge handlers into your existing requests router:
   - `PATCH /api/requests/:id` accepts `formData`, `visitors`, `materials`, `meta`
   - `POST /api/requests/:id/submit` runs validators and blocks invalid submissions
3. No Prisma schema change required.

---

## Quick test script
1. Create a WP request → remove all method rows → submit should fail.
2. Create a MOP request with likelihood=5 severity=5 → mitigation required.
3. Create an MVP request with 0 materials → submit should fail.
