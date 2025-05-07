/**
 * Advisor controller for Bright Prodigy.
 * Handles advisor dashboard and future advisor tab logic.
 */

exports.home = (req, res) => {
  res.render('advisor/dashboard', {
    user: req.session.user,
    activeTab: 'home',
    // Add more data for home tab as needed
  });
};

// Future: Add more advisor tab handlers here

