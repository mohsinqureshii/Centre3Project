// =====================
// Requests
// =====================
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

// =====================
// Wizard
// =====================
export interface WizardState {
  step: number;
  completed: boolean;

  mop?: MOPFormData;
  mvp?: MVPFormData;
}

// =====================
// MOP (Method of Procedure)
// =====================
export type MOPRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface MOPRiskMatrix {
  likelihood: number;
  severity: number;
  score: number;
  level: MOPRiskLevel;
  mitigation?: string;
}

export interface MOPFormData {
  projectInfo: {
    projectName: string;
    projectNumber: string;
    projectOwner: string;
    mainService: string;
    projectStatus: string;
  };

  contractor: {
    companyName: string;
    contactPerson: string;
    mobileNumber: string;
    email: string;
    lineManager: string;
  };

  readinessChecklist: {
    task: string;
    assignee: string;
    status: "Pending" | "Done";
  }[];

  implementationSteps: {
    step: string;
    owner: string;
  }[];

  rollbackPlans: {
    scenario: string;
    action: string;
  }[];

  participants: {
    name: string;
    company: string;
    designation: string;
    contact?: string;
  }[];

  riskMatrix: MOPRiskMatrix;
}

// =====================
// MVP (Material Vehicle Permit)
// =====================
export type MVPDecisionType =
  | "WITH_VEHICLE"
  | "WITHOUT_VEHICLE";

export type MVPMovementType =
  | "ENTRY"
  | "EXIT";

export interface MVPFormData {
  decisionType: MVPDecisionType;
  movementType: MVPMovementType;

  responsible: {
    name: string;
    company: string;
    mobile: string;
    email: string;
    idNumber: string;
  };

  materials: {
    description: string;
    quantity: number;
    reason: string;
  }[];
}
