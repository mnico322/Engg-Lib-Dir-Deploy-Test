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

/**
 * HELPER: Get current user info from Cookies
 * This prevents users from sending fake roles in the request body.
 */
const getAuthUser = (req) => {
    return {
        email: req.cookies?.userEmail || "SYSTEM",
        role: req.cookies?.role || "guest"
    };
};

/* ================= 1. GET TRASHED RECORDS ================= */
router.get("/trashed", async (req, res) => {
    const { role } = getAuthUser(req);
    if (role !== 'admin' && role !== 'librarian') {
        return res.status(403).json({ message: "Access denied." });
    }
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

/* ================= 2. PERMANENT DELETE (SECURED) ================= */
router.delete("/:id/permanent", async (req, res) => {
    try {
        const { id } = req.params;
        const { email, role } = getAuthUser(req); // SERVER-SIDE CHECK

        if (role !== 'admin') {
            return res.status(403).json({ message: "Only Admins can permanently delete records." });
        }
        
        const [record] = await db.query("SELECT accession_no, title, file_path FROM records WHERE id = ?", [id]);
        if (record.length === 0) return res.status(404).json({ message: "Record not found" });

        if (record[0]?.file_path && fs.existsSync(record[0].file_path)) {
            fs.unlinkSync(record[0].file_path);
        }

        await db.query("DELETE FROM records WHERE id = ?", [id]);

        await logActivity({
            action: "DELETE",
            recordId: id,
            title: record[0].title,
            email: email, 
            role: role,
            description: `Permanently deleted Record with Accession No. ${record[0].accession_no}`
        });

        res.json({ message: "Record permanently deleted." });
    } catch (err) {
        console.error("Permanent delete error:", err);
        res.status(500).json({ message: "Failed to delete" });
    }
});

/* ================= 3. GET ALL ACTIVE RECORDS (SECURED) ================= */
router.get("/", async (req, res) => {
  try {
    const { role } = getAuthUser(req); // SERVER-SIDE CHECK
    
    let sql = "SELECT * FROM records WHERE status = 'active'";
    if (role !== 'admin' && role !== 'librarian') {
        sql += " AND accessLevel != 'Private (Staff Only)'";
    }

    sql += " ORDER BY box_number ASC, title ASC"; 

    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Fetch records error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= 4. POST NEW RECORD (SECURED) ================= */
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { email, role } = getAuthUser(req); // SERVER-SIDE CHECK
        const rawBody = req.body;

        if (role !== 'admin' && role !== 'librarian') {
            return res.status(403).json({ message: "Unauthorized to add records." });
        }

        const recordData = {
            accession_no: rawBody.accessionNo || rawBody.accession_no || rawBody["Accession #"],
            box_number: parseInt(rawBody.box_number) || 0,
            title: rawBody.title || "Untitled",
            place_of_publication: rawBody.place_of_publication,
            publisher: rawBody.publisher,
            date_of_publication: rawBody.date_of_publication,
            description_content: rawBody.description_content,
            content_type: rawBody.content_type,
            paper: rawBody.paper, 
            abstract: rawBody.abstract,
            keywords: rawBody.keywords,
            accessLevel: rawBody.accessLevel || 'Public',
            status: 'active',
            file_path: req.file ? req.file.path : null,
            encoded_by: email,
        };

        const columns = Object.keys(recordData);
        const values = Object.values(recordData);
        const placeholders = columns.map(() => "?").join(", ");

        const sql = `INSERT INTO records (${columns.map(c => `\`${c}\``).join(", ")}) VALUES (${placeholders})`;
        const [result] = await db.query(sql, values);

        await logActivity({
            action: "ADD",
            recordId: result.insertId,
            title: recordData.title,
            email: email,
            role: role,
            description: `Added new record '${recordData.title}'`
        });

        res.status(201).json({ id: result.insertId, message: "Record saved" });
    } catch (err) {
        console.error("Save error:", err);
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Duplicate Accession Number." });
        res.status(500).json({ message: "Failed to save record" });
    }
});

/* ================= 5. GET SINGLE RECORD ================= */
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = getAuthUser(req);
        const [rows] = await db.query("SELECT * FROM records WHERE id = ?", [id]);
        if (rows.length === 0) return res.status(404).json({ message: "Record not found" });

        // Security: Prevent guests from viewing Private records via direct URL
        if (role === 'guest' && rows[0].accessLevel === 'Private (Staff Only)') {
            return res.status(403).json({ message: "Access denied to private record." });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= 6. UPDATE RECORD (SECURED) ================= */
router.put("/:id", upload.single("file"), async (req, res) => {
    try {
        const { id } = req.params;
        const { email, role } = getAuthUser(req); // SERVER-SIDE CHECK
        const rawBody = req.body;

        if (role !== 'admin' && role !== 'librarian') {
            return res.status(403).json({ message: "Unauthorized to edit." });
        }

        const updateData = { ...rawBody, accession_no: rawBody.accessionNo || rawBody.accession_no };
        delete updateData.accessionNo;
        if (req.file) updateData.file_path = req.file.path;

        const [oldRecords] = await db.query("SELECT accession_no, title, status FROM records WHERE id = ?", [id]);
        if (oldRecords.length === 0) return res.status(404).json({ message: "Record not found" });

        const oldAccession = oldRecords[0].accession_no;
        const currentTitle = oldRecords[0].title;
        const oldStatus = oldRecords[0].status;

        const forbidden = ['userEmail', 'userRole', 'id', 'userName', 'date_encoded', 'updated_at'];
        const columns = Object.keys(updateData).filter(key => !forbidden.includes(key) && updateData[key] !== undefined);
        
        const values = columns.map(col => updateData[col]);
        const setClause = columns.map((col) => `\`${col}\` = ?`).join(", ");

        await db.query(`UPDATE records SET ${setClause} WHERE id = ?`, [...values, id]);

        const newAccession = updateData.accession_no || oldAccession;
        let finalAction = (updateData.status === 'active' && oldStatus !== 'active') ? "RESTORE" : "MODIFY";

        await logActivity({
            action: finalAction,
            recordId: id,
            title: updateData.title || currentTitle, 
            email: email,
            role: role,
            description: `Updated Record with Accession No. ${newAccession}`
        });

        res.json({ message: "Update successful" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ message: "Duplicate Accession Number." });
        res.status(500).json({ message: "Update failed" });
    }
});

/* ================= 7. DELETE (Move to Trash - SECURED) ================= */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { email, role } = getAuthUser(req); // SERVER-SIDE CHECK

        if (role !== 'admin' && role !== 'librarian') {
            return res.status(403).json({ message: "Unauthorized." });
        }

        const [record] = await db.query("SELECT accession_no, title FROM records WHERE id = ?", [id]);
        if (record.length === 0) return res.status(404).json({ message: "Record not found" });

        await db.query("UPDATE records SET status = 'trashed' WHERE id = ?", [id]);

        await logActivity({
            action: "TRASH",
            recordId: id,
            title: record[0].title,
            email: email,
            role: role,
            description: `Moved Record ${record[0].accession_no} to trash`
        });

        res.json({ message: "Moved to trash" });
    } catch (err) {
        res.status(500).json({ message: "Delete failed" });
    } 
});

export default router;