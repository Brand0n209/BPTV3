/**
 * Admin controller for Bright Prodigy.
 * Handles admin dashboard and all admin tab logic.
 */

exports.home = (req, res) => {
  res.render('admin/dashboard', {
    user: req.session.user,
    activeTab: 'home'
  });
};

/**
 * Admin Cust Payout tab handler
 */
exports.custPayout = (req, res) => {
  res.render('admin/custPayout', {
    user: req.session.user,
    activeTab: 'custPayout'
  });
};

/**
 * Admin Customer Management tab handler
 */
exports.customerManagement = (req, res) => {
  res.render('admin/customerManagement', {
    user: req.session.user,
    activeTab: 'customerManagement'
  });
};

/**
 * Admin Staff Management tab handler
 */
exports.staffManagement = (req, res) => {
  res.render('admin/staffManagement', {
    user: req.session.user,
    activeTab: 'staffManagement'
  });
};

/**
 * Admin Referrals tab handler
 */
exports.referrals = (req, res) => {
  res.render('admin/referrals', {
    user: req.session.user,
    activeTab: 'referrals'
  });
};

/**
 * Admin Doc Hub tab handler
 */
exports.docHub = (req, res) => {
  res.render('admin/docHub', {
    user: req.session.user,
    activeTab: 'docHub'
  });
};

/**
 * Admin Settings tab handler
 */
exports.settings = (req, res) => {
  res.render('admin/settings', {
    user: req.session.user,
    activeTab: 'settings'
  });
};

const { getSheetRowsByHeaders } = require('../lib/googleSheets');
const config = require('../config/config');

// ... other handlers ...

/**
 * Admin Subs tab handler
 * Handles sub-tab navigation and filtering for the Subs table.
 * - Reads ?stage= from query, defaults to "Not Contacted Yet"
 * - Filters rows based on selected stage
 * - Passes filtered rows, user, activeTab, currentStage, and stages to the view
 */
exports.subsView = async (req, res) => {
  try {
    const stages = [
      "All Subs",
      "Not Contacted Yet",
      "Contacted",
      "Waiting Cust Approval",
      "Confirmed & Inputted",
      "Not Interested after sub",
      "Bad Lead",
      "Contacted again, no reply",
      "Fired"
    ];
    let currentStage = req.query.stage || "Not Contacted Yet";

    const rows = await getSheetRowsByHeaders(
      config.SUBMISSIONS_SHEET_ID,
      config.SUBMISSIONS_SHEET_NAME,
      2 // Header row is row 2
    );

    let filteredRows;
    if (currentStage === "All Subs") {
      // Show only rows with "Sub Date" filled, regardless of "Stage"
      filteredRows = rows.filter(r => r["Sub Date"]);
    } else if (currentStage === "Not Contacted Yet" || !currentStage) {
      filteredRows = rows.filter(r => r["Sub Date"] && !r["Stage"]);
    } else {
      filteredRows = rows.filter(r => r["Stage"] === currentStage);
    }

    res.render('admin/subs', {
      user: req.session.user,
      rows: filteredRows,
      activeTab: 'subs',
      stages,
      currentStage,
      subsFormOptions: config.SUBS_FORM_OPTIONS
    });
  } catch (err) {
    console.error('Subs View Error:', err);
    res.status(500).render('error', { message: 'Failed to load subs tab' });
  }
};

/**
 * Add Sub - Append a new row to "2025 Submissions" and "Incomplete" sheets.
 */
exports.addSub = async (req, res) => {
  try {
    const { getSheetsClient } = require('../lib/googleSheets');
    const sheets = await getSheetsClient();

    // Prepare timestamp for "Sub Date"
    const now = new Date();
    const pad = n => n < 10 ? "0" + n : n;
    const formattedDate = now.getFullYear() + "-" +
      pad(now.getMonth() + 1) + "-" +
      pad(now.getDate()) + " " +
      pad(now.getHours()) + ":" +
      pad(now.getMinutes()) + ":" +
      pad(now.getSeconds());

    // 1. Add to "2025 Submissions"
    const id2025 = config.EXTERNAL_SHEETS.SUBMISSIONS_2025_SPREADSHEET_ID;
    const name2025 = config.EXTERNAL_SHEETS.SUBMISSIONS_2025_SHEET_NAME;
    const headers2025 = await sheets.spreadsheets.values.get({
      spreadsheetId: id2025,
      range: name2025 + '!2:2'
    });
    const headerRow2025 = headers2025.data.values[0];
    const row2025 = headerRow2025.map(h =>
      h.trim() === "Sub Date"
        ? formattedDate
        : (req.body[h] !== undefined ? req.body[h] : "")
    );
    await sheets.spreadsheets.values.append({
      spreadsheetId: id2025,
      range: name2025,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [row2025] }
    });

    // 2. Add to "Incomplete"
    const idInc = config.EXTERNAL_SHEETS.INCOMPLETE_SPREADSHEET_ID;
    const nameInc = config.EXTERNAL_SHEETS.INCOMPLETE_SHEET_NAME;
    const headersInc = await sheets.spreadsheets.values.get({
      spreadsheetId: idInc,
      range: nameInc + '!2:2'
    });
    const headerRowInc = headersInc.data.values[0];
    const rowInc = headerRowInc.map(h => {
      if (h.trim() === "Sub Date") return formattedDate;
      if (h.trim() === "First Name") return req.body["First Name"] || "";
      if (h.trim() === "Last Name") return req.body["Last Name"] || "";
      if (h.trim() === "Phone Number") return req.body["Phone Number"] || "";
      if (h.trim() === "Email") return req.body["Email"] || "";
      if (h.trim() === "Referral Source") return req.body["Referral"] || "";
      if (h.trim() === "Address") return req.body["Address"] || "";
      if (h.trim() === "City") return req.body["City"] || "";
      return "";
    });
    await sheets.spreadsheets.values.append({
      spreadsheetId: idInc,
      range: nameInc,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [rowInc] }
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Add Sub Error:', err);
    res.json({ success: false, message: err.message });
  }
};

/**
 * Edit Sub - Update a row in "2025 Submissions" by matching Sub Date, First Name, and Last Name.
 */
exports.editSub = async (req, res) => {
  try {
    const { getSheetsClient } = require('../lib/googleSheets');
    const sheets = await getSheetsClient();
    const sheetId = config.EXTERNAL_SHEETS.SUBMISSIONS_2025_SPREADSHEET_ID;
    const sheetName = config.EXTERNAL_SHEETS.SUBMISSIONS_2025_SHEET_NAME;

    // Unique fields to match
    const subDate = req.body["Sub Date"] || req.body["Pref Service Date (LIGHTING)"] || "";
    const firstName = req.body["First Name"] || "";
    const lastName = req.body["Last Name"] || "";

    // Get all rows and headers
    const dataResp = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetName
    });
    const rows = dataResp.data.values || [];
    if (rows.length < 2) throw new Error("Sheet has no data");
    const headers = rows[1]; // Row 2 is headers
    const subDateIdx = headers.indexOf("Sub Date");
    const firstNameIdx = headers.indexOf("First Name");
    const lastNameIdx = headers.indexOf("Last Name");

    // Find the row index (1-based) to update
    let foundRowIdx = -1;
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (
        (subDateIdx === -1 || (row[subDateIdx] || "").toString().trim() === subDate.toString().trim()) &&
        (firstNameIdx === -1 || (row[firstNameIdx] || "").toString().trim().toLowerCase() === firstName.toString().trim().toLowerCase()) &&
        (lastNameIdx === -1 || (row[lastNameIdx] || "").toString().trim().toLowerCase() === lastName.toString().trim().toLowerCase())
      ) {
        foundRowIdx = i + 1; // 1-based index for Sheets API
        break;
      }
    }
    if (foundRowIdx === -1) throw new Error("No matching row found in 2025 Submissions");

    // Build updated row, preserving "Sub Date"
    const updateRow = headers.map((h, idx) => {
      if (h.trim() === "Sub Date") {
        return rows[foundRowIdx - 1][idx]; // preserve original value
      }
      return req.body[h] !== undefined ? req.body[h] : "";
    });

    // Update the row
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${foundRowIdx}:` +
        String.fromCharCode(65 + headers.length - 1) + `${foundRowIdx}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [updateRow] }
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Edit Sub Error:', err);
    res.json({ success: false, message: err.message });
  }
};

/**
 * Delete Sub - Delete the row in "2025 Submissions", "Incomplete", and "Submissions"
 * that matches Sub Date, First Name, and Last Name.
 */
exports.deleteSub = async (req, res) => {
  try {
    const { getSheetsClient } = require('../lib/googleSheets');
    const sheets = await getSheetsClient();

    // Unique fields to match
    const subDate = req.body["Sub Date"] || req.body["Pref Service Date (LIGHTING)"] || "";
    const firstName = req.body["First Name"] || "";
    const lastName = req.body["Last Name"] || "";

    // Helper to find row index (1-based) in a sheet by unique fields
    async function findRowIndex(sheetId, sheetName, matchFields) {
      const dataResp = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: sheetName
      });
      const rows = dataResp.data.values || [];
      if (rows.length < 2) return -1;
      const headers = rows[1]; // Row 2 is headers
      const subDateIdx = headers.indexOf("Sub Date");
      const firstNameIdx = headers.indexOf("First Name");
      const lastNameIdx = headers.indexOf("Last Name");
      for (let i = 2; i < rows.length; i++) {
        const row = rows[i];
        if (
          (subDateIdx === -1 || (row[subDateIdx] || "").toString().trim() === matchFields.subDate.toString().trim()) &&
          (firstNameIdx === -1 || (row[firstNameIdx] || "").toString().trim().toLowerCase() === matchFields.firstName.toString().trim().toLowerCase()) &&
          (lastNameIdx === -1 || (row[lastNameIdx] || "").toString().trim().toLowerCase() === matchFields.lastName.toString().trim().toLowerCase())
        ) {
          return i + 1; // 1-based index for Sheets API
        }
      }
      return -1;
    }

    // List of sheets to delete from
    const sheetsToDelete = [
      {
        id: config.EXTERNAL_SHEETS.SUBMISSIONS_2025_SPREADSHEET_ID,
        name: config.EXTERNAL_SHEETS.SUBMISSIONS_2025_SHEET_NAME
      },
      {
        id: config.EXTERNAL_SHEETS.INCOMPLETE_SPREADSHEET_ID,
        name: config.EXTERNAL_SHEETS.INCOMPLETE_SHEET_NAME
      },
      {
        id: config.EXTERNAL_SHEETS.SUBMISSIONS_SPREADSHEET_ID,
        name: config.EXTERNAL_SHEETS.SUBMISSIONS_SHEET_NAME
      }
    ];

    let deletedCount = 0;
    for (const sheetInfo of sheetsToDelete) {
      const rowIdx = await findRowIndex(sheetInfo.id, sheetInfo.name, { subDate, firstName, lastName });
      if (rowIdx > 2) { // Only delete if found and not header/title
        // Get the sheetId (integer) for the sheet name
        const meta = await sheets.spreadsheets.get({ spreadsheetId: sheetInfo.id });
        const sheetMeta = (meta.data.sheets || []).find(s => s.properties && s.properties.title === sheetInfo.name);
        if (!sheetMeta) continue;
        const actualSheetId = sheetMeta.properties.sheetId;
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: sheetInfo.id,
          resource: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: actualSheetId,
                    dimension: "ROWS",
                    startIndex: rowIdx - 1,
                    endIndex: rowIdx
                  }
                }
              }
            ]
          }
        });
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      res.json({ success: true, message: `Deleted from ${deletedCount} sheet(s).` });
    } else {
      res.json({ success: false, message: "No matching row found in any sheet." });
    }
  } catch (err) {
    console.error('Delete Sub Error:', err);
    res.json({ success: false, message: err.message });
  }
};

// Add more admin tab handlers below as needed
