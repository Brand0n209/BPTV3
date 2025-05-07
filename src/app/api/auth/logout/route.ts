import { NextRequest, NextResponse } from "next/server";

// GET: Logout handler
export async function GET() {
  // TODO: Clear session cookie or JWT here
  return NextResponse.json({ success: true, message: "Logged out" });
}
