/**
 * Customer routes for Bright Prodigy.
 * All customer dashboard and future customer tab routes go here.
 */
const express = require('express');
const router = express.Router();
const { ensureLogin, ensureRole } = require('../lib/sessionHelpers');
const customerController = require('../controllers/customerController');

// All customer routes require login and customer role
router.use(ensureLogin, ensureRole('customer'));

// Customer home (dashboard shell)
router.get('/', customerController.home);

// Future: Add more customer tab routes here

module.exports = router;

