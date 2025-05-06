// =====================
// Google Sheets API
// =====================
module.exports = {
  GOOGLE_SHEET_ID: '1CplO6CZTxIXb8YWaBZqLX_8eindCvV3H7-X1pnu5fhY',
  GOOGLE_SHEET_TAB: 'Login Cred',
  // Service account credentials (set as environment variables for security)
  GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL,
  GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
    ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined,

  // =====================
  // Session
  // =====================
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-session-secret',
};
