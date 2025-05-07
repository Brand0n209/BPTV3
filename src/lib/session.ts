/**
 * Session and role-based protection helpers for Next.js API routes.
 * Adapted from Express middleware.
 */

export function ensureLogin(user: any) {
  if (!user) {
    throw new Error("Not authenticated");
  }
}

export function ensureRole(user: any, role: string) {
  if (!user || user.role !== role) {
    throw new Error("Unauthorized");
  }
}
