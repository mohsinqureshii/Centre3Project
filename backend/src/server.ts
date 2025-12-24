import express from "express";
import cors from "cors";

import requestsRouter from "./modules/requests.routes.js";
import settingsRouter from "./modules/settings.routes.js";
import authRouter from "./modules/auth.routes.js";
import credentialsRouter from "./modules/credentials.routes.js";
import approvalsRouter from "./modules/approvals.routes.js";
import reportsRouter from "./modules/reports.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   HEALTHCHECK (REQUIRED)
================================ */
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

/* ===============================
   ROUTES
================================ */
app.use("/api/requests", requestsRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/auth", authRouter);
app.use("/api/credentials", credentialsRouter);
app.use("/api/approvals", approvalsRouter);
app.use("/api/reports", reportsRouter);

/* ===============================
   DEFAULT 404 FOR MISSING ROUTES
================================ */
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

/* ===============================
   START SERVER
================================ */
const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Centre3 API on http://localhost:${PORT}`);
});
