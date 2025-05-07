/**
 * Technician controller for Bright Prodigy.
 * Handles technician dashboard and future technician tab logic.
 */

exports.home = (req, res) => {
  res.render('technician/dashboard', {
    user: req.session.user,
    activeTab: 'home',
    // Add more data for home tab as needed
  });
};

// Future: Add more technician tab handlers here

