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

// Admin home (dashboard shell)
router.get('/', adminController.home);

// Future: Add more admin tab routes here

module.exports = router;
