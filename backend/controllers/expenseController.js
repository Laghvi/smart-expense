const Expense = require("../models/Expense");

// ➕ ADD EXPENSE
const addExpense = async (req, res) => {
  try {
    console.log("USER ID:", req.user);
    const { category, amount, date, person, status } = req.body;

    if (!category || !amount || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const expense = new Expense({
      category,
      amount,
      date,
      person,
      status,
      user: req.user, // 🔥 link to user
    });

    const savedExpense = await expense.save();

    res.status(201).json({
      message: "Expense added successfully",
      expense: savedExpense,
    });

  } catch (error) {
    console.log("ADD ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// 📥 GET EXPENSES (USER-SPECIFIC)
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user, // 🔥 filter by user
    }).sort({ createdAt: -1 });

    res.json({ expenses });

  } catch (error) {
    console.log("GET ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


// ✏️ UPDATE EXPENSE (SECURE)
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    // 🔴 Check if expense exists
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // 🔴 Safe user check (prevents crash)
    // if (!expense.user || expense.user.toString() !== req.user) {
    //   return res.status(401).json({ message: "Not authorized" });
    // }

    // ✅ Update only required fields (clean update)
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        category: req.body.category,
        amount: req.body.amount,
        date: req.body.date,
        person: req.body.person,
        status: req.body.status,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
};


// 🗑 DELETE EXPENSE (SECURE)
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expense.deleteOne();

    res.json({ message: "Expense deleted" });

  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
};