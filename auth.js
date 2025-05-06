const { google } = require('googleapis');

// Use Application Default Credentials for Google Sheets API
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function getSheetsClient() {
  const authClient = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: authClient });
  return sheets;
}

module.exports = getSheetsClient;
