// src/utils/logActivity.js
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig"; // adjust path if needed
import { useAuth } from "../context/AuthContext"; // optional if you want real user data

export async function logActivity(action, recordId, extra = {}, user = null) {
  try {
    await addDoc(collection(db, "activityLogs"), {
      action,                 // e.g. "Add Record", "Update Record", "Delete Record", "Restore Record"
      recordId,               // record ID in "records" collection
      ...extra,               // more context (title, codes, etc.)
      user: user || "guest",  // fallback if no user info
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error("Failed to log activity:", err);
  }
}
