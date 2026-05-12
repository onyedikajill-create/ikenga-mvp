// ============================================================
// IKENGA — Super Admin & Admin Role System
//
// Roles:
//   super_admin    — Full system access, all routes, no limits.
//                    Cannot see raw user PII (emails shown as hash).
//   content_admin  — Library, corrections, cultural content.
//   tech_admin     — Infrastructure, API keys, diagnostics.
//   support_admin  — User support, content moderation.
//
// Data protection: admin logs always show hashed user IDs,
// never raw emails. GDPR/DPA compliant.
// ============================================================

import { createHash } from "crypto";

export type AdminRole = "super_admin" | "content_admin" | "tech_admin" | "support_admin";

export interface AdminConfig {
  email: string;
  role:  AdminRole;
  name:  string;
}

// ── Admin roster ─────────────────────────────────────────────
// Add Dr. Remy Ilona's email when confirmed.

const ADMINS: AdminConfig[] = [
  { email: "onyedikajill@gmail.com",     role: "super_admin",   name: "Onyedika Jill" },
  { email: "ikengaapp@gmail.com",        role: "super_admin",   name: "IKENGA App" },
  { email: "afrohouseportimao@gmail.com",role: "super_admin",   name: "Afrohouse Portimao" },
  // { email: "dr.remy@example.com",     role: "content_admin", name: "Dr. Remy Ilona" },
];

// ── Role permissions ──────────────────────────────────────────

export const ROLE_PERMISSIONS: Record<AdminRole, {
  viewAnalytics:      boolean;
  viewUserList:       boolean;  // hashed IDs only
  viewRawPII:         boolean;  // always false — GDPR
  editLibrary:        boolean;
  reviewCorrections:  boolean;
  viewDiagnostics:    boolean;
  bypassLimits:       boolean;
  viewAdminLog:       boolean;
}> = {
  super_admin: {
    viewAnalytics:     true,
    viewUserList:      true,
    viewRawPII:        false,   // never expose PII
    editLibrary:       true,
    reviewCorrections: true,
    viewDiagnostics:   true,
    bypassLimits:      true,
    viewAdminLog:      true,
  },
  content_admin: {
    viewAnalytics:     false,
    viewUserList:      false,
    viewRawPII:        false,
    editLibrary:       true,
    reviewCorrections: true,
    viewDiagnostics:   false,
    bypassLimits:      false,
    viewAdminLog:      false,
  },
  tech_admin: {
    viewAnalytics:     true,
    viewUserList:      true,
    viewRawPII:        false,
    editLibrary:       false,
    reviewCorrections: false,
    viewDiagnostics:   true,
    bypassLimits:      false,
    viewAdminLog:      true,
  },
  support_admin: {
    viewAnalytics:     false,
    viewUserList:      true,
    viewRawPII:        false,
    editLibrary:       false,
    reviewCorrections: true,
    viewDiagnostics:   false,
    bypassLimits:      false,
    viewAdminLog:      false,
  },
};

// ── Lookup helpers ────────────────────────────────────────────

export function getAdminConfig(email: string): AdminConfig | null {
  const lower = email.toLowerCase().trim();
  return ADMINS.find(a => a.email.toLowerCase() === lower) ?? null;
}

export function isAdmin(email: string): boolean {
  return Boolean(getAdminConfig(email));
}

export function isSuperAdmin(email: string): boolean {
  return getAdminConfig(email)?.role === "super_admin";
}

export function getAdminRole(email: string): AdminRole | null {
  return getAdminConfig(email)?.role ?? null;
}

export function hasPermission(email: string, permission: keyof typeof ROLE_PERMISSIONS["super_admin"]): boolean {
  const role = getAdminRole(email);
  if (!role) return false;
  return ROLE_PERMISSIONS[role][permission];
}

// ── Data protection: hash user identifiers ───────────────────
// Use this to display users in admin views without exposing PII.

export function hashUserId(email: string): string {
  return "user_" + createHash("sha256").update(email.toLowerCase()).digest("hex").slice(0, 12);
}

// ── Generate access profile for API responses ─────────────────

export function getAdminProfile(email: string) {
  const config = getAdminConfig(email);
  if (!config) return null;
  return {
    role:        config.role,
    name:        config.name,
    permissions: ROLE_PERMISSIONS[config.role],
    isSuperAdmin: config.role === "super_admin",
    tier:        "super_admin" as const,
    unlimited:   config.role === "super_admin",
    diagnostics: ROLE_PERMISSIONS[config.role].viewDiagnostics,
  };
}
