const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const SECRET = process.env.JWT_SECRET || "medbook_secret_key_2024";

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const [existing] = await db.execute(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );
    if (existing.length > 0)
      return res.status(400).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashed, phone || null, "patient"],
    );
    const token = jwt.sign(
      { id: result.insertId, role: "patient", name, email },
      SECRET,
      { expiresIn: "7d" },
    );
    res.json({
      token,
      user: { id: result.insertId, name, email, role: "patient" },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    if (users.length === 0)
      return res.status(400).json({ message: "Invalid credentials" });
    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "7d" },
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// this is for the get profile

// Get profile
router.get("/me", require("../middleware/auth").auth, async (req, res) => {
  try {
    const [users] = await db.execute(
      "SELECT id, name, email, role, phone, avatar, created_at FROM users WHERE id = ?",
      [req.user.id],
    );
    res.json(users[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
