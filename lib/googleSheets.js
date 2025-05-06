/**
 * Google Sheets API helper
 * All Google Sheets logic for Bright Prodigy lives here.
 */

const { google } = require('googleapis');
const config = require('../config/config');

const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function getSheetsClient() {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  return sheets;
}

module.exports = getSheetsClient;
