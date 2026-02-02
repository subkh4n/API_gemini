const { getModel } = require("../config/gemini");
const { createInlineData, deleteFile } = require("../utils/fileHelper");

/**
 * Generate response from image + text prompt
 * POST /api/generate-from-image
 */
const generateFromImage = async (req, res) => {
  let filePath = null;

  try {
    // Validate file upload
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "Image file is required",
      });
    }

    filePath = req.file.path;
    const prompt = req.body.prompt || "Describe this image in detail.";

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(req.file.mimetype)) {
      deleteFile(filePath);
      return res.status(400).json({
        success: false,
        error: "Invalid file type. Allowed: jpeg, png, gif, webp",
      });
    }

    // Create inline data for Gemini
    const imageData = createInlineData(filePath, req.file.mimetype);

    // Get Gemini model and generate content with multimodal input
    const model = getModel();
    const result = await model.generateContent([prompt, imageData]);
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

    console.error("Error generating from image:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process image",
      details: error.message,
    });
  }
};

module.exports = { generateFromImage };
