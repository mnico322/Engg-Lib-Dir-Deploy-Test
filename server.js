import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Route Imports
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/records.routes.js";
import logRoutes from "./routes/logs.routes.js";

dotenv.config();

const app = express();

// Required for serving uploaded files in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(cors({
  origin: "http://localhost:5173", // Match your Vite port
  credentials: true,
}));

app.use(express.json()); // For regular JSON data
app.use(express.urlencoded({ extended: true })); // For form-encoded data
app.use(cookieParser());

// ✅ Serve the 'uploads' folder so files are accessible via URL
// Example: http://localhost:5000/uploads/filename.pdf
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/logs", logRoutes);

// --- 404 Catch-all ---
// If a request hits this, it means the URL doesn't exist in the routes above
app.use((req, res, next) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found on this server.` });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});