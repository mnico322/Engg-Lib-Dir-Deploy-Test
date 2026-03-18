import express from "express";
import { db } from "../db.js";
import { logActivity } from "../backend/utils/logger.js";
import multer from "multer";
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

/* ================= 1. POST NEW RECORD (MAPPED TO SQL) ================= */
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { userName, userRole, ...rawBody } = req.body;

        // --- MAP FRONTEND KEYS TO SQL COLUMN NAMES ---
        // This ensures keys like "Box Number " become "box_number"
        const recordData = {
            box_number: parseInt(rawBody["Box Number "] || rawBody.box_number) || 0,
            title: rawBody["Title "] || rawBody.title || "Untitled",
            place_of_publication: rawBody["Place of Publication "] || rawBody.place_of_publication,
            publisher: rawBody["Publisher "] || rawBody.publisher,
            date_of_publication: rawBody["Date of Publication"] || rawBody.date_of_publication,
            description_content: rawBody["Description/Content "] || rawBody.description_content,
            content_type: rawBody["Type"] || rawBody.content_type,
            paper_title: rawBody["Paper"] || rawBody.paper_title,
            paper_abstract: rawBody["Abstract"] || rawBody.paper_abstract,
            keywords: rawBody["Keywords"] || rawBody.keywords,
            accessLevel: rawBody.accessLevel || 'Public',
            status: 'active',
            file_path: req.file ? req.file.path : null
        };

        const columns = Object.keys(recordData);
        const values = Object.values(recordData);
        const placeholders = columns.map(() => "?").join(", ");

        const sql = `INSERT INTO records (${columns.join(", ")}) VALUES (${placeholders})`;
        const [result] = await db.query(sql, values);

        await logActivity({
            action: "ADD",
            recordId: result.insertId,
            title: recordData.title,
            user: userName || "System",
            role: userRole || "guest",
            description: `New record "${recordData.title}" created.`
        });

        res.status(201).json({ id: result.insertId, message: "Record saved" });
    } catch (err) {
        console.error("Insert Error:", err);
        res.status(500).json({ message: "Failed to save record" });
    }
});

/* ================= 2. UPDATE RECORD (MAPPED TO SQL) ================= */
router.put("/:id", upload.single("file"), async (req, res) => {
    try {
        const { id } = req.params;
        const rawBody = req.body;

        // --- MAP UPDATED FIELDS ---
        const updateData = {};
        if (rawBody["Box Number "] || rawBody.box_number) updateData.box_number = parseInt(rawBody["Box Number "] || rawBody.box_number);
        if (rawBody["Title "] || rawBody.title) updateData.title = rawBody["Title "] || rawBody.title;
        if (rawBody["Place of Publication "]) updateData.place_of_publication = rawBody["Place of Publication "];
        if (rawBody["Abstract"]) updateData.paper_abstract = rawBody["Abstract"];
        // ... add other fields as needed ...

        if (req.file) updateData.file_path = req.file.path;

        const columns = Object.keys(updateData);
        const values = Object.values(updateData);

        if (columns.length === 0) return res.status(400).json({ message: "No changes detected" });

        const setClause = columns.map((col) => `\`${col}\` = ?`).join(", ");
        await db.query(`UPDATE records SET ${setClause} WHERE id = ?`, [...values, id]);

        res.json({ message: "Update successful" });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Update failed" });
    }
});

/* ================= GET ALL RECORDS ================= */
router.get("/", async (req, res) => {
  try {
    const userRole = req.cookies?.role || 'guest'; 
    let sql = "SELECT * FROM records WHERE status = 'active'";
    
    if (userRole === 'guest') {
      sql += " AND accessLevel != 'Private (Staff Only)'";
    }

    // 🔹 Sort by box_number first, then by title
    sql += " ORDER BY box_number ASC, title ASC"; 

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Fetch records error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET TRASHED RECORDS ================= */
router.get("/trashed", async (req, res) => {
  try {
    // 🔹 Sort trash by box number as well
    const [rows] = await db.query(
      "SELECT * FROM records WHERE status = 'trashed' ORDER BY box_number ASC"
    );
    res.json({ records: rows });
  } catch (err) {
    console.error("Fetch trash error:", err);
    res.status(500).json({ message: "Error fetching trash" });
  }
});

export default router;