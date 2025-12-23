import { Router } from "express";

import locationsRouter from "./settings/locations.routes.js";
import zonesRouter from "./settings/zones.routes.js";
import roomsRouter from "./settings/rooms.routes.js";
import usersRouter from "./settings/users.routes.js";
import activitiesRouter from "./settings/activities.routes.js";
import activityCategoriesRouter from "./settings/activityCategories.routes.js";
import processesRouter from "./settings/processes.routes.js";
import alertTypesRouter from "./settings/alertTypes.routes.js";

const router = Router();

router.use("/locations", locationsRouter);
router.use("/zones", zonesRouter);
router.use("/rooms", roomsRouter);
router.use("/users", usersRouter);
router.use("/activities", activitiesRouter);
router.use("/activity-categories", activityCategoriesRouter);
router.use("/processes", processesRouter);
router.use("/alert-types", alertTypesRouter);

export default router;
