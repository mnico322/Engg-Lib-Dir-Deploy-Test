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
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generates a unique filename: 17123456789-my-file.pdf
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

/* ================= GET ALL RECORDS ================= */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM records ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error("Fetch records error:", err);
    res.status(500).json({ message: "Server error while fetching records" });
  }
});

/* ================= POST NEW RECORD ================= */
// ✅ 'upload.single("file")' intercepts the file sent from the frontend
router.post("/", upload.single("file"), async (req, res) => {
  try {
    // req.body contains all text fields from FormData
    const recordData = { ...req.body };
    
    // Add the file path to the data object if a file was uploaded
    if (req.file) {
      recordData.file_path = req.file.path;
    }

    // 💡 Dynamic SQL Construction
    // This maps every key in recordData to a column in your MySQL table
    const columns = Object.keys(recordData);
    const values = Object.values(recordData);
    const placeholders = columns.map(() => "?").join(", ");

    const sql = `
      INSERT INTO records (${columns.join(", ")}) 
      VALUES (${placeholders})
    `;

    const [result] = await db.query(sql, values);

    // Return the new ID to the frontend for the logging system
    res.status(201).json({ 
      id: result.insertId, 
      message: "Record saved successfully" 
    });

  } catch (err) {
    console.error("Database Insert Error:", err);
    
    // Check if error is due to missing columns in DB
    if (err.code === 'ER_BAD_FIELD_ERROR') {
       return res.status(400).json({ 
         message: "Database column mismatch. Ensure your table has all the fields from your form." 
       });
    }

    res.status(500).json({ message: "Failed to save record to database" });
  }
});

export default router;