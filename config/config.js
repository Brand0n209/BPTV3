/**
 * =====================
 * CONFIG EXPORT SUMMARY
 * =====================
 * 
 * Google Sheets API (Login)
 *   - GOOGLE_SHEET_ID
 *   - GOOGLE_SHEET_TAB
 * 
 * Submissions Sheet (Admin Subs Tab)
 *   - SUBMISSIONS_SHEET_ID
 *   - SUBMISSIONS_SHEET_NAME
 * 
 * Session
 *   - SESSION_SECRET
 * 
 * All variables are grouped by section below for clarity.
 */

/**
 * =====================
 * Google Sheets API (Login)
 * =====================
 */
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || '1CplO6CZTxIXb8YWaBZqLX_8eindCvV3H7-X1pnu5fhY';
const GOOGLE_SHEET_TAB = process.env.GOOGLE_SHEET_TAB || 'Login Cred';

/**
 * =====================
 * Submissions Sheet (Admin Subs Tab)
 * =====================
 */
const SUBMISSIONS_SHEET_ID = process.env.SUBMISSIONS_SHEET_ID || '1CplO6CZTxIXb8YWaBZqLX_8eindCvV3H7-X1pnu5fhY';
const SUBMISSIONS_SHEET_NAME = process.env.SUBMISSIONS_SHEET_NAME || 'Submissions';

/**
 * =====================
 * Session
 * =====================
 */
const SESSION_SECRET = process.env.SESSION_SECRET || 'your-session-secret';

/**
 * =====================
 * Subs Form Options
 * =====================
 */
const SUBS_FORM_OPTIONS = {
  // ----- General -----
  REFERRAL_SOURCES: [
    "Yelp",
    "Referral",
    "Google",
    "Instagram",
    "Facebook",
    "NextDoor"
  ],
  HOME_STORIES: [
    "1 Story",
    "2 Story",
    "3 Story",
    "Commercial"
  ],

  // ----- Lighting -----
  LIGHTING_OPTIONS_TEMPORARY: [
    "Temporary Installation",
    "Temporary Takedown",
    "Temporary Service"
  ],
  LIGHTING_OPTIONS_PERMANENT: [
    "Permanent Installation",
    "Permanent Takedown",
    "Permanent Service",
    "Garage/Doorway Lighting"
  ],
  LIGHTING_SIDES: [
    "Fence",
    "Bottom Back",
    "Back Side",
    "Left Side",
    "Right Side",
    "Front Side"
  ],
  MEASURE_OPTIONS: [
    "Yes please!",
    "No thanks!"
  ],

  // ----- Solar -----
  SOLAR_SERVICES: [
    "Solar Cleaning",
    "Solar Mesh"
  ],

  // ----- Gutter -----
  GUTTER_SERVICES: [
    "Full Gutter Cleaning",
    "Partial Gutter Cleaning"
  ]
};

/**
 * =====================
 * External Sheets
 * =====================
 */
const EXTERNAL_SHEETS = {
  // Submissions (Subs) Sheet
  SUBMISSIONS_SPREADSHEET_ID: "1nkzBK-4t_k8qJlzz-BsrnIOrTlIKT7FQZnzYf2VY1bc",
  SUBMISSIONS_SHEET_NAME: "Submissions",
  // 2025 Submissions Sheet
  SUBMISSIONS_2025_SPREADSHEET_ID: "1nkzBK-4t_k8qJlzz-BsrnIOrTlIKT7FQZnzYf2VY1bc",
  SUBMISSIONS_2025_SHEET_NAME: "2025 Submissions",
  // Incomplete Sheet
  INCOMPLETE_SPREADSHEET_ID: "1nkzBK-4t_k8qJlzz-BsrnIOrTlIKT7FQZnzYf2VY1bc",
  INCOMPLETE_SHEET_NAME: "Incomplete",
  // Calendar Activity Log Sheet
  CALENDAR_LOG_SPREADSHEET_ID: "1pWOMaR-fkJW6bg0Xv3ZqrtYhtIpXbd1-a2Q5WOXLtU4",
  CALENDAR_LOG_SHEET_NAME: "Calendar Activity Log"
};

module.exports = {
  // Google Sheets API (Login)
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_TAB,

  // Submissions Sheet (Admin Subs Tab)
  SUBMISSIONS_SHEET_ID,
  SUBMISSIONS_SHEET_NAME,

  // Session
  SESSION_SECRET,

  // Subs Form Options
  SUBS_FORM_OPTIONS,

  // External Sheets
  EXTERNAL_SHEETS,
};
