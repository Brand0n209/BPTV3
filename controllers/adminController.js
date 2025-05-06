/**
 * Admin controller for Bright Prodigy.
 * Handles admin dashboard and future admin tab logic.
 */

exports.home = (req, res) => {
  res.render('admin/dashboard', {
    user: req.session.user,
    activeTab: 'home',
    // Add more data for home tab as needed
  });
};

// Future: Add more admin tab handlers here
