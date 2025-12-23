import { Router } from 'express';
import { updateRequestDraft, submitRequestWithValidation } from './request.controller.js';
// NOTE: create/get/list are assumed to exist in your base repo; this module only adds/overrides PATCH+SUBMIT.

export const requestModuleRouter = Router();

requestModuleRouter.patch('/:id', updateRequestDraft);
requestModuleRouter.post('/:id/submit', submitRequestWithValidation);
