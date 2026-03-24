import express from "express";
import { db } from "../db.js"; 

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    // 1. Total Active Records (using the 'status' column we found)
    const [activeRows] = await db.query("SELECT COUNT(*) as total FROM records WHERE status = 'active'");
    
    // 2. Total Users
    const [userRows] = await db.query("SELECT COUNT(*) as total FROM users");

    // 3. Items in Trash (using the 'status' column)
    const [trashRows] = await db.query("SELECT COUNT(*) as total FROM records WHERE status = 'trashed'");

    console.log("Stats update successful:", { 
      active: activeRows[0].total, 
      users: userRows[0].total, 
      trash: trashRows[0].total 
    });

    res.json({
      totalRecords: activeRows[0].total || 0,
      totalUsers: userRows[0].total || 0,
      totalTrash: trashRows[0].total || 0
    });
  } catch (err) {
    console.error("Admin Stats Route Error:", err);
    res.status(500).json({ message: "Error fetching system stats" });
  }
});

export default router;