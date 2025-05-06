/**
 * Customer controller for Bright Prodigy.
 * Handles customer dashboard and future customer tab logic.
 */

exports.dashboard = (req, res) => {
  res.render('customer/dashboard', {
    user: req.session.user,
    // Add more data for dashboard as needed
  });
};

// Future: Add more customer tab handlers here
