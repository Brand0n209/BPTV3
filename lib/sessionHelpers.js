/**
 * Session and role-based route protection middleware for Bright Prodigy.
 */

function ensureLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
}

function ensureRole(role) {
  return (req, res, next) => {
    if (!req.session.user || req.session.user.role !== role) {
      // Optionally, render a clean error page
      return res.status(403).render('error', { message: 'Unauthorized' });
    }
    next();
  };
}

module.exports = { ensureLogin, ensureRole };
