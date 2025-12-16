const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, (req, res) => {
  const userId = req.user?.id; // from auth middleware

  if (!userId) {
    return res.status(400).json({ error: "User ID not found in auth token" });
  }

  const query = `
    SELECT t.type, SUM(t.amount) AS total
    FROM transactions t
    JOIN wallets w ON t.walletId = w.id
    WHERE w.userId = ?
    GROUP BY t.type
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

module.exports = router;
