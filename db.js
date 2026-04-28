import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create the connection pool
export const db = mysql.createPool({
    // If DB_URL exists (Production), use it. Otherwise, fallback to local settings.
    uri: process.env.DB_URL, 
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "library_archives",
    port: process.env.DB_PORT || 3306,
    
    // SSL is required by TiDB Cloud and most production databases
    ssl: process.env.NODE_ENV === "production" ? {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true
    } : false,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});