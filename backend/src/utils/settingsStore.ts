import fs from "fs";
import path from "path";

export type PermissionsMatrix = Record<string, Record<string, boolean>>; // role -> permissionKey -> allowed

export type AlertTypeConfig = {
  key: string;              // e.g. "DOOR_FORCED"
  name: string;             // display name
  defaultSeverity: "INFO" | "WARNING" | "CRITICAL";
  routingRoles: string[];   // UserRole[] as strings
};

export type SettingsJson = {
  permissions: PermissionsMatrix;
  alertTypes: AlertTypeConfig[];
};

const DATA_DIR = path.join(process.cwd(), "data");
const SETTINGS_PATH = path.join(DATA_DIR, "settings.json");

const DEFAULT_SETTINGS: SettingsJson = {
  permissions: {
    SUPER_ADMIN: {
      "settings:read": true,
      "settings:write": true,
      "requests:read": true,
      "requests:write": true,
      "approvals:act": true,
      "alerts:read": true,
      "alerts:write": true,
      "locks:act": true,
      "reports:read": true,
      "reports:export": true
    }
  },
  alertTypes: [
    { key: "GENERAL_INFO", name: "General Info", defaultSeverity: "INFO", routingRoles: ["SECURITY_OFFICER"] },
    { key: "SECURITY_WARNING", name: "Security Warning", defaultSeverity: "WARNING", routingRoles: ["SECURITY_OFFICER","SECURITY_SUPERVISOR"] },
    { key: "SECURITY_CRITICAL", name: "Security Critical", defaultSeverity: "CRITICAL", routingRoles: ["SECURITY_SUPERVISOR"] }
  ]
};

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(SETTINGS_PATH)) {
    fs.writeFileSync(SETTINGS_PATH, JSON.stringify(DEFAULT_SETTINGS, null, 2), "utf-8");
  }
}

export function readSettings(): SettingsJson {
  ensureFile();
  const raw = fs.readFileSync(SETTINGS_PATH, "utf-8");
  return JSON.parse(raw) as SettingsJson;
}

export function writeSettings(next: SettingsJson): SettingsJson {
  ensureFile();
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(next, null, 2), "utf-8");
  return next;
}

export function updateSettings(partial: Partial<SettingsJson>): SettingsJson {
  const current = readSettings();
  const merged: SettingsJson = {
    permissions: partial.permissions ?? current.permissions,
    alertTypes: partial.alertTypes ?? current.alertTypes
  };
  return writeSettings(merged);
}
