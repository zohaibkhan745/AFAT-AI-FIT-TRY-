import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import tryOnRoutes from "./routes/tryOnRoute.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://afat-ai-fit-try.vercel.app",
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // Allow all Vercel preview deployments
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static folder for uploads (optional)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/tryon", tryOnRoutes);
app.use("/auth", authRoutes);

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
