/**
 * Customer controller for Bright Prodigy.
 * Handles customer dashboard and future customer tab logic.
 */

exports.home = (req, res) => {
  res.render('customer/dashboard', {
    user: req.session.user,
    activeTab: 'home',
    // Add more data for home tab as needed
  });
};

// Future: Add more customer tab handlers here

