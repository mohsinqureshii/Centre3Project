// =================== Requests ===================
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

// =================== Wizard ===================
export interface WizardState {
  step: number;
  completed: boolean;

  // Mop wizard stores form state here
  mop?: MOPFormData;
}

// =================== MOP (Method of Procedure) ===================

export type MOPRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface MOPRiskMatrix {
  likelihood: number;
  severity: number;
  score: number;
  level: MOPRiskLevel;
  mitigation?: string;
}

export interface MOPFormData {
  // Project info
  projectInfo: {
    projectName: string;
    projectNumber: string;
    projectOwner: string;
    mainService: string;
    projectStatus: string;
  };

  // Contractor info
  contractor: {
    companyName: string;
    contactPerson: string;
    mobileNumber: string;
    email: string;
    lineManager: string;
  };

  // Readiness checklist
  readinessChecklist: {
    task: string;
    assignee: string;
    status: "Pending" | "Completed";
  }[];

  // Implementation steps
  implementationSteps: {
    step: string;
    owner: string;
  }[];

  // Risk matrix (single risk block)
  riskMatrix: MOPRiskMatrix;

  // ✅ FIX FOR CURRENT ERROR
  rollbackPlans: {
    trigger: string;
    action: string;
    owner: string;
  }[];

  // Optional notes
  additionalNotes?: string;
}
