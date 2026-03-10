export const logActivity = async (logData) => {
  // 🔍 DEBUG: Check your terminal! If this is empty, your route isn't sending data.
  console.log("📥 Received Log Data:", logData); 

  try {
    const { 
      action, recordId, title, accessCode, 
      locationCode, user, role, description 
    } = logData;

    const query = `
      INSERT INTO activity_logs 
      (action, recordId, title, accessCode, locationCode, user, role, description) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(query, [
      action || "UNKNOWN",
      recordId || null,
      title || "Untitled",
      accessCode || null,
      locationCode || null,
      user || "System",
      role || "Staff",
      description || `User performed ${action || 'an action'}`
    ]);
    console.log("✅ Activity Log Saved to DB");
  } catch (err) {
    console.error("❌ Failed to save log function:", err);
  }
};

export default router;