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

// Future: Add more admin tab handlers here
