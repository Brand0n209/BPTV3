import { NextRequest, NextResponse } from "next/server";
import { getSheetsClient } from "@/lib/googleSheets";
import { GOOGLE_SHEET_ID, GOOGLE_SHEET_TAB } from "@/lib/config";

// POST: Login handler
export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: GOOGLE_SHEET_ID,
      range: `${GOOGLE_SHEET_TAB}!A1:Z`,
    });

    const rows = response.data.values || [];
    if (rows.length < 2) {
      return NextResponse.json({ error: "No users found." }, { status: 401 });
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    const uidIndex = headers.indexOf("UserID");
    const passIndex = headers.indexOf("Password");
    const roleIndex = headers.indexOf("Role");
    const firstNameIndex = headers.indexOf("First Name");

    if (uidIndex === -1 || passIndex === -1 || roleIndex === -1) {
      return NextResponse.json({ error: "Sheet missing required columns: UserID, Password, or Role." }, { status: 500 });
    }

    const match = dataRows.find(row => row[uidIndex] === username && row[passIndex] === password);

    if (match) {
      const user = {
        userId: match[uidIndex],
        role: match[roleIndex],
        firstName: firstNameIndex !== -1 ? match[firstNameIndex] : ""
      };
      // TODO: Set session cookie or JWT here
      return NextResponse.json({ success: true, user });
    } else {
      return NextResponse.json({ error: "Invalid UserID or Password." }, { status: 401 });
    }
  } catch (err: unknown) {
    let errorMsg = "Server error. Try again.";
    const message = err instanceof Error ? err.message : "";
    if (message) {
      if (
        message.includes("Unable to parse range") ||
        message.includes("Requested entity was not found") ||
        message.includes("No API key") ||
        message.includes("PERMISSION_DENIED")
      ) {
        errorMsg = "Google Sheet or tab not found, or access denied. Please check configuration.";
      } else if (message.includes("invalid_grant")) {
        errorMsg = "Google API authentication failed. Contact admin.";
      }
    }
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
