const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO users (email, passwordHash) VALUES (?, ?)",
    [email, hash],
    () => res.json({ message: "User registered" })
  );
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, results) => {
      if (!results.length) return res.status(401).json({ message: "Invalid" });
      const valid = await bcrypt.compare(password, results[0].passwordHash);
      if (!valid) return res.status(401).json({ message: "Invalid" });

      const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET);
      res.json({ token });
    }
  );
});

module.exports = router;