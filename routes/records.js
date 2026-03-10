const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/db'); 
const { logActivity } = require('../utils/logger'); 
const { verifyToken } = require('../middleware/auth'); 

// --- Configure Storage ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- 1. POST: Add a New Record ---
router.post('/', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const data = req.body;
    const file = req.file;

    const recordData = {
      community: data.community,
      collection: data.collection || null,
      subCollection: data.subCollection || null,
      subSubCollection: data.subSubCollection || null,
      file_path: file ? file.path : null,
      accessLevel: data.accessLevel || 'Private (Staff Only)',
      status: 'active'
    };

    const excluded = ['community', 'collection', 'subCollection', 'subSubCollection', 'accessLevel'];
    Object.keys(data).forEach(key => {
      if (!excluded.includes(key)) {
        recordData[key] = data[key];
      }
    });

    const columns = Object.keys(recordData).join(', ');
    const placeholders = Object.keys(recordData).map(() => '?').join(', ');
    const values = Object.values(recordData);

    const sql = `INSERT INTO records (${columns}) VALUES (${placeholders})`;
    const [result] = await db.execute(sql, values);

    // LOGGING
    const userDisplayName = req.body.author || "System"; // Or get from session
    const recordTitle = req.body.title || "Untitled";

    // Call your logger properly
    await logActivity(
      userDisplayName,   // Pass the STRING name
      "ADD",             // Action
      result.insertId,   // The new ID
      recordTitle,       // Title
      `New record added to ${req.body.community}` // Description
    );

    res.status(201).json({ message: "Record added successfully", id: result.insertId });
  } catch (err) {
    console.error("Add Error:", err);
    res.status(500).json({ error: "Failed to save record" });
  }
});

// --- 2. PATCH: Update an Existing Record ---
router.patch('/:id', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const file = req.file;

    // Fetch old title for the log
    const [existing] = await db.execute("SELECT title FROM records WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ error: "Record not found" });

    const updateData = { ...data };
    if (file) updateData.file_path = file.path;
    delete updateData.id; 

    // Dynamic SQL generation
    const setClause = Object.keys(updateData).map(key => `\`${key}\` = ?`).join(', ');
    const values = [...Object.values(updateData), id];

    const sql = `UPDATE records SET ${setClause} WHERE id = ?`;
    await db.execute(sql, values);

    // LOGGING
    const userName = req.user?.displayName || req.user?.username || "Librarian";
    const userId = req.user?.id || 0;
    const newTitle = data.title || existing[0].title;

    await logActivity(
      userId,
      userName,
      'UPDATE',
      `Updated record: "${newTitle}" (ID: ${id}). Modified: ${Object.keys(updateData).join(', ')}`
    );

    res.json({ message: "Record updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update record" });
  }
});

// --- 3. DELETE: Remove a Record ---
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch info before it's gone
    const [record] = await db.execute("SELECT title, community FROM records WHERE id = ?", [id]);
    if (record.length === 0) return res.status(404).json({ error: "Record not found" });

    const recordTitle = record[0].title || "Untitled";

    await db.execute("DELETE FROM records WHERE id = ?", [id]);

    // LOGGING
    const userName = req.user?.displayName || req.user?.username || "Librarian";
    const userId = req.user?.id || 0;

    await logActivity(
      userId,
      userName,
      'DELETE',
      `Deleted record: "${recordTitle}" (ID: ${id})`
    );

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

module.exports = router;