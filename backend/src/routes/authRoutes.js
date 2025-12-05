import express from "express";
import {
  signUpWithEmail,
  signInWithEmail,
  googleSignIn,
  getCurrentUser,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

// Public Routes
router.post("/signup", signUpWithEmail);
router.post("/signin", signInWithEmail);
router.post("/google", googleSignIn);

// Protected Routes
router.get("/me", verifyToken, getCurrentUser);

export default router;
