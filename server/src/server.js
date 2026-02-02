require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routes
const apiRoutes = require("./routes/api");

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", apiRoutes);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Gemini Multimodal API is running!",
    version: "1.0.0",
    endpoints: {
      text: "POST /api/generate-text",
      image: "POST /api/generate-from-image",
      document: "POST /api/generate-from-document",
      audio: "POST /api/generate-from-audio",
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);

  // Multer error handling
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      error: "File too large. Maximum size is 20MB.",
    });
  }

  if (err.message.includes("File type")) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
    details: err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Gemini Multimodal API Server                        ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║                                                           ║
║   Available Endpoints:                                    ║
║   ├─ GET  /                  Health check                ║
║   ├─ POST /api/generate-text          Text generation    ║
║   ├─ POST /api/generate-from-image    Image analysis     ║
║   ├─ POST /api/generate-from-document Document analysis  ║
║   └─ POST /api/generate-from-audio    Audio processing   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
