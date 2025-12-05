require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const tryOnRoutes = require("./routes/tryOnRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static folder for uploads (optional, if we want to serve uploaded files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/tryon", tryOnRoutes);

// Health Check
app.get("/", (req, res) => {
  res.json({ message: "AI Fit & Try Backend is running" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
