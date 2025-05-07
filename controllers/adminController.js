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
 * Add Sub - Append a new row to the external submissions sheet.
 */
exports.addSub = async (req, res) => {
  try {
    const { getSheetsClient } = require('../lib/googleSheets');
    const sheets = await getSheetsClient();
    const sheetId = config.EXTERNAL_SHEETS.SUBMISSIONS_SPREADSHEET_ID;
    const sheetName = config.EXTERNAL_SHEETS.SUBMISSIONS_SHEET_NAME;
    const headers = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetName + '!1:1'
    });
    const headerRow = headers.data.values[0];
    // Build row in correct order
    const newRow = headerRow.map(h => req.body[h] || '');
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: sheetName,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values: [newRow] }
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Add Sub Error:', err);
    res.json({ success: false, message: err.message });
  }
};

/**
 * Edit Sub - Update an existing row by index.
 * Expects rowIndex (0-based, not including header).
 */
exports.editSub = async (req, res) => {
  try {
    const { getSheetsClient } = require('../lib/googleSheets');
    const sheets = await getSheetsClient();
    const sheetId = config.EXTERNAL_SHEETS.SUBMISSIONS_SPREADSHEET_ID;
    const sheetName = config.EXTERNAL_SHEETS.SUBMISSIONS_SHEET_NAME;
    const headers = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetName + '!1:1'
    });
    const headerRow = headers.data.values[0];
    const rowIndex = parseInt(req.body.rowIndex, 10);
    if (isNaN(rowIndex)) throw new Error('Invalid row index');
    // +2: 1 for header, 1 for 1-based index
    const sheetRow = rowIndex + 2;
    const updateRow = headerRow.map(h => req.body[h] || '');
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${sheetRow}:` +
        String.fromCharCode(65 + headerRow.length - 1) + `${sheetRow}`,
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
 * Delete Sub - Clear an existing row by index.
 * Expects rowIndex (0-based, not including header).
 */
exports.deleteSub = async (req, res) => {
  try {
    const { getSheetsClient } = require('../lib/googleSheets');
    const sheets = await getSheetsClient();
    const sheetId = config.EXTERNAL_SHEETS.SUBMISSIONS_SPREADSHEET_ID;
    const sheetName = config.EXTERNAL_SHEETS.SUBMISSIONS_SHEET_NAME;
    const headers = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: sheetName + '!1:1'
    });
    const headerRow = headers.data.values[0];
    const rowIndex = parseInt(req.body.rowIndex, 10);
    if (isNaN(rowIndex)) throw new Error('Invalid row index');
    // +2: 1 for header, 1 for 1-based index
    const sheetRow = rowIndex + 2;
    await sheets.spreadsheets.values.clear({
      spreadsheetId: sheetId,
      range: `${sheetName}!A${sheetRow}:` +
        String.fromCharCode(65 + headerRow.length - 1) + `${sheetRow}`
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Delete Sub Error:', err);
    res.json({ success: false, message: err.message });
  }
};

// Add more admin tab handlers below as needed
