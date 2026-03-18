// db.js
import mysql from "mysql2/promise";

// Create the pool once
export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "engginstitutionalrepo_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
