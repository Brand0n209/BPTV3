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

// GET /auth/login
app.get('/auth/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// POST /auth/login
app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.GOOGLE_SHEET_ID,
      range: `${config.GOOGLE_SHEET_TAB}!A1:Z`, // Read headers + all columns
    });

    const values = response.data.values || [];
    if (values.length < 2) {
      return res.render('auth/login', { error: 'No users found.' });
    }

    // Map headers to column indices
    const headers = values[0];
    const rows = values.slice(1);

    // Ensure required headers exist
    const userIdIdx = headers.indexOf('UserID');
    const passwordIdx = headers.indexOf('Password');
    const roleIdx = headers.indexOf('Role');
    if (userIdIdx === -1 || passwordIdx === -1 || roleIdx === -1) {
      return res.render('auth/login', { error: 'Sheet missing required columns: UserID, Password, or Role.' });
    }

    // Find user by correct column index
    const match = rows.find(row =>
      (row[userIdIdx] || '') === username && (row[passwordIdx] || '') === password
    );

    if (match) {
      // Map row to object for session using header names
      const rowObj = {};
      headers.forEach((h, i) => { rowObj[h] = match[i]; });
      req.session.user = {
        userId: match[userIdIdx],
        role: match[roleIdx] || 'unknown',
        firstName: rowObj['First Name'] || '',
        lastName: rowObj['Last Name'] || '',
        // Add more fields as needed
      };
      // Redirect based on role
      switch (match[roleIdx]) {
        case 'admin':
          return res.redirect('/admin');
        case 'advisor':
          return res.redirect('/advisor');
        case 'technician':
          return res.redirect('/technician');
        case 'customer':
          return res.redirect('/customer');
        default:
          return res.render('auth/login', { error: 'Unknown role. Contact admin.' });
      }
    } else {
      return res.render('auth/login', { error: 'Invalid UserID or Password.' });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.render('auth/login', { error: 'Server error. Try again.' });
  }
});

// GET /logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

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
