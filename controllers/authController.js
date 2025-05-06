/**
 * Auth controller for Bright Prodigy.
 * Handles login and logout logic using Google Sheets.
 */

const getSheetsClient = require('../lib/googleSheets');
const config = require('../config/config');

exports.loginForm = (req, res) => {
  res.render('auth/login', { error: null });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
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

    const uidIndex = headers.indexOf('UserID');
    const passIndex = headers.indexOf('Password');
    const roleIndex = headers.indexOf('Role');

    if (uidIndex === -1 || passIndex === -1 || roleIndex === -1) {
      return res.render('auth/login', { error: 'Sheet missing required columns: UserID, Password, or Role.' });
    }

    const match = dataRows.find(row => row[uidIndex] === username && row[passIndex] === password);

    if (match) {
      const user = {
        userId: match[uidIndex],
        role: match[roleIndex],
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
    console.error('Login error:', err);
    return res.render('auth/login', { error: 'Server error. Try again.' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
};
