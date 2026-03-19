// backend/utils/logger.js
import { db } from "../../db.js"; // 🔹 Adjust this path if necessary to find your db.js

export const logActivity = async ({ action, recordId, title, email, role, description }) => {
  try {
    // This confirms the data reached the function
    console.log(`🛠️ Attempting to log: ${action} by ${email}`);

    const sql = `
      INSERT INTO activity_logs 
      (action, recordId, title, user, role, description, timestamp) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    // 🔹 This uses the 'db' variable imported at the top
    await db.query(sql, [
      action || "UNKNOWN",
      recordId || null,
      title || "Untitled",
      email || "System", 
      role || "guest", 
      description || ""
    ]);
    
    console.log(`✔️ Successfully Logged to DB: ${action} by ${email}`);
  } catch (err) {
    // If 'db' was undefined, it would hit this catch block
    console.error("❌ Database Logger Error:", err.message);
  }
};