const express = require("express");
const router = express.Router();

const { addExpense, getExpenses, updateExpense, deleteExpense } = require("../controllers/expenseController");
const protect = require("../middleware/authMiddleware");

// Add expense
router.post("/", protect, addExpense);

// Get expenses
router.get("/", protect, getExpenses);

//Update expense
router.put("/:id", protect,updateExpense);

//Delete Expense
router.delete("/:id", protect, deleteExpense);

module.exports = router;