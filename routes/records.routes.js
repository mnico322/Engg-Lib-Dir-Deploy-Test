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
router.delete("/:id/permanent", async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail, userRole } = req.body; 
        
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
            email: userEmail || "SYSTEM", 
            role: userRole || "admin",
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
    // SECURITY: Use the role from cookies to determine visibility
    const userRole = req.cookies?.role || 'guest'; 
    
    let sql = "SELECT * FROM records WHERE status = 'active'";
    
    // If not an admin/librarian, hide private records at the database level
    if (userRole !== 'admin' && userRole !== 'librarian') {
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

/* ================= 4. POST NEW RECORD ================= */
router.post("/", upload.single("file"), async (req, res) => {
    try {
        const { userEmail, userRole, ...rawBody } = req.body;

        const recordData = {
            accession_no: rawBody.accessionNo || rawBody.accession_no || rawBody["Accession #"],
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

        await logActivity({
            action: "ADD",
            recordId: result.insertId,
            title: recordData.title,
            email: userEmail,
            role: userRole,
            description: `Added new record '${recordData.title}'`
        });

        res.status(201).json({ id: result.insertId, message: "Record saved" });
    } catch (err) {
        console.error("Save error:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                message: "This Accession Number is already in use. Please use a unique number." 
            });
        }
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
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= 6. UPDATE RECORD (Edit) ================= */
router.put("/:id", upload.single("file"), async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail, userRole, ...rawBody } = req.body;

        const updateData = {
            ...rawBody,
            accession_no: rawBody.accessionNo || rawBody.accession_no,
        };

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
        let finalAction = "MODIFY";
        let logDescription = `Updated metadata for Record with Accession No. ${newAccession}`;

        if (updateData.status === 'active' && oldStatus !== 'active') {
            finalAction = "RESTORE";
            logDescription = `Restored Record with Accession No. ${newAccession} from the trash`;
        } 
        else if (updateData.accession_no && updateData.accession_no !== oldAccession) {
            logDescription += ` (Changed from '${oldAccession}' to '${newAccession}')`;
        }

        await logActivity({
            action: finalAction,
            recordId: id,
            title: updateData.title || currentTitle, 
            email: userEmail,
            role: userRole,
            description: logDescription
        });

        res.json({ message: "Update successful" });
    } catch (err) {
        console.error("Update error:", err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ 
                message: "This Accession Number is already in use by another record. Please use a unique number." 
            });
        }
        res.status(500).json({ message: "Update failed" });
    }
});

/* ================= 7. DELETE (Move to Trash) ================= */
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { userEmail, userRole } = req.body;

        const [record] = await db.query("SELECT accession_no, title FROM records WHERE id = ?", [id]);
        if (record.length === 0) return res.status(404).json({ message: "Record not found" });

        const accNo = record[0].accession_no;
        const title = record[0].title;

        await db.query("UPDATE records SET status = 'trashed' WHERE id = ?", [id]);

        await logActivity({
            action: "TRASH",
            recordId: id,
            title: title,
            email: userEmail,
            role: userRole,
            description: `Moved Record with Accession No. ${accNo} to trash`
        });

        res.json({ message: "Moved to trash" });
    } catch (err) {
        console.error("Trash error:", err);
        res.status(500).json({ message: "Delete failed" });
    } 
});

export default router;