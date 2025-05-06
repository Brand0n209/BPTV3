/**
 * Admin routes for Bright Prodigy.
 * All admin dashboard and future admin tab routes go here.
 */
const express = require('express');
const router = express.Router();
const { ensureLogin, ensureRole } = require('../lib/sessionHelpers');
const adminController = require('../controllers/adminController');

// All admin routes require login and admin role
router.use(ensureLogin, ensureRole('admin'));

/**
 * Admin home (dashboard shell)
 */
router.get('/', adminController.home);

/**
 * TODO: Admin Cust Payout tab route
 */
router.get('/cust-payout', adminController.custPayout);

/**
 * TODO: Admin Customer Management tab route
 */
router.get('/customer-management', adminController.customerManagement);

/**
 * TODO: Admin Staff Management tab route
 */
router.get('/staff-management', adminController.staffManagement);

/**
 * TODO: Admin Referrals tab route
 */
router.get('/referrals', adminController.referrals);

/**
 * TODO: Admin Doc Hub tab route
 */
router.get('/doc-hub', adminController.docHub);

/**
 * TODO: Admin Settings tab route
 */
router.get('/settings', adminController.settings);

/**
 * Admin Subs tab route
 */
router.get('/subs', adminController.subsView);

module.exports = router;
