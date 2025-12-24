import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";

import usersRouter from "./settings/users.routes.js";
import rolesRouter from "./settings/roles.routes.js";
import locationsRouter from "./settings/locations.routes.js";
import zonesRouter from "./settings/zones.routes.js";
import roomsRouter from "./settings/rooms.routes.js";
import activityCategoriesRouter from "./settings/activityCategories.routes.js";
import activitiesRouter from "./settings/activities.routes.js";
import processesRouter from "./settings/processes.routes.js";
import alertTypesRouter from "./settings/alertTypes.routes.js";

export const settingsRouter = Router();

/**
 * All settings routes are protected
 */
settingsRouter.use(authMiddleware);

/**
 * MODULE 2 — MASTER DATA
 */
settingsRouter.use("/users", usersRouter);
settingsRouter.use("/roles", rolesRouter);

settingsRouter.use("/locations", locationsRouter);
settingsRouter.use("/zones", zonesRouter);
settingsRouter.use("/rooms", roomsRouter);

settingsRouter.use("/activity-categories", activityCategoriesRouter);
settingsRouter.use("/activities", activitiesRouter);

settingsRouter.use("/processes", processesRouter);
settingsRouter.use("/alert-types", alertTypesRouter);
