import prisma from "../prisma.js";
import { RequestStatus } from "@prisma/client";

/**
 * Builds / rebuilds approval stages for a request
 * Called:
 *  - After submission
 *  - After approval of a stage
 */
export async function buildApprovalFlow(requestId: string) {
  const req = await prisma.accessRequest.findUnique({
    where: { id: requestId },
  });

  if (!req) throw new Error("Request not found");

  // Find active process
  const process = await prisma.processDefinition.findFirst({
    where: {
      requestType: req.requestType,
      isActive: true,
    },
    include: {
      stages: {
        orderBy: { stageOrder: "asc" },
      },
    },
  });

  if (!process) {
    throw new Error("No active approval process configured");
  }

  // Clear existing stages
  await prisma.requestStageInstance.deleteMany({
    where: { requestId },
  });

  // Create stages
  for (const stage of process.stages) {
    await prisma.requestStageInstance.create({
      data: {
        requestId,
        stageOrder: stage.stageOrder,
        stageName: stage.name,
        approverRole: stage.approverRole,
        status: "PENDING",
      },
    });
  }

  // Move request to IN_APPROVAL
  await prisma.accessRequest.update({
    where: { id: requestId },
    data: {
      status: RequestStatus.IN_APPROVAL,
      processId: process.id,
    },
  });

  return true;
}
