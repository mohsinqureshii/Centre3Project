import { Router } from "express";
import {
  createRequestDraft,
  updateRequestDraft,
  submitRequestWithValidation,
} from "./request.controller.js";

export const requestModuleRouter = Router();

/**
 * CREATE NEW REQUEST (DRAFT)
 */
requestModuleRouter.post("/", createRequestDraft);

/**
 * UPDATE REQUEST (PATCH PER STEP)
 */
requestModuleRouter.patch("/:id", updateRequestDraft);

/**
 * SUBMIT REQUEST
 */
requestModuleRouter.post("/:id/submit", submitRequestWithValidation);
