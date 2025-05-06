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

const getSheetsClient = require('../lib/googleSheets');
const {
  SUBMISSIONS_SHEET_ID,
  SUBMISSIONS_SHEET_NAME
} = require('../config/config');

/**
 * Admin Subs tab handler with sub-tab filtering.
 * Fetches and filters submissions from Google Sheets.
 */
exports.getSubs = async (req, res) => {
  const filterType = req.params.filterType;
  const currentStage = filterType;
  const stages = [
    "Not Contacted Yet", "Contacted", "Waiting Cust Approval", 
    "Confirmed & Inputted", "Not Interested after sub", 
    "Bad Lead", "Contacted again, no reply", "Fired"
  ];
  let submissions = [];
  let error = null;
  let headers = [];
  let rows = [];

  try {
    const sheets = await getSheetsClient();
    // Get headers from row 2
    const headerRange = `${SUBMISSIONS_SHEET_NAME}!A2:Z2`;
    const headerResp = await sheets.spreadsheets.values.get({
      spreadsheetId: SUBMISSIONS_SHEET_ID,
      range: headerRange,
    });
    headers = (headerResp.data.values && headerResp.data.values[0]) || [];

    // Get data rows starting from row 3
    const dataRange = `${SUBMISSIONS_SHEET_NAME}!A3:Z`;
    const dataResp = await sheets.spreadsheets.values.get({
      spreadsheetId: SUBMISSIONS_SHEET_ID,
      range: dataRange,
    });
    const dataRows = dataResp.data.values || [];

    // Convert each row to an object
    const allSubs = dataRows.map(row => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i] || '';
      });
      return obj;
    });

    // Filtering logic for each sub-tab
    switch (filterType) {
      case 'Not Contacted Yet':
        submissions = allSubs.filter(
          sub => sub['Sub Date'] && !sub['Stage']
        );
        break;
      case 'Contacted':
      case 'Waiting Cust Approval':
      case 'Confirmed & Inputted':
      case 'Not Interested after sub':
      case 'Bad Lead':
      case 'Contacted again, no reply':
      case 'Fired':
        submissions = allSubs.filter(
          sub => sub['Stage'] === filterType
        );
        break;
      default:
        submissions = [];
    }

    // Build rows array for table rendering
    rows = submissions.map(sub => headers.map(h => sub[h] || ''));
  } catch (err) {
    error = 'Error fetching submissions from Google Sheets.';
    submissions = [];
    headers = [];
    rows = [];
  }

  const selectedRow = typeof req.query.selected !== 'undefined' ? parseInt(req.query.selected) : -1;
  const rowClasses = submissions.map((row, idx) => {
    let cls = 'cursor-pointer transition';
    cls += (idx % 2 === 0 ? ' bg-white' : ' bg-gray-50');
    if (selectedRow === idx) cls += ' ring-2 ring-blue-400 bg-blue-100';
    return cls;
  });

  res.render('admin/subs', {
    user: req.session.user,
    activeTab: 'subs',
    filterType,
    currentStage,
    stages,
    submissions,
    headers,
    rows,
    error,
    selectedRow,
    rowClasses,
    subTabs: [
      { label: 'Not Contacted Yet', value: 'Not Contacted Yet' },
      { label: 'Contacted', value: 'Contacted' },
      { label: 'Waiting Cust Approval', value: 'Waiting Cust Approval' },
      { label: 'Confirmed & Inputted', value: 'Confirmed & Inputted' },
      { label: 'Not Interested after sub', value: 'Not Interested after sub' },
      { label: 'Bad Lead', value: 'Bad Lead' },
      { label: 'Contacted again, no reply', value: 'Contacted again, no reply' },
      { label: 'Fired', value: 'Fired' }
    ]
  });
};

// Future: Add more admin tab handlers here
