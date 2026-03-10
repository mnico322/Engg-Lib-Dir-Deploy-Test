import express from "express";
import { db } from "../db.js";
import multer from "multer";
import path from "path";
import fs from "fs"; // Only one import needed at the top

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

/* ================= 1. TRASHED RECORDS (SPECIFIC ROUTE) ================= */
// 💡 ALWAYS put specific strings like "/trashed" ABOVE dynamic routes like "/:id"
router.get("/trashed", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM records WHERE status = 'trashed' ORDER BY id DESC"
    );
    res.json({ records: rows });
  } catch (err) {
    console.error("Fetch trash error:", err);
    res.status(500).json({ message: "Error fetching trash" });
  }
});

/* ================= 2. PERMANENT DELETE (SPECIFIC ROUTE) ================= */
router.delete("/:id/permanent", async (req, res) => {
  try {
    const { id } = req.params;

    // Get file path before deleting record
    const [record] = await db.query("SELECT file_path FROM records WHERE id = ?", [id]);
    
    if (record.length > 0 && record[0].file_path) {
      if (fs.existsSync(record[0].file_path)) {
        fs.unlinkSync(record[0].file_path);
      }
    }

    await db.query("DELETE FROM records WHERE id = ?", [id]);
    res.json({ message: "Record and file permanently purged" });
  } catch (err) {
    console.error("Purge error:", err);
    res.status(500).json({ message: "Failed to purge record" });
  }
});

/* ================= 3. GET ALL RECORDS (ACTIVE ONLY) ================= */
router.get("/", async (req, res) => {
  try {
    const userRole = req.cookies?.role || 'guest'; 
    let sql = "SELECT * FROM records";
    
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

/* ================= 4. GET SINGLE RECORD BY ID ================= */
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

/* ================= 5. POST NEW RECORD ================= */
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

/* ================= 6. UPDATE RECORD ================= */
router.put("/:id", upload.single("file"), async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (req.file) updateData.file_path = req.file.path;
    delete updateData.id;

    const columns = Object.keys(updateData);
    const values = Object.values(updateData);

    if (columns.length === 0) {
      return res.status(400).json({ message: "No data provided" });
    }

    const setClause = columns.map((col) => `\`${col}\` = ?`).join(", ");
    const sql = `UPDATE records SET ${setClause} WHERE id = ?`;

    await db.query(sql, [...values, id]);
    res.json({ message: "Record updated successfully" });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update record" });
  }
});

/* ================= 7. SOFT DELETE (TRASH) ================= */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const sql = "UPDATE records SET status = 'trashed' WHERE id = ?";
    await db.query(sql, [id]);
    res.json({ message: "Record moved to trash" });
  } catch (err) {
    console.error("Soft delete error:", err);
    res.status(500).json({ message: "Failed to trash record" });
  }
});

export default router;