const fs = require("fs");
const path = require("path");

/**
 * Convert file to Base64 encoded string
 * @param {string} filePath - Path to the file
 * @returns {string} Base64 encoded string
 */
const fileToBase64 = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString("base64");
};

/**
 * Get MIME type from file extension
 * @param {string} filePath - Path to the file
 * @returns {string} MIME type
 */
const getMimeType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    // Images
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    // Documents
    ".pdf": "application/pdf",
    ".txt": "text/plain",
    ".csv": "text/csv",
    ".html": "text/html",
    // Audio
    ".mp3": "audio/mp3",
    ".wav": "audio/wav",
    ".webm": "audio/webm",
    ".ogg": "audio/ogg",
    ".flac": "audio/flac",
  };
  return mimeTypes[ext] || "application/octet-stream";
};

/**
 * Create inline data object for Gemini API
 * @param {string} filePath - Path to the file
 * @param {string} mimeType - Optional MIME type (auto-detected if not provided)
 * @returns {Object} Inline data object for Gemini
 */
const createInlineData = (filePath, mimeType = null) => {
  const base64Data = fileToBase64(filePath);
  const mime = mimeType || getMimeType(filePath);

  return {
    inlineData: {
      data: base64Data,
      mimeType: mime,
    },
  };
};

/**
 * Safely delete a file
 * @param {string} filePath - Path to the file to delete
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✓ Cleaned up file: ${path.basename(filePath)}`);
    }
  } catch (error) {
    console.error(`✗ Error deleting file ${filePath}:`, error.message);
  }
};

module.exports = {
  fileToBase64,
  getMimeType,
  createInlineData,
  deleteFile,
};
