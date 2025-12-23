// ==============================
// Requests
// ==============================
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

// ==============================
// MOP (Method of Procedure)
// ==============================
export type MOPRiskLevel =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "CRITICAL";

export interface MOPRiskMatrix {
  likelihood: number; // 1–5
  severity: number;   // 1–5
  score: number;      // likelihood × severity
  level: MOPRiskLevel;
  mitigation?: string;
}

export interface MOPFormData {
  title: string;
  description: string;
  risks: MOPRiskMatrix[];
}

// ==============================
// Wizard / Forms
// ==============================
export interface WizardState {
  step: number;
  completed: boolean;

  /** MOP wizard state */
  mop: MOPFormData;
}
