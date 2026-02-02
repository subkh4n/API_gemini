const { getModel } = require("../config/gemini");
const { createInlineData, deleteFile } = require("../utils/fileHelper");

/**
 * Generate response from audio + text prompt
 * POST /api/generate-from-audio
 */
const generateFromAudio = async (req, res) => {
  let filePath = null;

  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Audio file is required",
      });
    }

    filePath = req.file.path;
    const prompt =
      req.body.prompt || "Transcribe and describe this audio content.";

    // Validate file type
    const allowedTypes = [
      "audio/mp3",
      "audio/mpeg",
      "audio/wav",
      "audio/webm",
      "audio/ogg",
      "audio/flac",
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      deleteFile(filePath);
      return res.status(400).json({
        success: false,
        error: "Invalid file type. Allowed: mp3, wav, webm, ogg, flac",
      });
    }

    // Create inline data for Gemini
    const audioData = createInlineData(filePath, req.file.mimetype);

    // Get Gemini model and generate content with multimodal input
    const model = getModel();
    const result = await model.generateContent([prompt, audioData]);
    const response = await result.response;
    const text = response.text();

    // Clean up uploaded file
    deleteFile(filePath);

    res.json({
      success: true,
      data: {
        prompt: prompt,
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        response: text,
      },
    });
  } catch (error) {
    // Clean up file on error
    if (filePath) deleteFile(filePath);

    console.error("Error generating from audio:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process audio",
      details: error.message,
    });
  }
};

module.exports = { generateFromAudio };
