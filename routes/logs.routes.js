import express from "express";
import { db } from "../db.js";

const router = express.Router();

/* ================= 1. SAVE ACTIVITY LOG (POST) ================= */
router.post("/", async (req, res) => {
  try {
    const { 
      action, 
      recordId, 
      title, 
      accessCode, 
      locationCode, 
      user, 
      role, 
      description 
    } = req.body;

    const query = `
      INSERT INTO activity_logs 
      (action, recordId, title, accessCode, locationCode, user, role, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      action,
      recordId || null,
      title || null,
      accessCode || null,
      locationCode || null,
      user || "unknown",
      role || "guest",
      description || `User ${action}ed a record`
    ]);

    res.status(201).json({ success: true, message: "Log saved" });
  } catch (err) {
    console.error("Error saving log:", err);
    res.status(500).json({ success: false, error: "Failed to save activity log" });
  }
});

/* ================= 2. FETCH ALL LOGS (GET) ================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM activity_logs ORDER BY id DESC"); 
    res.json(rows);
  } catch (err) {
    console.error("Fetch logs error:", err);
    res.status(500).json({ success: false, error: "Failed to fetch logs" });
  }
});

export default router;