import express from "express";
import { db } from "../db.js";
import { logActivity } from "../backend/utils/logger.js";
import multer from "multer";
import fs from "fs";

const router = express.Router();

const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ================= 1. GET TRASHED RECORDS ================= */
// Keep this ABOVE /:id
router.get("/trashed", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM records WHERE status = 'trashed' ORDER BY updated_at DESC"
        );
        res.json(rows);
    } catch (err) {
        console.error("Fetch trashed error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= 2. PERMANENT DELETE ================= */
// UNCOMMENTED AND MOVED ABOVE /:id
router.delete("/:id/permanent", async (req, res) => {
    try {
        const { id } = req.params;
        
        const [record] = await db.query("SELECT file_path FROM records WHERE id = ?", [id]);
        
        // Delete physical file
        if (record[0]?.file_path && fs.existsSync(record[0].file_path)) {
            fs.unlinkSync(record[0].file_path);
        }

        await db.query("DELETE FROM records WHERE id = ?", [id]);
        res.json({ message: "Record permanently deleted." });
    } catch (err) {
        console.error("Permanent delete error:", err);
        res.status(500).json({ message: "Failed to delete" });
    }
});

/* ================= 3. GET ALL ACTIVE RECORDS ================= */
router.get("/", async (req, res) => {
  try {
    const userRole = req.cookies?.role || 'guest'; 
    let sql = "SELECT * FROM records WHERE status = 'active'";
    if (userRole === 'guest') sql += " AND accessLevel != 'Private (Staff Only)'";
    sql += " ORDER BY box_number ASC, title ASC"; 

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= 4. POST NEW RECORD ================= */
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { userEmail, userRole, ...rawBody } = req.body;

        const recordData = {
            accession_no: rawBody.accession_no || rawBody["Accession #"],
            box_number: parseInt(rawBody.box_number || rawBody["Box Number "]) || 0,
            title: rawBody.title || rawBody["Title "] || "Untitled",
            place_of_publication: rawBody.place_of_publication || rawBody["Place of Publication "],
            publisher: rawBody.publisher || rawBody["Publisher "],
            date_of_publication: rawBody.date_of_publication || rawBody["Date of Publication"],
            description_content: rawBody.description_content || rawBody["Description/Content "],
            content_type: rawBody.content_type || rawBody["Type"],
            paper: rawBody.paper || rawBody["Paper"], 
            abstract: rawBody.abstract || rawBody["Abstract"],
            keywords: rawBody.keywords || rawBody["Keywords"],
            accessLevel: rawBody.accessLevel || 'Public',
            status: 'active',
            file_path: req.file ? req.file.path : null,
            encoded_by: userEmail || "SYSTEM",
        };

        const columns = Object.keys(recordData);
        const values = Object.values(recordData);
        const placeholders = columns.map(() => "?").join(", ");

        const sql = `INSERT INTO records (${columns.map(c => `\`${c}\``).join(", ")}) VALUES (${placeholders})`;
        const [result] = await db.query(sql, values);

        res.status(201).json({ id: result.insertId, message: "Record saved" });
    } catch (err) {
        res.status(500).json({ message: "Failed to save record" });
    }
});

/* ================= 5. GET SINGLE RECORD ================= */
// Place generic :id routes at the bottom
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM records WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Record not found" });
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= 6. UPDATE RECORD (Edit) ================= */
router.put("/:id", upload.single("file"), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        if (req.file) updateData.file_path = req.file.path;

        // Clean the data so we don't try to insert metadata into the SQL query
        const forbidden = ['userEmail', 'userRole', 'id', 'userName'];
        const columns = Object.keys(updateData).filter(key => !forbidden.includes(key));
        
        if (columns.length === 0) return res.status(400).json({ message: "No valid fields provided" });

        const values = columns.map(col => updateData[col]);
        const setClause = columns.map((col) => `\`${col}\` = ?`).join(", ");

        // Add the ID to the end of the values array for the WHERE clause
        const [result] = await db.query(
            `UPDATE records SET ${setClause} WHERE id = ?`, 
            [...values, id]
        );

        res.json({ message: "Update successful" });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Update failed" });
    }
});

/* ================= 7. DELETE (Move to Trash) ================= */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("UPDATE records SET status = 'trashed' WHERE id = ?", [id]);
        res.json({ message: "Moved to trash" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    }
});

export default router;