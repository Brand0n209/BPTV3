require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const { verifyUser } = require('./auth');
const config = require('./config');

const app = express();
const PORT = process.env.PORT || 8080;

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

// Serve static files from views/
app.use(express.static(path.join(__dirname, 'views')));

// Helper: Protect routes by role
function requireRole(role) {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      return res.redirect('/login.html');
    }
    next();
  };
}

// Helper: Require login for any dashboard
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login.html');
  }
  next();
}

// Routes

// GET /login.html (served as static file)

// POST /login
app.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  try {
    const result = await verifyUser(userId, password);
    if (result && result.role) {
      req.session.user = { userId, role: result.role };
      // Redirect based on role
      if (result.role === 'admin') return res.redirect('/admin.html');
      if (result.role === 'technician') return res.redirect('/technician.html');
      if (result.role === 'customer') return res.redirect('/customer.html');
      // Unknown role fallback
      return res.redirect('/login.html?error=role');
    } else {
      return res.redirect('/login.html?error=invalid');
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.redirect('/login.html?error=server');
  }
});

// GET /admin.html (protected)
app.get('/admin.html', requireRole('admin'), (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// GET /technician.html (protected)
app.get('/technician.html', requireRole('technician'), (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'technician.html'));
});

// GET /customer.html (protected)
app.get('/customer.html', requireRole('customer'), (req, res, next) => {
  res.sendFile(path.join(__dirname, 'views', 'customer.html'));
});

// GET /logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

// Default route
app.get('/', (req, res) => {
  if (req.session.user) {
    // Redirect to dashboard based on role
    if (req.session.user.role === 'admin') return res.redirect('/admin.html');
    if (req.session.user.role === 'technician') return res.redirect('/technician.html');
    if (req.session.user.role === 'customer') return res.redirect('/customer.html');
  }
  res.redirect('/login.html');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
