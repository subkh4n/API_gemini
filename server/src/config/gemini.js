const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini 1.5 Flash model
const getModel = () => {
  return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
};

module.exports = { genAI, getModel };
