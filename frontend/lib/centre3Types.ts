// ================= Requests =================

export type RequestStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export interface Visitor {
  fullName: string;
  idNumber: string;
  company?: string;
}

export interface Request {
  id: string;
  purpose: string;
  status: RequestStatus;

  locationId?: string;
  zoneId?: string;
  roomId?: string;

  locationName?: string;
  zoneName?: string;
  roomName?: string;

  visitors: Visitor[];

  createdAt: string;
}

// ================= Wizard =================

export interface WizardState {
  step: number;
  completed: boolean;
  mop?: MOPFormData;
}

// ================= MOP (Method of Procedure) =================

export type MOPRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface MOPRiskMatrix {
  likelihood: number;
  severity: number;
  score: number;
  level: MOPRiskLevel;
  mitigation?: string;
}

export interface MOPProjectInfo {
  projectName: string;
  projectNumber: string;
  projectOwner: string;
  mainService: string;
  projectStatus: string;
}

export interface MOPContractor {
  companyName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  lineManager: string;
}

export interface MOPReadinessItem {
  task: string;
  assignee: string;
  status: "Pending" | "Done";
}

export interface MOImplementationStep {
  step: string;
  owner: string;
}

export interface MOPRollbackPlan {
  scenario: string;
  action: string;
}

export interface MOPParticipant {
  name: string;
  company: string;
  designation: string;
  contact?: string;
}

export interface MOPFormData {
  projectInfo: MOPProjectInfo;
  contractor: MOPContractor;
  readinessChecklist: MOPReadinessItem[];
  implementationSteps: MOImplementationStep[];
  rollbackPlans: MOPRollbackPlan[];
  participants: MOPParticipant[];
  riskMatrix: MOPRiskMatrix;
}
