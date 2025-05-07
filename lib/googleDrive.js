/**
 * Google Drive API integration for Bright Prodigy Doc Hub.
 * Uses service account credentials for server-to-server access.
 */

const { google } = require('googleapis');
const path = require('path');

// Path to your service account key file (update as needed)
const SERVICE_ACCOUNT_KEY_PATH = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH || path.join(__dirname, '../config/service-account.json');

// Scopes for Drive API
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: SCOPES,
  });
  return google.drive({ version: 'v3', auth });
}

/**
 * List folders in Google Drive (optionally under a parent folder)
 */
async function listFolders(parentId = null) {
  const drive = getDriveClient();
  const q = [
    "mimeType = 'application/vnd.google-apps.folder'",
    "'me' in owners",
    parentId ? `'${parentId}' in parents` : null,
    "trashed = false"
  ].filter(Boolean).join(' and ');

  const res = await drive.files.list({
    q,
    fields: 'files(id, name, parents, webViewLink)',
    pageSize: 100,
  });
  return res.data.files;
}

/**
 * List files in a folder
 */
async function listFilesInFolder(folderId) {
  const drive = getDriveClient();
  const q = [
    `'${folderId}' in parents`,
    "trashed = false"
  ].join(' and ');

  const res = await drive.files.list({
    q,
    fields: 'files(id, name, mimeType, webViewLink)',
    pageSize: 100,
  });
  return res.data.files;
}

/**
 * Get file/folder metadata by ID
 */
async function getFileMetadata(fileId) {
  const drive = getDriveClient();
  const res = await drive.files.get({
    fileId,
    fields: 'id, name, mimeType, parents, webViewLink',
  });
  return res.data;
}

module.exports = {
  listFolders,
  listFilesInFolder,
  getFileMetadata,
};
