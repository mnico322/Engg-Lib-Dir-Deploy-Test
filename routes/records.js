const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/db'); 
const { logActivity } = require('../backend/utils/logger'); 

// --- Configure Storage ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- 1. POST: Add a New Record ---
router.post('/', upload.single('file'), async (req, res) => {
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
    await logActivity({
      user: req.body.author || "System",
      action: "ADD",
      recordId: result.insertId,
      title: req.body.title || "Untitled",
      description: `New record added to ${req.body.community}`
    });

    res.status(201).json({ message: "Record added successfully", id: result.insertId });
  } catch (err) {
    console.error("Add Error:", err);
    res.status(500).json({ error: "Failed to save record" });
  }
});

// --- 2. PATCH: Update an Existing Record ---
router.patch('/:id', upload.single('file'), async (req, res) => {
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

    await logActivity({
      user: req.user?.displayName || "Librarian",
      action: 'UPDATE',
      recordId: id,
      title: data.title || existing[0].title,
      description: `Updated record: "${data.title || existing[0].title}" (ID: ${id})`
    });

    res.json({ message: "Record updated successfully" });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update record" });
  }
});

// --- 3. DELETE: Remove a Record ---
// router.delete('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const [record] = await db.execute("SELECT title FROM records WHERE id = ?", [id]);
    
//     if (record.length === 0) return res.status(404).json({ error: "Not found" });

//     await db.execute("DELETE FROM records WHERE id = ?", [id]);

//     // ✅ FIX: Use the Librarian's name from req.user
//     console.log("LOGGING REQ BODY:", req.body);
//     await logActivity({
//       user: req.body.user || "Libryan", 
//       action: "DELETE",
//       recordId: id,
//       title: record[0].title,
//       description: `Deleted record ID: ${id}`
//     });

//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Delete failed" });
//   }
// }); 
module.exports = router;