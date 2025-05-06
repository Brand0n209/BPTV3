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

const { getSheetRowsByHeaders, getRowsFromSheet } = require('../lib/googleSheets');
const config = require('../config/config');

// ... other handlers ...

exports.renderSubs = async (req, res) => {
  try {
    const stage = req.params.stage || 'Not Contacted Yet';
    const sheetName = 'Submissions';
    const sheetId = config.SUBMISSIONS_SHEET_ID;

    const rows = await getRowsFromSheet(sheetId, sheetName, 2); // starts from row 2 (headers)
    
    let filtered = [];

    if (stage === 'Not Contacted Yet') {
      filtered = rows.filter(row =>
        row['Stage'] === '' && row['Sub Date'] && row['Sub Date'].trim() !== ''
      );
    } else {
      filtered = rows.filter(row => row['Stage'] === stage);
    }

    res.render('admin/subs', {
      title: 'Subs',
      activeTab: 'subs',
      currentStage: stage,
      submissions: filtered
    });
  } catch (err) {
    console.error('Subs load error:', err);
    res.status(500).render('error', { message: 'Failed to load Subs' });
  }
};

// Future: Add more admin tab handlers here
