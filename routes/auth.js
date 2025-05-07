/**
 * Auth routes for Bright Prodigy.
 * Handles login and logout endpoints.
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// GET /auth/login
router.get('/login', authController.loginForm);

// POST /auth/login
router.post('/login', authController.login);

// GET /auth/logout
router.get('/logout', authController.logout);

module.exports = router;

