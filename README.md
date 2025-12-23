# Centre3 (Approvals Engine + Inbox UI)

Monorepo:
- backend/: Express + Prisma (schema unchanged)
- frontend/: Next.js + Tailwind (shadcn-style primitives)

## Run (local)
Backend:
```bash
cd backend
cp .env.example .env
npm i
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Frontend:
```bash
cd ../frontend
cp .env.example .env.local
npm i
npm run dev
```

Seed logins (password: admin123):
- admin@centre3.local (SUPER_ADMIN)
- officer@centre3.local (SECURITY_OFFICER)
- supervisor@centre3.local (SECURITY_SUPERVISOR)
- manager@centre3.local (DC_MANAGER)
- compliance@centre3.local (COMPLIANCE)
- requestor@centre3.local (REQUESTOR)

Approval Inbox: /approvals/inbox


## Modules merged
This repo includes the BASE Centre3 monorepo plus the following merged modules:
- WP/MOP/MVP request wizard (frontend) + draft/save/submit validation (backend)
- Settings (Admin) module (backend + frontend)
- Credentials issuance + listing (backend + frontend)
- Reports list + CSV export (backend + frontend)
- Security Alerts (backend + frontend)
- Emergency Lock (backend + frontend)
- Production hardening + go-live/UAT documentation (docs/)

## API routes
Backend (default `http://localhost:4000`):
- `GET /health`
- `POST /api/auth/login` (and other auth routes)
- `GET|POST|PATCH /api/requests/...`
- `POST /api/requests/:id/submit`
- `GET|POST /api/approvals/...`
- `GET|POST /api/settings/...` (admin resources are SUPER_ADMIN guarded)
- `GET|POST /api/credentials/...`
- `GET /api/reports/...` and `GET /api/reports/.../export`
- `GET /api/alerts` and `POST /api/alerts/:id/seen`
- `POST /api/emergency-lock/zones/:id/lock|unlock` and `POST /api/emergency-lock/zones/lock-all`
