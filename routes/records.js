const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/db'); 
import { logActivity } from './logs.routes.js';
const { verifyToken } = require('../middleware/auth'); 

// --- Configure Storage ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- 1. POST: Add a New Record ---
// --- FOR ADDING ---
router.post("/", verifyToken, async (req, res) => {
  try {
    const data = req.body;
    const [result] = await db.execute(sql, values);

    // ✅ Match these keys exactly to your logActivity function
    await logActivity({
      action: "ADD",
      recordId: result.insertId,
      title: data.title || "Untitled",
      user: req.user?.displayName || req.user?.username || "Librarian",
      role: req.user?.role || "Admin",
      description: `Added new record: "${data.title}"`
    });

    res.status(201).json({ message: "Success" });
  } catch (err) { /* ... */ }
});

// --- FOR UPDATING ---
router.patch("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    await logActivity({
      action: "UPDATE",
      recordId: id,
      title: data.title || "Updated Record",
      user: req.user?.displayName || req.user?.username || "Librarian",
      role: req.user?.role || "Admin",
      description: `Updated record details for ID: ${id}`
    });

    res.json({ message: "Updated" });
  } catch (err) { /* ... */ }
});

// --- FOR REMOVING ---
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch title BEFORE deleting so we don't log "Unknown"
    const [rows] = await db.query("SELECT title FROM records WHERE id = ?", [id]);
    const recordTitle = rows.length > 0 ? rows[0].title : "Unknown Record";

    await db.query("DELETE FROM records WHERE id = ?", [id]);

    await logActivity({
      action: "DELETE",
      recordId: id,
      title: recordTitle,
      user: req.user?.displayName || req.user?.username || "Librarian",
      role: req.user?.role || "Admin",
      description: `Permanently removed: "${recordTitle}"`
    });

    res.json({ message: "Deleted" });
  } catch (err) { /* ... */ }
});
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM records WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });

    // --- LOGGING ---
    const userName = req.user?.displayName || req.user?.username || "Librarian";
    
    await logActivity({
      action: 'VIEW',
      recordId: id,
      title: rows[0].title,
      user: userName,
      role: req.user?.role || "Librarian",
      description: `Accessed record details: "${rows[0].title}"`
    });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed" });
  }
});

module.exports = router;