/**
 * Technician controller for Bright Prodigy.
 * Handles technician dashboard and future technician tab logic.
 */

exports.dashboard = (req, res) => {
  res.render('technician/dashboard', {
    user: req.session.user,
    // Add more data for dashboard as needed
  });
};

// Future: Add more technician tab handlers here
