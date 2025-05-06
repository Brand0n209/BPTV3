/**
 * Advisor routes for Bright Prodigy.
 * All advisor dashboard and future advisor tab routes go here.
 */
const express = require('express');
const router = express.Router();
const { ensureLogin, ensureRole } = require('../lib/sessionHelpers');
const advisorController = require('../controllers/advisorController');

// All advisor routes require login and advisor role
router.use(ensureLogin, ensureRole('advisor'));

// Advisor dashboard (home)
router.get('/', advisorController.dashboard);

// Future: Add more advisor tab routes here

module.exports = router;
