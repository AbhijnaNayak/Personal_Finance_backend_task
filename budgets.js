const express = require("express");
const db = require("../db");
const auth = require("../middleware/auth");

const router = express.Router();

// ===============================
// POST /budgets - create budget
// ===============================
router.post("/", auth, (req, res) => {
  const { userId, category, amount, month } = req.body;
  if (!userId || !category || !amount || !month)
    return res.status(400).json({ error: "All fields are required" });

  db.query(
    "INSERT INTO budgets (userId, category, amount, month) VALUES (?,?,?,?)",
    [userId, category, amount, month],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Budget set successfully" });
    }
  );
});

// ===============================
// GET /budgets - list budgets
// ===============================
router.get("/", auth, (req, res) => {
  db.query("SELECT * FROM budgets", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ===============================
// PUT /budgets/:id - update budget
// ===============================
router.put("/:id", auth, (req, res) => {
  const budgetId = req.params.id;
  const { amount, category, month } = req.body;

  db.query(
    "UPDATE budgets SET amount = ?, category = ?, month = ? WHERE id = ?",
    [amount, category, month, budgetId],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Budget updated successfully" });
    }
  );
});

// ===============================
// DELETE /budgets/:id - delete budget
// ===============================
router.delete("/:id", auth, (req, res) => {
  const budgetId = req.params.id;
  db.query("DELETE FROM budgets WHERE id = ?", [budgetId], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Budget deleted successfully" });
  });
});

module.exports = router;
