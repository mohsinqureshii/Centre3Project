// // =====================
// // Requests
// // =====================
// export type RequestStatus =
//   | "DRAFT"
//   | "SUBMITTED"
//   | "APPROVED"
//   | "REJECTED";

// export interface Visitor {
//   fullName: string;
//   idNumber: string;
//   company?: string;
// }





// export interface Request {
//   id: string;
//   purpose: string;
//   status: RequestStatus;

//   locationId?: string;
//   zoneId?: string;
//   roomId?: string;

//   locationName?: string;
//   zoneName?: string;
//   roomName?: string;

//   visitors: Visitor[];
//   createdAt: string;
// }

// // =====================
// // Wizard / Forms
// // =====================
// export type RequestType =
//   | "METHOD_OF_PROCEDURE"
//   | "MATERIAL_VEHICLE_PERMIT"
//   | "WORK_PERMIT";

// export type AttachmentType =
//   | "MOP_DOC"
//   | "MVP_DOC"
//   | "WP_DOC";

// export interface RequestorInfo {
//   fullName: string;
//   email: string;
//   phone: string;
//   company: string;
// }

// export interface Attachment {
//   type: AttachmentType;
//   name: string;
//   url?: string;
// }

// export type WizardState = {
//   step: number;
//   completed: boolean;

//   requestType: RequestType;
//   requestor: RequestorInfo;
//   attachments: Attachment[];

//   mop?: MOPFormData;
//   mvp?: MVPFormData;
//   wp?: WPFormData;
// };

// // =====================
// // MOP (Method of Procedure)
// // =====================
// export type MOPRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

// export interface MOPRiskMatrix {
//   likelihood: number;
//   severity: number;
//   score: number;
//   level: MOPRiskLevel;
//   mitigation?: string;
// }

// export interface MOPFormData {
//   projectInfo: {
//     projectName: string;
//     projectNumber: string;
//     projectOwner: string;
//     mainService: string;
//     projectStatus: string;
//   };

//   contractor: {
//     companyName: string;
//     contactPerson: string;
//     mobileNumber: string;
//     email: string;
//     lineManager: string;
//   };

//   readinessChecklist: {
//     task: string;
//     assignee: string;
//     status: "Pending" | "Done";
//   }[];

//   implementationSteps: {
//     step: string;
//     owner: string;
//   }[];

//   rollbackPlans: {
//     scenario: string;
//     action: string;
//   }[];

//   participants: {
//     name: string;
//     company: string;
//     designation: string;
//     contact?: string;
//   }[];

//   riskMatrix: MOPRiskMatrix;
// }

// // =====================
// // MVP (Material / Vehicle Permit)
// // =====================
// export type MVPDecisionType = "WITH_VEHICLE" | "WITHOUT_VEHICLE";
// export type MVPMovementType = "ENTRY" | "EXIT";

// export interface MVPVehicle {
//   plate: string;
//   vehicleType: string;
//   driverName: string;
//   driverId: string;
// }

// export interface MVPFormData {
//   decisionType: MVPDecisionType;
//   movementType: MVPMovementType;

//   responsible: {
//     name: string;
//     company: string;
//     mobile: string;
//     email: string;
//     idNumber: string;
//   };

//   vehicle?: MVPVehicle;

//   materials: {
//     description: string;
//     quantity: number;
//     reason: string;
//   }[];
// }



// // =====================
// // WP (Work Permit)
// // =====================
// export type WPImpact = "Minor" | "Moderate" | "Major";

// export interface WPRisk {
//   description: string;
//   impact: WPImpact;
//   control: string;
// }

// export interface WPFormData {
//   cabinets: string;
//   methodStatements: { description: string }[];
//   risks: WPRisk[];
// }
// =====================
// Core Lookups
// =====================
export interface Location {
  id: string;
  country: string;
  region: string;
  city: string;
  siteName: string;
}

export interface Zone {
  id: string;
  name: string;
}

export interface Room {
  id: string;
  name: string;
}

// =====================
// Visitors
// =====================
export interface Visitor {
  id?: string;
  fullName: string;
  idNumber: string;
  company?: string;
}

// =====================
// Requests
// =====================
export type RequestStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED";

export interface Request {
  id: string;
  requestNo?: string;
  purpose: string;
  status: RequestStatus;

  locationId?: string;
  zoneId?: string;
  roomId?: string;

  location?: Location;
  zone?: Zone;
  room?: Room;

  visitors: Visitor[];
  createdAt: string;
}

// =====================
// Wizard / Forms
// =====================
export type RequestType =
  | "METHOD_OF_PROCEDURE"
  | "MATERIAL_VEHICLE_PERMIT"
  | "WORK_PERMIT";

export type AttachmentType =
  | "MOP_DOC"
  | "MVP_DOC"
  | "WP_DOC";

export interface RequestorInfo {
  fullName: string;
  email: string;
  phone: string;
  company: string;
}

export interface Attachment {
  type: AttachmentType;
  name: string;
  url?: string;
}

export type WizardState = {
  step: number;
  completed: boolean;

  requestType: RequestType;
  requestor: RequestorInfo;
  attachments: Attachment[];

  mop?: MOPFormData;
  mvp?: MVPFormData;
  wp?: WPFormData;
};

// =====================
// MOP
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
// MVP
// =====================
export type MVPDecisionType = "WITH_VEHICLE" | "WITHOUT_VEHICLE";
export type MVPMovementType = "ENTRY" | "EXIT";

export interface MVPVehicle {
  plate: string;
  vehicleType: string;
  driverName: string;
  driverId: string;
}

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

  vehicle?: MVPVehicle;

  materials: {
    description: string;
    quantity: number;
    reason: string;
  }[];
}

// =====================
// WP
// =====================
export type WPImpact = "Minor" | "Moderate" | "Major";

export interface WPRisk {
  description: string;
  impact: WPImpact;
  control: string;
}

export interface WPFormData {
  cabinets: string;
  methodStatements: { description: string }[];
  risks: WPRisk[];
}
