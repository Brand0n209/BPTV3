const { google } = require('googleapis');
const config = require('./config');

// Authenticate with Google Sheets API using service account
async function getSheetsClient() {
  const auth = new google.auth.JWT(
    config.GOOGLE_CLIENT_EMAIL,
    null,
    config.GOOGLE_PRIVATE_KEY,
    ['https://www.googleapis.com/auth/spreadsheets.readonly']
  );
  return google.sheets({ version: 'v4', auth });
}

/**
 * Verifies user credentials against the Google Sheet.
 * @param {string} userId
 * @param {string} password
 * @returns {Promise<{role: string}|null>} Returns {role} if valid, null otherwise
 */
async function verifyUser(userId, password) {
  const sheets = await getSheetsClient();
  const range = `'${config.GOOGLE_SHEET_TAB}'!A:C`; // UserID, Password, Role

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.GOOGLE_SHEET_ID,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length < 2) return null; // No data or only headers

  // Find the row with matching UserID
  for (let i = 1; i < rows.length; i++) {
    const [sheetUserId, sheetPassword, sheetRole] = rows[i];
    if (sheetUserId === userId && sheetPassword === password) {
      return { role: sheetRole };
    }
  }
  return null;
}

module.exports = { verifyUser };
