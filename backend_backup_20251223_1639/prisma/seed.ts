import { PrismaClient, UserRole, RequestType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function upsertUser(email: string, fullName: string, role: UserRole) {
  const passwordHash = await bcrypt.hash("admin123", 10);
  return prisma.user.upsert({
    where: { email },
    update: { fullName, role, isActive: true, passwordHash },
    create: { email, fullName, role, isActive: true, passwordHash },
  });
}

async function main() {
  await upsertUser("admin@centre3.local", "Centre3 Super Admin", UserRole.SUPER_ADMIN);
  await upsertUser("officer@centre3.local", "Security Officer", UserRole.SECURITY_OFFICER);
  await upsertUser("supervisor@centre3.local", "Security Supervisor", UserRole.SECURITY_SUPERVISOR);
  await upsertUser("manager@centre3.local", "DC Manager", UserRole.DC_MANAGER);
  await upsertUser("compliance@centre3.local", "Compliance", UserRole.COMPLIANCE);
  await upsertUser("requestor@centre3.local", "Requestor User", UserRole.REQUESTOR);

  const loc = await prisma.location.create({
    data: { country: "Saudi Arabia", region: "Riyadh", city: "Riyadh", siteCode: "DC-RYD-01", siteName: "Centre3 Riyadh DC" },
  });

  const zoneA = await prisma.zone.create({ data: { locationId: loc.id, name: "Zone A - Server Room", code: "ZA", isLockable: true }});
  const zoneB = await prisma.zone.create({ data: { locationId: loc.id, name: "Zone B - Storage", code: "ZB", isLockable: true }});
  await prisma.room.createMany({ data: [
    { zoneId: zoneA.id, name: "Room A1", code: "A1" },
    { zoneId: zoneA.id, name: "Room A2", code: "A2" },
    { zoneId: zoneB.id, name: "Room B1", code: "B1" },
  ]});

  const cat = await prisma.activityCategory.create({ data: { name: "Testing" }});
  const actLow = await prisma.activity.create({ data: { categoryId: cat.id, name: "Routine checks", riskLevel: "Low" }});
  const actHigh = await prisma.activity.create({ data: { categoryId: cat.id, name: "Power maintenance", riskLevel: "High" }});

  const adminVisitProc = await prisma.processDefinition.create({ data: { name: "Admin Visit Default", requestType: RequestType.ADMIN_VISIT, isActive: true }});
  await prisma.processStage.createMany({ data: [
    { processId: adminVisitProc.id, stageOrder: 1, name: "Security Officer Review", approverRole: UserRole.SECURITY_OFFICER, conditionJson: null, slaHours: 24 },
    { processId: adminVisitProc.id, stageOrder: 2, name: "Supervisor Review (VIP)", approverRole: UserRole.SECURITY_SUPERVISOR, conditionJson: { field: "vip", op: "eq", value: true }, slaHours: 24 },
  ]});

  const workPermitProc = await prisma.processDefinition.create({ data: { name: "Work Permit Default", requestType: RequestType.WORK_PERMIT, isActive: true }});
  await prisma.processStage.createMany({ data: [
    { processId: workPermitProc.id, stageOrder: 1, name: "Security Officer Review", approverRole: UserRole.SECURITY_OFFICER, conditionJson: null, slaHours: 24 },
    { processId: workPermitProc.id, stageOrder: 2, name: "DC Manager Review", approverRole: UserRole.DC_MANAGER, conditionJson: null, slaHours: 24 },
    { processId: workPermitProc.id, stageOrder: 3, name: "Compliance Review (High/Critical)", approverRole: UserRole.COMPLIANCE, conditionJson: { field: "riskLevel", op: "in", value: ["High","Critical"] }, slaHours: 48 },
  ]});

  const mvpProc = await prisma.processDefinition.create({ data: { name: "Material Vehicle Permit Default", requestType: RequestType.MATERIAL_VEHICLE_PERMIT, isActive: true }});
  await prisma.processStage.createMany({ data: [
    { processId: mvpProc.id, stageOrder: 1, name: "Security Officer Review", approverRole: UserRole.SECURITY_OFFICER, conditionJson: null, slaHours: 24 },
    { processId: mvpProc.id, stageOrder: 2, name: "DC Manager Review (Exit only)", approverRole: UserRole.DC_MANAGER, conditionJson: { field: "movementType", op: "eq", value: "EXIT" }, slaHours: 24 },
  ]});

  await prisma.activity.update({ where: { id: actLow.id }, data: { defaultProcessId: adminVisitProc.id }});
  await prisma.activity.update({ where: { id: actHigh.id }, data: { defaultProcessId: workPermitProc.id }});

  console.log("Seed completed.");
}

main().catch((e)=>{ console.error(e); process.exit(1); }).finally(async()=>prisma.$disconnect());
