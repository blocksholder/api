/**
 * Utility functions for secure file handling
 */

/**
 * Generate a secure file path for database storage
 * Format: /files/view/:userId/:fieldName/:fileName
 */
export const generateSecureFilePath = (
  userId: string,
  fieldName: string,
  fileName: string
): string => {
  return `/files/view/${userId}/${fieldName}/${fileName}`;
};

/**
 * Generate a secure file download URL
 * Format: /files/download/:userId/:fieldName/:fileName
 */
export const generateSecureDownloadUrl = (
  userId: string,
  fieldName: string,
  fileName: string
): string => {
  return `/files/download/${userId}/${fieldName}/${fileName}`;
};

/**
 * Extract file information from stored path
 */
export const parseSecureFilePath = (filePath: string): {
  userId: string;
  fieldName: string;
  fileName: string;
} | null => {
  // Match pattern: /files/view/:userId/:fieldName/:fileName
  const match = filePath.match(/\/files\/(view|download)\/([^\/]+)\/([^\/]+)\/(.+)/);
  
  if (!match) {
    return null;
  }

  return {
    userId: match[2],
    fieldName: match[3],
    fileName: match[4],
  };
};
