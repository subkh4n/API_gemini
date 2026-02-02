const { getModel } = require("../config/gemini");

/**
 * Generate text response from text prompt
 * POST /api/generate-text
 */
const generateText = async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validate prompt
    if (!prompt || prompt.trim() === "") {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    // Get Gemini model and generate content
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      data: {
        prompt: prompt,
        response: text,
      },
    });
  } catch (error) {
    console.error("Error generating text:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate text response",
      details: error.message,
    });
  }
};

module.exports = { generateText };
