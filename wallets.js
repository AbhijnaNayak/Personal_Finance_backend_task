const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// ===============================
// POST /api/wallets - Create Wallet
// ===============================
router.post("/", auth, (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: "Wallet name is required" });
  }

  db.query(
    "INSERT INTO wallets (name, userId, balance) VALUES (?, ?, 0.00)",
    [name, userId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Wallet created" });
    }
  );
});

// ===============================
// GET /api/wallets - All wallets of user
// ===============================
router.get("/", auth, (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT * FROM wallets WHERE userId = ?",
    [userId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// ===============================
// GET /api/wallets/:walletId - Single wallet + transactions
// ===============================
router.get("/:walletId", auth, (req, res) => {
  const walletId = req.params.walletId;

  db.query(
    "SELECT * FROM wallets WHERE id = ?",
    [walletId],
    (err, walletResults) => {
      if (err) return res.status(500).json(err);
      if (walletResults.length === 0)
        return res.status(404).json({ message: "Wallet not found" });

      const wallet = walletResults[0];

      db.query(
        "SELECT * FROM transactions WHERE walletId = ? ORDER BY date DESC",
        [walletId],
        (err2, transactions) => {
          if (err2) return res.status(500).json(err2);
          res.json({ wallet, transactions });
        }
      );
    }
  );
});

module.exports = router;
