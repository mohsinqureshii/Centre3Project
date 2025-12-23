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
// Wizard / Forms
// ==============================
export type WizardState = {
  step: number;
  completed: boolean;
};

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

  /** Computed as likelihood × severity */
  score: number;

  /** Derived from score */
  level: MOPRiskLevel;

  /** Required when level is HIGH or CRITICAL */
  mitigation?: string;
}

export interface MOPFormData {
  title: string;
  description: string;
  risks: MOPRiskMatrix[];
}
