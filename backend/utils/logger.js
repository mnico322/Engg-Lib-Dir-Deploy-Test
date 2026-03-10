// DIR\backend\utils\logger.js
import { db } from "../../db.js"; // This goes up 2 levels (utils -> backend -> DIR) to find db.js

export const logActivity = async (userId, action, resourceType, resourceId, title, description) => {
  try {
    const sql = `
      INSERT INTO activity_logs 
      (user_id, action_type, resource_type, resource_id, title, description, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW())
    `;
    
    await db.query(sql, [
      userId || null, 
      action,           // 'ADD'
      resourceType,     // 'RECORD'
      resourceId || null, 
      title || 'N/A', 
      description || ''
    ]);
    
    console.log(`✔️ Activity Logged: ${action} - ${title}`);
  } catch (err) {
    // This will show exactly why it fails in your terminal
    console.error("Logging Error:", err.sqlMessage || err.message);
  }
};