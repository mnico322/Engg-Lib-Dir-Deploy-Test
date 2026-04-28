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
import userRoutes from "./routes/users.js";
import adminRoutes from "./routes/admin.routes.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---

// Use a dynamic origin check to handle all Vercel previews automatically
const allowedOrigins = [
  'http://localhost:5173',
  'https://engg-lib-dir-deploy-test.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // 1. Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // 2. Allow if origin is in our list OR if it's a Vercel preview link
    const isVercelPreview = origin.endsWith('.vercel.app') && origin.includes('engg-lib-dir-deploy-test');
    
    if (allowedOrigins.indexOf(origin) !== -1 || isVercelPreview) {
      callback(null, true);
    } else {
      console.log("Blocked by CORS: ", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found.` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));