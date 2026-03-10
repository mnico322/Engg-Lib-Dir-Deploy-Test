import express from "express";
import { db } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { searchTerm, filterRole } = req.query;

    // Use displayName to match your table
    let sql = "SELECT `id`, `email`, `displayName`, `role`, `approved` FROM `users` WHERE 1=1";
    const params = [];

    if (searchTerm && searchTerm.trim() !== "") {
      // Use displayName here too!
      sql += " AND (`email` LIKE ? OR `displayName` LIKE ?)";
      const searchVal = `%${searchTerm}%`;
      params.push(searchVal, searchVal);
    }

    if (filterRole && filterRole !== "") {
      sql += " AND `role` = ?";
      params.push(filterRole);
    }

    sql += " ORDER BY `id` DESC";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("❌ DATABASE ERROR:", err.message); 
    res.status(500).json({ error: err.message });
  }
});

// 2. Approve a user
router.patch("/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("UPDATE `users` SET `approved` = 1 WHERE `id` = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User approved successfully" });
  } catch (err) {
    console.error("Approve Error:", err);
    res.status(500).json({ message: "Failed to approve user" });
  }
});

// 3. Update Role
router.patch("/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role) return res.status(400).json({ message: "Role is required" });

    await db.query("UPDATE `users` SET `role` = ? WHERE `id` = ?", [role, id]);
    res.json({ message: "Role updated" });
  } catch (err) {
    console.error("Role Update Error:", err);
    res.status(500).json({ message: "Failed to update role" });
  }
});

// routes/users.js

// 4. Delete a user
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Optional: Prevent an admin from deleting themselves
    // if (parseInt(id) === req.user.id) {
    //   return res.status(400).json({ message: "You cannot delete your own admin account." });
    // }

    const [result] = await db.query("DELETE FROM `users` WHERE `id` = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found in database." });
    }

    res.json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Failed to delete user due to database error." });
  }
});

export default router;