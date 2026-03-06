import express from "express";
import { db } from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// --- 1. Ensure Uploads Folder Exists ---
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// --- 2. Multer Configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ================= GET ALL RECORDS (With Visibility Logic) ================= */
router.get("/", async (req, res) => {
  try {
    const userRole = req.cookies?.role || 'guest'; 
    let sql = "SELECT * FROM records";
    
    // 🔒 Visibility Logic
    if (userRole === 'guest') {
      sql += " WHERE accessLevel != 'Private (Staff Only)' AND status = 'active'";
    } else {
      sql += " WHERE status = 'active'"; 
    }

    sql += " ORDER BY id DESC";

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Fetch records error:", err);
    res.status(500).json({ message: "Server error while fetching records" });
  }
});

/* ================= GET SINGLE RECORD BY ID ================= */
// 💡 This fixes your 404 error!
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query("SELECT * FROM records WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Record not found" });
    }

    res.json(rows[0]); 
  } catch (err) {
    console.error("Fetch single record error:", err);
    res.status(500).json({ message: "Server error while fetching record details" });
  }
});

/* ================= POST NEW RECORD ================= */
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const recordData = { ...req.body };
    if (req.file) recordData.file_path = req.file.path;
    recordData.status = 'active';

    const columns = Object.keys(recordData);
    const values = Object.values(recordData);
    const placeholders = columns.map(() => "?").join(", ");

    const sql = `INSERT INTO records (${columns.join(", ")}) VALUES (${placeholders})`;
    const [result] = await db.query(sql, values);

    res.status(201).json({ id: result.insertId, message: "Record saved successfully" });
  } catch (err) {
    console.error("Database Insert Error:", err);
    res.status(500).json({ message: "Failed to save record" });
  }
});


/* ================= UPDATE RECORD WITH FILE SUPPORT ================= */
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // If a new file was uploaded, add the new path to the update object
    if (req.file) {
      updateData.file_path = req.file.path;
    }

    // Remove fields that shouldn't be updated manually
    delete updateData.id;

    const columns = Object.keys(updateData);
    const values = Object.values(updateData);

    if (columns.length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    const setClause = columns.map((col) => `${col} = ?`).join(", ");
    const sql = `UPDATE records SET ${setClause} WHERE id = ?`;

    await db.query(sql, [...values, id]);

    res.json({ 
      message: "Record updated successfully", 
      file_path: updateData.file_path // Send back the new path to update the UI
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update record" });
  }
});

/* ================= SOFT DELETE (TRASH) ================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Instead of deleting the row, we just mark it as 'trashed'
    const sql = "UPDATE records SET status = 'trashed' WHERE id = ?";
    await db.query(sql, [id]);

    res.json({ message: "Record moved to trash" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete record" });
  }
});

export default router;