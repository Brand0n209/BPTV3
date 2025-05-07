const { google } = require('googleapis');
const config = require('../config/config'); // adjust path as needed
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
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

async function appendRowByHeaders(spreadsheetId, sheetName, headers, dataRow) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });
  
  // First, get the actual sheet range to determine where to append
  const metaResponse = await sheets.spreadsheets.get({
    spreadsheetId,
    ranges: [`${sheetName}`],
    fields: 'sheets.properties'
  });
  
  // Find next empty row
  const rangeMeta = `${sheetName}!A:Z`;
  const rangeResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: rangeMeta
  });
  
  const nextRowIndex = rangeResponse.data.values ? rangeResponse.data.values.length + 1 : 1;
  
  // Format the range where we'll add the data
  const range = `${sheetName}!A${nextRowIndex}`;
  
  // Append the data row
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    resource: {
      values: [dataRow]
    }
  });
  
  return { success: true };
}

module.exports = {
  getSheetsClient,
  getSheetRowsByHeaders,
  appendRowByHeaders
};

