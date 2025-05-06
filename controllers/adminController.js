/**
 * Admin controller for Bright Prodigy.
 * Handles admin dashboard and future admin tab logic.
 */

exports.dashboard = (req, res) => {
  res.render('admin/dashboard', {
    user: req.session.user,
    // Add more data for dashboard as needed
  });
};

// Future: Add more admin tab handlers here
