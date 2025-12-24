import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import { authRouter } from "./modules/auth.routes.js";
import { settingsRouter } from "./modules/settings.routes.js";
import { requestsRouter } from "./modules/requests.routes.js";
import { approvalsRouter } from "./modules/approvals.routes.js";
import { emergencyLockRouter } from "./modules/emergency-lock/emergencyLock.routes.js";
import { alertsRouter } from "./modules/alerts/alerts.routes.js";
import { reportsRouter } from "./modules/reports.routes.js";
import { credentialsRouter } from "./modules/credentials.routes.js";

/* ✅ NEW: Users routes */
import { usersRouter } from "./modules/users/users.routes.js";

dotenv.config();

const app = express();

/* ======================
   MIDDLEWARE
====================== */
app.use(express.json({ limit: "2mb" }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

/* ======================
   STATIC FILES
====================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir =
  process.env.UPLOAD_DIR || path.join(__dirname, "..", "..", "uploads");

app.use("/uploads", express.static(uploadDir));

/* ======================
   HEALTH CHECK
====================== */
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/* ======================
   API ROUTES
====================== */
app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/requests", requestsRouter);
app.use("/api/approvals", approvalsRouter);
app.use("/api/credentials", credentialsRouter);
app.use("/api/reports", reportsRouter);
app.use("/api/alerts", alertsRouter);
app.use("/api/emergency-lock", emergencyLockRouter);

/* ✅ USERS (FIXES 404) */
app.use("/api/users", usersRouter);

/* ======================
   ERROR HANDLER
====================== */
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("API ERROR:", err);
  res.status(500).json({ message: "Server error" });
});

/* ======================
   START SERVER
====================== */
const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`Centre3 API on http://localhost:${port}`);
});
