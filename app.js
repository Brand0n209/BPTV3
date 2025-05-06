/**
 * Bright Prodigy - Main Express App
 * Modular, scalable CRM and scheduling platform
 */

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const getSheetsClient = require('./lib/googleSheets');
const config = require('./config/config');
const { ensureLogin } = require('./lib/sessionHelpers');

// Role routes
const adminRoutes = require('./routes/admin');
const advisorRoutes = require('./routes/advisor');
const technicianRoutes = require('./routes/technician');
const customerRoutes = require('./routes/customer');

const app = express();
const PORT = process.env.PORT || 8080;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// =====================
// Auth Routes
// =====================

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// For convenience, redirect /logout to /auth/logout
app.get('/logout', (req, res) => res.redirect('/auth/logout'));

// =====================
// Role Dashboards
// =====================

app.use('/admin', adminRoutes);
app.use('/advisor', advisorRoutes);
app.use('/technician', technicianRoutes);
app.use('/customer', customerRoutes);

// =====================
// Home Route
// =====================

app.get('/', (req, res) => {
  if (req.session.user) {
    // Redirect to dashboard based on role
    switch (req.session.user.role) {
      case 'admin':
        return res.redirect('/admin');
      case 'advisor':
        return res.redirect('/advisor');
      case 'technician':
        return res.redirect('/technician');
      case 'customer':
        return res.redirect('/customer');
      default:
        return res.redirect('/auth/login');
    }
  }
  res.redirect('/auth/login');
});

// =====================
// Error Handling
// =====================

app.use((req, res) => {
  res.status(404).render('error', { message: 'Page not found', user: req.session.user });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).render('error', { message: 'Internal server error', user: req.session.user });
});

// =====================
// Start Server
// =====================

app.listen(PORT, () => {
  console.log(`Bright Prodigy server running on port ${PORT}`);
});
