const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter for different file types
const fileFilter = (req, file, cb) => {
  // Define allowed MIME types
  const allowedTypes = {
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
    document: ["application/pdf", "text/plain", "text/csv", "text/html"],
    audio: [
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/ogg",
      "audio/flac",
    ],
  };

  // Get all allowed types
  const allAllowed = [
    ...allowedTypes.image,
    ...allowedTypes.document,
    ...allowedTypes.audio,
  ];

  if (allAllowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type ${file.mimetype} is not supported. Allowed types: images (jpeg, png, gif, webp), documents (pdf, txt, csv, html), audio (mp3, wav, webm, ogg, flac)`,
      ),
      false,
    );
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB max file size
  },
});

module.exports = upload;
