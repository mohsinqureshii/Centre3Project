// ===== Requests =====
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

// ===== Wizard / Forms =====
export type WizardState = {
  step: number;
  completed: boolean;
};

// ===== MOP (Method of Procedure) =====
export type MOPRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface MOPRiskMatrix {
  likelihood: number;
  severity: number;
  riskLevel: MOPRiskLevel;
}

export interface MOPFormData {
  title: string;
  description: string;
  risks: MOPRiskMatrix[];
}
