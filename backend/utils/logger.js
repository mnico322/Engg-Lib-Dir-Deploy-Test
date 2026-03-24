import { db } from "../../db.js";

export const logActivity = async ({ action, recordId, title, user, role, description }) => {
  try {
    const sql = `
      INSERT INTO activity_logs 
      (action, recordId, title, user, role, description, timestamp) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await db.query(sql, [
      action || "UNKNOWN",
      recordId || null,
      title || "N/A",
      user || "System",      // Matches 'user' column
      role || "guest",       // Matches 'role' column
      description || ""      // Matches 'description' column
    ]);
    
    console.log(`Logged to DB: ${action} by ${user}`);
  } catch (err) {
    console.error("Database Logger Error:", err.message);
  }
};