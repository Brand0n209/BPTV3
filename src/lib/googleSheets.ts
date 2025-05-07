import { google, sheets_v4 } from "googleapis";

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

import { JWT } from "google-auth-library";

export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
  const client = (await auth.getClient()) as JWT;
  return google.sheets({ version: "v4", auth: client });
}

export async function getSheetRowsByHeaders(
  spreadsheetId: string,
  sheetName: string,
  headerRow = 1
): Promise<Record<string, string>[]> {
  const sheets = await getSheetsClient();
  const range = `${sheetName}`;
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length < headerRow) return [];

  const headers = rows[headerRow - 1];
  const dataRows = rows.slice(headerRow);

  return dataRows.map((row: string[]) => {
    const rowObj: Record<string, string> = {};
    headers.forEach((header: string, i: number) => {
      rowObj[header] = row[i] || "";
    });
    return rowObj;
  });
}

export async function appendRowByHeaders(
  spreadsheetId: string,
  sheetName: string,
  headers: string[],
  dataRow: string[]
): Promise<{ success: boolean }> {
  const sheets = await getSheetsClient();

  // Find next empty row
  const rangeMeta = `${sheetName}!A:Z`;
  const rangeResponse = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: rangeMeta,
  });

  const nextRowIndex = rangeResponse.data.values ? rangeResponse.data.values.length + 1 : 1;
  const range = `${sheetName}!A${nextRowIndex}`;

  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [dataRow],
    },
  });

  return { success: true };
}
