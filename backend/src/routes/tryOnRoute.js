import express from "express";
import multer from "multer";
import path from "path";
import { generateTryOn } from "../controllers/tryOnController.js";

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory to easily convert to base64

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Error: Images Only!"));
  },
});

// Define the route
router.post(
  "/",
  upload.fields([
    { name: "userPhoto", maxCount: 1 },
    { name: "outfitPhoto", maxCount: 1 },
  ]),
  generateTryOn
);

export default router;
