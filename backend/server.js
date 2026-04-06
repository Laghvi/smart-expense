require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const connectDB = require("./config/db");
const app = express();

connectDB();


app.use(cors());
// middleware
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.json({ message: "SmartExpense is running." });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});