const { google } = require('googleapis');
const config = require('../config/config'); // adjust path as needed
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function getSheetsClient() {
  const client = await auth.getClient();
  return google.sheets({ version: 'v4', auth: client });
}

async function getSheetRowsByHeaders(spreadsheetId, sheetName, headerRow = 1) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const range = `${sheetName}`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length <= headerRow) return [];

  const headers = rows[headerRow - 1];
  const dataRows = rows.slice(headerRow);

  return dataRows.map(row => {
    const rowObj = {};
    headers.forEach((header, i) => {
      rowObj[header] = row[i] || '';
    });
    return rowObj;
  });
}

module.exports = {
  getSheetsClient,
  getSheetRowsByHeaders,
};
