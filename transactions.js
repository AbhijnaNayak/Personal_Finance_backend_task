const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// ===============================
// POST /transactions
// Add income or expense
// ===============================
router.post("/", auth, (req, res) => {
  const { walletId, type, amount, category, date, description } = req.body;

  if (!walletId || !type || !amount || !category || !date) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const amt = parseFloat(amount);

  // 1️⃣ Insert transaction
  db.query(
    "INSERT INTO transactions (walletId, type, amount, category, date, description) VALUES (?, ?, ?, ?, ?, ?)",
    [walletId, type, amt, category, date, description || null],
    (err) => {
      if (err) return res.status(500).json(err);

      // 2️⃣ Update wallet balance
      const updateQuery =
        type === "income"
          ? "UPDATE wallets SET balance = balance + ? WHERE id = ?"
          : "UPDATE wallets SET balance = balance - ? WHERE id = ?";

      db.query(updateQuery, [amt, walletId], (err2) => {
        if (err2) return res.status(500).json(err2);

        // 3️⃣ Fetch updated wallet
        db.query("SELECT * FROM wallets WHERE id = ?", [walletId], (err3, walletResults) => {
          if (err3) return res.status(500).json(err3);
          const wallet = walletResults[0];

          // 4️⃣ Fetch all transactions for this wallet
          db.query(
            "SELECT * FROM transactions WHERE walletId = ? ORDER BY date DESC",
            [walletId],
            (err4, transactions) => {
              if (err4) return res.status(500).json(err4);
              res.json({ wallet, transactions });
            }
          );
        });
      });
    }
  );
});

// ===============================
// GET /transactions
// Get all transactions
// ===============================
router.get("/", auth, (req, res) => {
  db.query(
    "SELECT * FROM transactions ORDER BY date DESC",
    (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    }
  );
});

// ===============================
// DELETE /transactions/:id
// Delete a transaction and revert wallet balance
// ===============================
router.delete("/:id", auth, (req, res) => {
  const transactionId = req.params.id;

  // 1️⃣ Get transaction details
  db.query(
    "SELECT * FROM transactions WHERE id = ?",
    [transactionId],
    (err, results) => {
      if (err) return res.status(500).json(err);
      if (results.length === 0) return res.status(404).json({ error: "Transaction not found" });

      const transaction = results[0];
      const walletId = transaction.walletId;
      const amt = transaction.amount;
      const type = transaction.type;

      // 2️⃣ Delete transaction
      db.query("DELETE FROM transactions WHERE id = ?", [transactionId], (err2) => {
        if (err2) return res.status(500).json(err2);

        // 3️⃣ Revert wallet balance
        const revertQuery =
          type === "income"
            ? "UPDATE wallets SET balance = balance - ? WHERE id = ?"
            : "UPDATE wallets SET balance = balance + ? WHERE id = ?";

        db.query(revertQuery, [amt, walletId], (err3) => {
          if (err3) return res.status(500).json(err3);

          // 4️⃣ Fetch updated wallet
          db.query("SELECT * FROM wallets WHERE id = ?", [walletId], (err4, walletResults) => {
            if (err4) return res.status(500).json(err4);
            const wallet = walletResults[0];

            // 5️⃣ Fetch remaining transactions for this wallet
            db.query(
              "SELECT * FROM transactions WHERE walletId = ? ORDER BY date DESC",
              [walletId],
              (err5, transactions) => {
                if (err5) return res.status(500).json(err5);
                res.json({ wallet, transactions });
              }
            );
          });
        });
      });
    }
  );
});

module.exports = router;
