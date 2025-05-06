/**
 * Admin controller for Bright Prodigy.
 * Handles admin dashboard and future admin tab logic.
 */

exports.home = (req, res) => {
  res.render('admin/dashboard', {
    user: req.session.user,
    activeTab: 'home',
    // Add more data for home tab as needed
  });
};

/**
 * TODO: Admin Cust Payout tab handler
 */
exports.custPayout = (req, res) => {
  res.render('admin/custPayout', {
    user: req.session.user,
    activeTab: 'custPayout'
  });
};

/**
 * TODO: Admin Customer Management tab handler
 */
exports.customerManagement = (req, res) => {
  res.render('admin/customerManagement', {
    user: req.session.user,
    activeTab: 'customerManagement'
  });
};

/**
 * TODO: Admin Staff Management tab handler
 */
exports.staffManagement = (req, res) => {
  res.render('admin/staffManagement', {
    user: req.session.user,
    activeTab: 'staffManagement'
  });
};

/**
 * TODO: Admin Referrals tab handler
 */
exports.referrals = (req, res) => {
  res.render('admin/referrals', {
    user: req.session.user,
    activeTab: 'referrals'
  });
};

/**
 * TODO: Admin Doc Hub tab handler
 */
exports.docHub = (req, res) => {
  res.render('admin/docHub', {
    user: req.session.user,
    activeTab: 'docHub'
  });
};

/**
 * TODO: Admin Settings tab handler
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

exports.subsView = async (req, res) => {
  const stage = decodeURIComponent(req.params.stage || 'Not Contacted Yet');
  const sheetId = config.GOOGLE_SHEET_ID || config.SUBMISSIONS_SHEET_ID;
  const sheetName = config.SUBMISSIONS_SHEET_NAME || 'Submissions';

  try {
    const allRows = await getSheetRowsByHeaders(sheetId, sheetName, 2);
    const headers = Object.keys(allRows[0] || {});

    // Filter logic
    const filteredRows = allRows.filter(row => {
      if (stage === 'Not Contacted Yet') {
        return row['Sub Date'] && !row['Stage'];
      }
      return row['Stage'] === stage;
    });

    // Format rows into arrays
    const tableRows = filteredRows.map(row =>
      headers.map(header => row[header] || '')
    );

    res.render('admin/subs', {
      headers,
      rows: tableRows,
      currentStage: stage,
      user: req.session.user
    });
  } catch (err) {
    console.error('SubsView error:', err);
    res.render('error', { message: 'Unable to load submissions.' });
  }
};

// Future: Add more admin tab handlers here
