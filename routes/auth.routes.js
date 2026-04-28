import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db.js";

const router = express.Router();

/* ================= HELPERS ================= */
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validatePassword = (password) => password && password.length >= 6;
const validateDisplayName = (name) => name && name.trim().length > 0;

/* ================= LOGIN (SECURED) ================= */
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ message: "Invalid email or password format" });
    }

    email = email.toLowerCase(); 

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: "Email not found" });
    }

    const user = rows[0];

    // Check Approval Status
    if (Number(user.approved) !== 1) {
      return res.status(403).json({ message: "Your account is pending admin approval." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Password incorrect" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET not set");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Create JWT
    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, jwtSecret, { expiresIn: "1d" });

    // --- SECURITY UPGRADE: Set cookies ---
    const cookieOptions = {
      httpOnly: true, // Prevents JavaScript access
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    // Store the main Auth token
    res.cookie("token", token, cookieOptions);

    // Store the role and email so records.routes.js can read them easily
    // We do NOT set these to httpOnly: false because the backend needs to read them, 
    // but we don't want the frontend to easily mess with them.
    res.cookie("role", user.role, cookieOptions);
    res.cookie("userEmail", user.email, cookieOptions);

    res.json({
      user: {
        id: user.id,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
      },
      message: "Login successful",
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET CURRENT USER (SECURED) ================= */
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "Not authenticated" });

    const jwtSecret = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, jwtSecret);

    const [rows] = await db.query(
      "SELECT id, displayName, email, role, approved FROM users WHERE id = ?",
      [decoded.id]
    );

    if (rows.length === 0) return res.status(401).json({ message: "User not found" });
    
    if (Number(rows[0].approved) !== 1) {
       res.clearCookie("token");
       res.clearCookie("role");
       res.clearCookie("userEmail");
       return res.status(403).json({ message: "Account no longer approved" });
    }

    res.json({ user: rows[0] });

  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

/* ================= LOGOUT (CLEARS ALL) ================= */
router.post("/logout", (req, res) => {
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.clearCookie("role", { httpOnly: true, sameSite: "lax" });
  res.clearCookie("userEmail", { httpOnly: true, sameSite: "lax" });
  res.json({ message: "Logged out successfully" });
});

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    let { displayName, email, password } = req.body;

    if (!validateDisplayName(displayName) || !validateEmail(email) || !validatePassword(password)) {
      return res.status(400).json({ message: "Invalid registration details" });
    }

    email = email.toLowerCase();

    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.query(
      "INSERT INTO users (displayName, email, password, role, approved) VALUES (?, ?, ?, ?, ?)",
      [displayName, email, hashedPassword, "user", 0]
    );

    res.status(201).json({
      message: "Registration successful. Waiting for admin approval.",
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;