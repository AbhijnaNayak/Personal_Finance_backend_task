require("dotenv").config();
const express = require("express");

const authRoutes = require("./routes/auth");
const walletRoutes = require("./routes/wallets");
const transactionRoutes = require("./routes/transactions");
const budgetRoutes = require("./routes/budgets");
const reportRoutes = require("./routes/report");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/wallets", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/report", reportRoutes);

app.get("/", (req, res) => {
  res.send("Personal Finance Backend is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));