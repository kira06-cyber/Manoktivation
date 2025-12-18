import { admin } from "../utils/firebase.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header) return res.status(401).json({ error: "No token provided" });
    if (!header.startsWith("Bearer ")) return res.status(401).json({ error: "Invalid token format" });

    const token = header.split(" ")[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    req.uid = decodedToken.uid;
    req.email = decodedToken.email;

    console.log("✅ User verified ->", req.email);
    next();
  } catch (err) {
    console.log("❌ Middleware Verification Failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
