export const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || "";
export const GOOGLE_SHEET_TAB = process.env.GOOGLE_SHEET_TAB || "";

export const SUBMISSIONS_SHEET_ID = process.env.SUBMISSIONS_SHEET_ID || "";
export const SUBMISSIONS_SHEET_NAME = process.env.SUBMISSIONS_SHEET_NAME || "";

export const SESSION_SECRET = process.env.SESSION_SECRET || "";

export const SUBS_FORM_OPTIONS = {
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
  SOLAR_SERVICES: [
    "Solar Cleaning",
    "Solar Mesh"
  ],
  GUTTER_SERVICES: [
    "Full Gutter Cleaning",
    "Partial Gutter Cleaning"
  ]
};

export const EXTERNAL_SHEETS = {
  SUBMISSIONS_SPREADSHEET_ID: process.env.SUBMISSIONS_SPREADSHEET_ID || "",
  SUBMISSIONS_SHEET_NAME: process.env.SUBMISSIONS_SHEET_NAME || "",
  SUBMISSIONS_2025_SPREADSHEET_ID: process.env.SUBMISSIONS_2025_SPREADSHEET_ID || "",
  SUBMISSIONS_2025_SHEET_NAME: process.env.SUBMISSIONS_2025_SHEET_NAME || "",
  INCOMPLETE_SPREADSHEET_ID: process.env.INCOMPLETE_SPREADSHEET_ID || "",
  INCOMPLETE_SHEET_NAME: process.env.INCOMPLETE_SHEET_NAME || "",
  CALENDAR_LOG_SPREADSHEET_ID: process.env.CALENDAR_LOG_SPREADSHEET_ID || "",
  CALENDAR_LOG_SHEET_NAME: process.env.CALENDAR_LOG_SHEET_NAME || ""
};
