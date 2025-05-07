/**
 * Session and role-based protection helpers for Next.js API routes.
 * Adapted from Express middleware.
 */

import type { User } from "@/types";

export function ensureLogin(user: User) {
  if (!user) {
    throw new Error("Not authenticated");
  }
}

export function ensureRole(user: User, role: string) {
  if (!user || user.role !== role) {
    throw new Error("Unauthorized");
  }
}
