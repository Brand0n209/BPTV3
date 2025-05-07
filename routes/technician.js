/**
 * Technician routes for Bright Prodigy.
 * All technician dashboard and future technician tab routes go here.
 */
const express = require('express');
const router = express.Router();
const { ensureLogin, ensureRole } = require('../lib/sessionHelpers');
const technicianController = require('../controllers/technicianController');

// All technician routes require login and technician role
router.use(ensureLogin, ensureRole('technician'));

// Technician home (dashboard shell)
router.get('/', technicianController.home);

// Future: Add more technician tab routes here

module.exports = router;

