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

    // Pre-merge lighting options for the form
    const lightingOptions = [
      ...config.SUBS_FORM_OPTIONS.LIGHTING_OPTIONS_TEMPORARY,
      ...config.SUBS_FORM_OPTIONS.LIGHTING_OPTIONS_PERMANENT
    ];
    const subsFormOptions = {
      ...config.SUBS_FORM_OPTIONS,
      LIGHTING_OPTIONS: lightingOptions
    };
    res.render('admin/subs', {
      user: req.session.user,
      rows: filteredRows,
      activeTab: 'subs',
      stages,
      currentStage,
      subsFormOptions
    });
  } catch (err) {
    console.error('Subs View Error:', err);
    res.status(500).render('error', { message: 'Failed to load subs tab' });
  }
};

/**
 * Add Sub (AJAX POST)
 * Adds a new sub to the submissions sheet.
 */
const { appendRowByHeaders } = require('../lib/googleSheets');

exports.addSub = async (req, res) => {
  try {
    const SUBS_HEADERS = [
      "First Name", "Last Name", "Phone Number", "Email", "Referral", "Address", "City", "Home Stories",
      "Lighting Options", "Lighting Sides", "Pref Service Date (LIGHTING)", "Measure", "Lighting notes",
      "Solar Selected Services", "Pref Service Date (SOLAR)", "Solar Panels", "Solar notes",
      "Gutter Selected Service", "Pref Service Date (GUTTER)", "Gutter notes"
    ];
    const data = req.body || {};
    // Basic validation
    const required = ["First Name", "Last Name", "Phone Number", "Referral", "Address", "City", "Home Stories"];
    for (const field of required) {
      if (!data[field] || typeof data[field] !== "string" || !data[field].trim()) {
        return res.status(400).json({ success: false, message: `Missing required field: ${field}` });
      }
    }
    // Prepare row in correct order
    const row = SUBS_HEADERS.map(h => (data[h] || "").trim());
    // Append to sheet
    await appendRowByHeaders(
      config.SUBMISSIONS_SHEET_ID,
      config.SUBMISSIONS_SHEET_NAME,
      SUBS_HEADERS,
      row
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Add Sub Error:", err);
    res.status(500).json({ success: false, message: err.message || "Failed to add sub" });
  }
};

// (Removed: addSub, editSub, and deleteSub controller functions)

// Add more admin tab handlers below as needed

