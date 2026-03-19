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

/* ================= 1. POST NEW RECORD ================= */
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { userEmail, userRole, ...rawBody } = req.body;

        const recordData = {
            accession_no: rawBody["Accession #"] || rawBody.accession_no,
            box_number: parseInt(rawBody["Box Number "] || rawBody.box_number) || 0,
            title: rawBody["Title "] || rawBody.title || "Untitled",
            place_of_publication: rawBody["Place of Publication "] || rawBody.place_of_publication,
            publisher: rawBody["Publisher "] || rawBody.publisher,
            date_of_publication: rawBody["Date of Publication"] || rawBody.date_of_publication,
            description_content: rawBody["Description/Content "] || rawBody.description_content,
            content_type: rawBody["Type"] || rawBody.content_type,
            paper: rawBody["Paper"] || rawBody.paper, 
            abstract: rawBody["Abstract"] || rawBody.abstract,
            keywords: rawBody["Keywords"] || rawBody.keywords,
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

        await logActivity({
            email: userEmail || "mercadonicolai322@gmail.com",
            action: "ADD",
            recordId: result.insertId,
            title: recordData.title,
            role: userRole || "Librarian",
            description: `New record '${recordData.title}' added.`
        });

        res.status(201).json({ id: result.insertId, message: "Record saved" });
    } catch (err) {
        console.error("Insert Error:", err);
        res.status(500).json({ message: "Failed to save record" });
    }
});

/* ================= 2. GET SINGLE RECORD (NEW - Needed for View) ================= */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query("SELECT * FROM records WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Record not found" });
        res.json(rows[0]);
    } catch (err) {
        console.error("Fetch single record error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= 3. DELETE (NEW - Move to Trash) ================= */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail, userRole } = req.body;

        const [record] = await db.query("SELECT title FROM records WHERE id = ?", [id]);
        if (record.length === 0) return res.status(404).json({ message: "Not found" });

        await db.query("UPDATE records SET status = 'trashed' WHERE id = ?", [id]);

        await logActivity({
            email: userEmail || "mercadonicolai322@gmail.com",
            action: "DELETE",
            recordId: id,
            title: record[0].title,
            role: userRole || "Librarian",
            description: `Moved record '${record[0].title}' to trash.`
        });

        res.json({ message: "Record moved to trash" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "Delete failed" });
    }
});

/* ================= 4. GET ALL RECORDS ================= */
router.get("/", async (req, res) => {
  try {
    const userRole = req.cookies?.role || 'guest'; 
    let sql = "SELECT * FROM records WHERE status = 'active'";
    if (userRole === 'guest') sql += " AND accessLevel != 'Private (Staff Only)'";
    sql += " ORDER BY box_number ASC, title ASC"; 

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Fetch records error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= 5. UPDATE RECORD ================= */
router.put("/:id", upload.single("file"), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        if (req.file) updateData.file_path = req.file.path;

        const columns = Object.keys(updateData).filter(key => !['userEmail', 'userRole'].includes(key));
        const values = columns.map(col => updateData[col]);

        if (columns.length === 0) return res.status(400).json({ message: "No changes" });

        const setClause = columns.map((col) => `\`${col}\` = ?`).join(", ");
        await db.query(`UPDATE records SET ${setClause} WHERE id = ?`, [...values, id]);

        res.json({ message: "Update successful" });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Update failed" });
    }
});

export default router;