/**
 * =====================
 * Google Sheets API
 * =====================
 */
module.exports = {
  // Main spreadsheet for login credentials
  // https://docs.google.com/spreadsheets/d/1CplO6CZTxIXb8YWaBZqLX_8eindCvV3H7-X1pnu5fhY/edit?gid=1207679114#gid=1207679114
  GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID || '1CplO6CZTxIXb8YWaBZqLX_8eindCvV3H7-X1pnu5fhY',
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
