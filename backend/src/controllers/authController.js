import { clientAuth, db, adminAuth } from "../config/firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export const signUpWithEmail = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const userCredential = await createUserWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();

    // Store user profile in Firestore
    await db.collection("users").doc(user.uid).set({
      fullName,
      email,
      uid: user.uid,
      createdAt: new Date().toISOString(),
      provider: "password",
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        uid: user.uid,
        token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const signInWithEmail = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userCredential = await signInWithEmailAndPassword(
      clientAuth,
      email,
      password
    );
    const user = userCredential.user;
    const token = await user.getIdToken();

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        uid: user.uid,
        token,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid email or password",
      error: error.message,
    });
  }
};

export const googleSignIn = async (req, res) => {
  const { idToken } = req.body;

  try {
    console.log("Verifying ID Token...");
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log("Token verified successfully for UID:", decodedToken.uid);
    const { uid, email, name, picture } = decodedToken;

    // Check if user exists in Firestore
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      await db
        .collection("users")
        .doc(uid)
        .set({
          fullName: name || "Google User",
          email,
          uid,
          photoURL: picture,
          createdAt: new Date().toISOString(),
          provider: "google",
        });
    }

    res.status(200).json({
      success: true,
      message: "Google sign in verified",
      data: {
        uid,
        token: idToken,
      },
    });
  } catch (error) {
    console.error("Error verifying Google ID token:", error);
    res.status(401).json({
      success: false,
      message: "Invalid Google token",
      error: error.message,
      code: error.code,
    });
  }
};

export const getCurrentUser = async (req, res) => {
  const { uid } = req.user; // From verifyToken middleware

  try {
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: "User profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: userDoc.data(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};
