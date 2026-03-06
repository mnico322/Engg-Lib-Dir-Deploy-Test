const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../config/db'); // Path to your DB connection

// Configure where to save uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST: Add a New Record
router.post('/', upload.single('file'), (req, res) => {
  const data = req.body;
  const file = req.file;

  // 1. Prepare the Core Object
  const recordData = {
    community: data.community,
    collection: data.collection || null,
    subCollection: data.subCollection || null,
    subSubCollection: data.subSubCollection || null,
    file_path: file ? file.path : null,
    accessLevel: data.accessLevel || 'Private (Staff Only)',
    status: 'active'
  };

  // 2. Automatically map all other fields (title, boxNo, etc.)
  // This loop ensures whatever you add to fieldConfig.js gets saved
  Object.keys(data).forEach(key => {
    const excluded = ['community', 'collection', 'subCollection', 'subSubCollection', 'accessLevel'];
    if (!excluded.includes(key)) {
      recordData[key] = data[key];
    }
  });

  // 3. Generate Dynamic SQL
  const columns = Object.keys(recordData).join(', ');
  const placeholders = Object.keys(recordData).map(() => '?').join(', ');
  const values = Object.values(recordData);

  const sql = `INSERT INTO records (${columns}) VALUES (${placeholders})`;

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("MySQL Error:", err);
      return res.status(500).json({ error: "Failed to save record" });
    }
    res.status(201).json({ message: "Record added successfully", id: result.insertId });
  });
});

module.exports = router;