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

module.exports = {
  // Google Sheets API (Login)
  GOOGLE_SHEET_ID,
  GOOGLE_SHEET_TAB,

  // Submissions Sheet (Admin Subs Tab)
  SUBMISSIONS_SHEET_ID,
  SUBMISSIONS_SHEET_NAME,

  // Session
  SESSION_SECRET,
};
