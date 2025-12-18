import express from "express";
import { admin } from "../utils/firebase.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create task
router.post("/", authMiddleware, async (req, res) => {
  try {
    const ref = await admin.firestore()
      .collection("users")
      .doc(req.uid)
      .collection("tasks")
      .add({
        ...req.body,
        completed: false,
        createdAt: new Date(),
      });

    res.status(201).json({ taskId: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all tasks
router.get("/", authMiddleware, async (req, res) => {
  try {
    const snap = await admin.firestore()
      .collection("users")
      .doc(req.uid)
      .collection("tasks")
      .get();

    const tasks = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    }));

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    await admin.firestore()
      .collection("users")
      .doc(req.uid)
      .collection("tasks")
      .doc(req.params.id)
      .update(req.body);

    res.json({ message: "Task updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await admin.firestore()
      .collection("users")
      .doc(req.uid)
      .collection("tasks")
      .doc(req.params.id)
      .delete();

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;