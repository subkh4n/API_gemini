const { getModel } = require("../config/gemini");
const { createInlineData, deleteFile } = require("../utils/fileHelper");

/**
 * Generate response from document + text prompt
 * POST /api/generate-from-document
 */
const generateFromDocument = async (req, res) => {
  let filePath = null;

  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Document file is required",
      });
    }

    filePath = req.file.path;
    const prompt = req.body.prompt || "Summarize the content of this document.";

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "text/csv",
      "text/html",
    ];
    if (!allowedTypes.includes(req.file.mimetype)) {
      deleteFile(filePath);
      return res.status(400).json({
        success: false,
        error: "Invalid file type. Allowed: pdf, txt, csv, html",
      });
    }

    // Create inline data for Gemini
    const documentData = createInlineData(filePath, req.file.mimetype);

    // Get Gemini model and generate content with multimodal input
    const model = getModel();
    const result = await model.generateContent([prompt, documentData]);
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

    console.error("Error generating from document:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process document",
      details: error.message,
    });
  }
};

module.exports = { generateFromDocument };
