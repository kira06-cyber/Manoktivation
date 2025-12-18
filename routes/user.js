import express from "express";
import { admin } from "../utils/firebase.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
// Get current user
router.get("/", authMiddleware, async (req, res) => {
  console.log("➡️ Route: Starting to fetch user data from Firestore..."); // NEW LOG
  try {
    const doc = await admin.firestore()
      .collection("users")
      .doc(req.uid)
      .get();

    console.log("⬅️ Route: Firestore fetch complete. Exists?", doc.exists); // NEW LOG

    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(doc.data());
  } catch (err) {
    console.error("❌ Route Error:", err.message); // NEW LOG
    res.status(500).json({ error: err.message });
  }
});
// Create or update profile
router.post("/", authMiddleware, async (req, res) => {
  console.log("➡️ Route: Updating user profile for:", req.email); // LOG
  console.log("📦 Data received:", req.body); // LOG

  try {
    await admin.firestore()
      .collection("users")
      .doc(req.uid)
      .set(
        { ...req.body, updatedAt: new Date() },
        { merge: true }
      );

    console.log("✅ Route: Profile saved successfully."); // LOG
    res.json({ message: "Profile saved" });
  } catch (err) {
    console.error("❌ Route Error:", err.message); // LOG
    res.status(500).json({ error: err.message });
  }
});

router.post("/add-user", authMiddleware, async (req, res) => {
  const { displayName } = req.body;

  await admin.firestore().collection("users").doc(req.uid).set({
    displayName,
    email: req.email,
    createdAt: new Date(),
  });

  res.json({ message: "User profile created" });
});

export default router;