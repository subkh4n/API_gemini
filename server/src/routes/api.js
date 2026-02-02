const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

// Import controllers
const { generateText } = require("../controllers/textController");
const { generateFromImage } = require("../controllers/imageController");
const { generateFromDocument } = require("../controllers/documentController");
const { generateFromAudio } = require("../controllers/audioController");

/**
 * @route   POST /api/generate-text
 * @desc    Generate text response from text prompt
 * @access  Public
 * @body    { prompt: string }
 */
router.post("/generate-text", generateText);

/**
 * @route   POST /api/generate-from-image
 * @desc    Generate response from image + text prompt
 * @access  Public
 * @body    FormData with 'file' (image) and optional 'prompt' (text)
 */
router.post("/generate-from-image", upload.single("file"), generateFromImage);

/**
 * @route   POST /api/generate-from-document
 * @desc    Generate response from document + text prompt
 * @access  Public
 * @body    FormData with 'file' (document) and optional 'prompt' (text)
 */
router.post(
  "/generate-from-document",
  upload.single("file"),
  generateFromDocument,
);

/**
 * @route   POST /api/generate-from-audio
 * @desc    Generate response from audio + text prompt
 * @access  Public
 * @body    FormData with 'file' (audio) and optional 'prompt' (text)
 */
router.post("/generate-from-audio", upload.single("file"), generateFromAudio);

module.exports = router;
