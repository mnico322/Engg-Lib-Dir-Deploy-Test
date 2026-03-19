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

/* ================= 1. GET TRASHED RECORDS (Must be above /:id) ================= */
router.get("/trashed", async (req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM records WHERE status = 'trashed' ORDER BY updated_at DESC"
        );
        // Your frontend expects an array, so we send the rows directly
        res.json(rows);
    } catch (err) {
        console.error("Fetch trashed error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= 2. PERMANENT DELETE (Must be above /:id) ================= */
// router.delete("/:id/permanent", async (req, res) => {
//     try {
//         const { id } = req.params;
        
//         // Optional: Find the file path first to delete the actual file from disk
//         const [record] = await db.query("SELECT file_path FROM records WHERE id = ?", [id]);
//         if (record[0]?.file_path && fs.existsSync(record[0].file_path)) {
//             fs.unlinkSync(record[0].file_path);
//         }

//         await db.query("DELETE FROM records WHERE id = ?", [id]);
//         res.json({ message: "Record permanently deleted from database and storage." });
//     } catch (err) {
//         console.error("Permanent delete error:", err);
//         res.status(500).json({ message: "Failed to delete" });
//     }
// });

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
    console.error("Fetch records error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= 4. POST NEW RECORD ================= */
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

/* ================= 5. GET SINGLE RECORD ================= */
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

/* ================= 6. DELETE (Move to Trash) ================= */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        // In a DELETE request, data is often in the headers or query, 
        // but if you're sending a body, ensure it's handled.
        const { userEmail, userRole } = req.body || {}; 

        // 1. Check if record exists
        const [rows] = await db.query("SELECT title FROM records WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Record not found" });

        // 2. Explicitly set status to 'trashed'
        const [result] = await db.query(
            "UPDATE records SET status = 'trashed' WHERE id = ?", 
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to update record status" });
        }

        // 3. Log the activity
        await logActivity({
            email: userEmail || "mercadonicolai322@gmail.com",
            action: "DELETE",
            recordId: id,
            title: rows[0].title,
            role: userRole || "Librarian",
            description: `Moved record '${rows[0].title}' to trash.`
        });

        res.json({ message: "Record moved to trash successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ message: "Delete failed" });
    }
});

/* ================= 7. UPDATE RECORD ================= */
router.put("/:id", upload.single("file"), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If a file was uploaded, add it to the update object
        if (req.file) updateData.file_path = req.file.path;

        // Remove non-database fields
        const forbidden = ['userEmail', 'userRole', 'id'];
        const columns = Object.keys(updateData).filter(key => !forbidden.includes(key));
        
        if (columns.length === 0) return res.status(400).json({ message: "No data provided for update" });

        const values = columns.map(col => updateData[col]);
        const setClause = columns.map((col) => `\`${col}\` = ?`).join(", ");

        const [result] = await db.query(
            `UPDATE records SET ${setClause} WHERE id = ?`, 
            [...values, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Record not found or no changes made" });
        }

        res.json({ message: "Update successful" });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ message: "Update failed" });
    }
});

export default router;