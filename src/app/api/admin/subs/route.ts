import { NextRequest, NextResponse } from "next/server";
import { getSheetRowsByHeaders, appendRowByHeaders } from "@/lib/googleSheets";
import { SUBMISSIONS_SHEET_ID, SUBMISSIONS_SHEET_NAME, SUBS_FORM_OPTIONS } from "@/lib/config";

// GET: Fetch and filter subs data
export async function GET(request: NextRequest) {
  // TODO: Add session and role validation
  try {
    const stages = [
      "All Subs",
      "Not Contacted Yet",
      "Contacted",
      "Waiting Cust Approval",
      "Confirmed & Inputted",
      "Not Interested after sub",
      "Bad Lead",
      "Contacted again, no reply",
      "Fired"
    ];
    const { searchParams } = new URL(request.url);
    const currentStage = searchParams.get("stage") || "Not Contacted Yet";

    const rows = await getSheetRowsByHeaders(
      SUBMISSIONS_SHEET_ID,
      SUBMISSIONS_SHEET_NAME,
      2 // Header row is row 2
    );

    let filteredRows;
    if (currentStage === "All Subs") {
      filteredRows = rows.filter(r => r["Sub Date"]);
    } else if (currentStage === "Not Contacted Yet" || !currentStage) {
      filteredRows = rows.filter(r => r["Sub Date"] && !r["Stage"]);
    } else {
      filteredRows = rows.filter(r => r["Stage"] === currentStage);
    }

    // Pre-merge lighting options for the form
    const lightingOptions = [
      ...SUBS_FORM_OPTIONS.LIGHTING_OPTIONS_TEMPORARY,
      ...SUBS_FORM_OPTIONS.LIGHTING_OPTIONS_PERMANENT
    ];
    const subsFormOptions = {
      ...SUBS_FORM_OPTIONS,
      LIGHTING_OPTIONS: lightingOptions
    };

    return NextResponse.json({
      rows: filteredRows,
      stages,
      currentStage,
      subsFormOptions
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: "Failed to load subs tab", details: message }, { status: 500 });
  }
}

// POST: Add a new sub
export async function POST(request: NextRequest) {
  // TODO: Add session and role validation
  try {
    const SUBS_HEADERS = [
      "First Name", "Last Name", "Phone Number", "Email", "Referral", "Address", "City", "Home Stories",
      "Lighting Options", "Lighting Sides", "Pref Service Date (LIGHTING)", "Measure", "Lighting notes",
      "Solar Selected Services", "Pref Service Date (SOLAR)", "Solar Panels", "Solar notes",
      "Gutter Selected Service", "Pref Service Date (GUTTER)", "Gutter notes"
    ];
    const data = await request.json();
    // Basic validation
    const required = ["First Name", "Last Name", "Phone Number", "Referral", "Address", "City", "Home Stories"];
    for (const field of required) {
      if (!data[field] || typeof data[field] !== "string" || !data[field].trim()) {
        return NextResponse.json({ success: false, message: `Missing required field: ${field}` }, { status: 400 });
      }
    }
    // Prepare row in correct order
    const row = SUBS_HEADERS.map(h => (data[h] || "").trim());
    // Append to sheet
    await appendRowByHeaders(
      SUBMISSIONS_SHEET_ID,
      SUBMISSIONS_SHEET_NAME,
      SUBS_HEADERS,
      row
    );
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ success: false, message: message || "Failed to add sub" }, { status: 500 });
  }
}
