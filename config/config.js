/**
 * =====================
 * Google Sheets API
 * =====================
 */
module.exports = {
  // Main spreadsheet for login credentials
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID || 'your-google-sheet-id',
  GOOGLE_SHEET_TAB: process.env.GOOGLE_SHEET_TAB || 'Login Cred',

  /**
   * =====================
   * Job Tracking
   * =====================
   * Add future sheet IDs/names here for jobs, scheduling, payments, etc.
   */
  // JOBS_SHEET_ID: process.env.JOBS_SHEET_ID || '',
  // SCHEDULING_SHEET_ID: process.env.SCHEDULING_SHEET_ID || '',

  /**
   * =====================
   * Session
   * =====================
   */
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret',
};
