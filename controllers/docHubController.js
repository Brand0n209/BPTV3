/**
 * Doc Hub Controller
 * - Fetches and displays Google Drive folders/files assigned to the current user/role.
 * - Admins can assign folders/files to roles/users via the assignments sheet.
 */

const { getSheetRowsByHeaders } = require('../lib/googleSheets');
const { getFileMetadata } = require('../lib/googleDrive');
const config = require('../config/config');

/**
 * Helper: Get all assignments from the Doc Hub assignments sheet.
 * Expected columns: Folder/File ID, Name, Assigned Roles (comma), Assigned Users (comma), Tab Name
 */
async function getAllAssignments() {
  const rows = await getSheetRowsByHeaders(
    config.DOC_HUB_ASSIGNMENTS_SHEET_ID,
    config.DOC_HUB_ASSIGNMENTS_SHEET_NAME,
    1 // header row
  );
  return rows;
}

/**
 * Helper: Get assignments for a specific user/role and tab.
 */
async function getAssignmentsForUser(user, tabName) {
  const all = await getAllAssignments();
  const userId = user && user.email ? user.email.toLowerCase() : '';
  const userRole = user && user.role ? user.role.toLowerCase() : '';
  return all.filter(row => {
    // Check tab match
    if (tabName && row['Tab Name'] && row['Tab Name'].toLowerCase() !== tabName.toLowerCase()) return false;
    // Check role match
    const roles = (row['Assigned Roles'] || '').split(',').map(r => r.trim().toLowerCase());
    // Check user match
    const users = (row['Assigned Users'] || '').split(',').map(u => u.trim().toLowerCase());
    return (roles.includes(userRole) || users.includes(userId));
  });
}

/**
 * GET /admin/doc-hub (admin view: show all assignments, allow assigning)
 * GET /<role>/doc-hub (user view: show assigned folders/files)
 */
exports.docHubView = async (req, res) => {
  try {
    const user = req.session.user;
    const isAdmin = user && user.role === 'admin';
    const tabName = 'Doc Hub'; // Could be dynamic if needed

    let assignments = [];
    if (isAdmin) {
      // Admin: show all assignments
      assignments = await getAllAssignments();
    } else {
      // User: show only assigned
      assignments = await getAssignmentsForUser(user, tabName);
    }

    // Fetch Drive metadata for each assignment
    const driveItems = [];
    for (const row of assignments) {
      if (row['Folder/File ID']) {
        try {
          const meta = await getFileMetadata(row['Folder/File ID']);
          driveItems.push({
            ...row,
            driveMeta: meta
          });
        } catch (err) {
          driveItems.push({
            ...row,
            driveMeta: { error: 'Not found or no access' }
          });
        }
      }
    }

    res.render('admin/docHub', {
      user,
      isAdmin,
      assignments: driveItems,
      activeTab: 'docHub'
    });
  } catch (err) {
    console.error('Doc Hub View Error:', err);
    res.status(500).render('error', { message: 'Failed to load Doc Hub' });
  }
};
