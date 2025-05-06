/**
 * Auth controller for Bright Prodigy.
 * Handles login and logout logic using Google Sheets.
 */

const { getSheetsClient } = require('../lib/googleSheets');
const config = require('../config/config');

exports.loginForm = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Log sheet config in development for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.log('Login: Using Google Sheet ID:', config.GOOGLE_SHEET_ID);
    console.log('Login: Using Google Sheet Tab:', config.GOOGLE_SHEET_TAB);
  }

  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.GOOGLE_SHEET_ID,
      range: `${config.GOOGLE_SHEET_TAB}!A1:Z`, // Read headers + all columns
    });

    const rows = response.data.values || [];
    if (rows.length < 2) {
      return res.render('auth/login', { error: 'No users found.' });
    }

    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Log headers and first 3 data rows for debugging (TEMP: always log, even in production)
    console.log('Login: Sheet headers:', headers);
    console.log('Login: First 3 data rows:', dataRows.slice(0, 3));

    const uidIndex = headers.indexOf('UserID');
    const passIndex = headers.indexOf('Password');
    const roleIndex = headers.indexOf('Role');
    const firstNameIndex = headers.indexOf('First Name');

    if (uidIndex === -1 || passIndex === -1 || roleIndex === -1) {
      return res.render('auth/login', { error: 'Sheet missing required columns: UserID, Password, or Role.' });
    }

    const match = dataRows.find(row => row[uidIndex] === username && row[passIndex] === password);

    if (match) {
      const user = {
        userId: match[uidIndex],
        role: match[roleIndex],
        firstName: firstNameIndex !== -1 ? match[firstNameIndex] : ''
      };
      req.session.user = user;
      // Redirect to role-based dashboard
      switch (user.role) {
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
    // Log full error object for debugging (TEMP: always log, even in production)
    console.error('Login error (full object):', err);

    // More specific error handling for Google Sheets issues
    let errorMsg = 'Server error. Try again.';
    if (err && err.message) {
      if (
        err.message.includes('Unable to parse range') ||
        err.message.includes('Requested entity was not found') ||
        err.message.includes('No API key') ||
        err.message.includes('PERMISSION_DENIED')
      ) {
        errorMsg = 'Google Sheet or tab not found, or access denied. Please check configuration.';
      } else if (err.message.includes('invalid_grant')) {
        errorMsg = 'Google API authentication failed. Contact admin.';
      }
    }

    return res.render('auth/login', { error: errorMsg });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};
