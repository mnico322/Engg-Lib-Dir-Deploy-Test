// db.js
import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "3nggR3p0$1t0ry",
  database: "engginstitutionalrepo_db",
});
