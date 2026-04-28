import express from "express";
import { db } from "../db.js"; 

const router = express.Router();

router.get("/stats", async (req, res) => {
  try {
    // SECURITY CHECK: Use the secure cookie we created in the Auth fix
    const userRole = req.cookies?.role;

    // BLOCK anyone who isn't an admin
    // Even if a Librarian tries to call this API directly, the server will stop them here.
    if (userRole !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admin privileges required." });
    }

    // 1. Total Active Records
    const [activeRows] = await db.query("SELECT COUNT(*) as total FROM records WHERE status = 'active'");
    
    // 2. Total Users
    const [userRows] = await db.query("SELECT COUNT(*) as total FROM users");

    // 3. Items in Trash
    const [trashRows] = await db.query("SELECT COUNT(*) as total FROM records WHERE status = 'trashed'");

    console.log("Admin stats requested by authorized user:", { 
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