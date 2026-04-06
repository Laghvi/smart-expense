import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  LineChart, Line, XAxis, YAxis, ResponsiveContainer
} from "recharts";
import {
  FaHome, FaChartPie, FaCalculator, FaUser,
  FaWallet, FaQuestionCircle, FaCog
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#3B82F6"];

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [person, setPerson] = useState("");
  const [status, setStatus] = useState("paid");
  const [type, setType] = useState("expense");

  const [calcInput, setCalcInput] = useState("");
  const [showCalc, setShowCalc] = useState(false);

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const username = localStorage.getItem("username") || "User";

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setExpenses(data.expenses || []);
  };

  const handleAddExpense = async () => {
    if (!category || !amount || !date) return;

    const token = localStorage.getItem("token");

    await fetch("http://localhost:3000/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ category, amount, date, person, status, type }),
    });

    fetchExpenses();
    setAmount("");
    setCategory("");
    setDate("");
    setPerson("");
    setStatus("paid");
    setType("expense");
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/api/expenses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchExpenses();
  };

  const handleUpdate = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:3000/api/expenses/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editData),
    });

    setEditId(null);
    fetchExpenses();
  };

  // DATA
  const categoryTotals = expenses.reduce((acc, curr) => {
    if (curr.status !== "paid") return acc;
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});

  const categoryData = Object.entries(categoryTotals).map(([key, value]) => ({
    name: key,
    value,
  }));

   const income = expenses
  .filter((e) => e.type?.toLowerCase().trim() === "income")
  .reduce((acc, curr) => acc + Number(curr.amount), 0);

const expense = expenses
  .filter((e) => e.type?.toLowerCase().trim() === "expense")
  .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const balance = income - expense;
  const budget = 10000;
  const remaining = budget - expense;

  const insights = [
    `Balance: ₹${balance}`,
    `Remaining budget: ₹${remaining}`
  ];

  const getLast30DaysData = () => {
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const total = expenses
        .filter(e => new Date(e.date).toDateString() === d.toDateString())
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      result.push({ date: d.getDate(), amount: total });
    }
    return result;
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">SmartExpense</h2>
        <ul>
          <li><Link to="/"><FaHome /> Home</Link></li>
          <li><Link to="/dashboard"><FaChartPie /> Dashboard</Link></li>
          <li><a href="#"><FaWallet /> Expenses</a></li>
          <li><a href="#"><FaChartPie /> Analytics</a></li>
          <li><Link to="/profile"><FaUser /> Profile</Link></li>
          <li><Link to="/help"><FaQuestionCircle /> Help</Link></li>
          <li><Link to="/settings"><FaCog /> Settings</Link></li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">
          <h3>--Kharcha Overview--</h3>

          <div className="topbar-right">

            <div className="calc-top">
              <FaCalculator
                className="calc-icon"
                onClick={() => setShowCalc(!showCalc)}
              />

              {showCalc && (
                <div className="calc-box">
                  <input className="calc-display" value={calcInput} readOnly />

                  <div className="calc-buttons">
                    {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map((btn) => (
                      <button
                        key={btn}
                        onClick={() => {
                          if (btn === "=") {
                            try {
                              setCalcInput(eval(calcInput).toString());
                            } catch {
                              alert("Invalid");
                            }
                          } else {
                            setCalcInput(calcInput + btn);
                          }
                        }}
                      >
                        {btn}
                      </button>
                    ))}
                    <button className="clear-btn" onClick={() => setCalcInput("")}>
                      AC
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="avatar">
              {username?.charAt(0).toUpperCase()}
            </div>

          </div>
        </div>

        {/* HEADER */}
        <div className="header-section">
          <h2>Welcome, {username} !!</h2>

          <div className="cards-row">

  <div className="total-card">
    <h4>Total Balance</h4>
    <p style={{ color: balance < 0 ? "red" : "green" }}>
      ₹{balance}
    </p>
  </div>

  <div className="total-card">
    <h4>Total Income</h4>
    <p style={{ color: "green" }}>
      ₹{income}
    </p>
  </div>

  <div className="total-card">
    <h4>Total Expense</h4>
    <p style={{ color: "red" }}>
      ₹{expense}
    </p>
  </div>

  <div className="total-card">
    <h4>Budget Left</h4>
    <p style={{ color: remaining < 0 ? "red" : "green" }}>
      ₹{remaining}
    </p>
  </div>

</div>

          {/* FORM */}
          <div className="add-expense-inline">
            <input placeholder="Expense Name" value={category} onChange={(e)=>setCategory(e.target.value)} />
            <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
            <input placeholder="Person" value={person} onChange={(e)=>setPerson(e.target.value)} />

            <select value={type} onChange={(e)=>setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <select value={status} onChange={(e)=>setStatus(e.target.value)}>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="cleared">Cleared</option>
            </select>

            <input type="number" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
            <button onClick={handleAddExpense}>Add</button>
          </div>
        </div>

        {/* MIDDLE */}
        <div className="middle-section">

          {/* ACTIVITY */}
          <div className="card activity-card">
            <h3>Recent Activity</h3>
            {[...expenses]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map(e => (
                <div key={e._id} className="activity-item">
                  <div>
                    <p>{e.category}</p>
                    <span>{new Date(e.date).toLocaleDateString()}</span>
                  </div>
                  <p style={{color:e.type==="income"?"green":"red"}}>
                    {e.type==="income"?"+":"-"}₹{e.amount}
                  </p>
                </div>
              ))}
          </div>

          {/* CHART */}
          <div className="card chart-card">
            <h3>Expense Breakdown</h3>
            <PieChart width={400} height={400}>
              <Pie data={categoryData} dataKey="value" nameKey="name" label>
                {categoryData.map((entry,i)=>(
                  <Cell key={i} fill={COLORS[i%COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>

        </div>

        {/* TREND */}
        <div className="card">
          <h3>Last 30 Days Spending</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getLast30DaysData()}>
              <XAxis dataKey="date"/>
              <YAxis/>
              <Tooltip/>
              <Line dataKey="amount" stroke="#4f46e5"/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* INSIGHTS */}
        <div className="card">
          <h3>Insights</h3>
          {insights.map((i,idx)=><p key={idx}>{i}</p>)}
        </div>

        {/* TABLE */}
        <div className="expense-table">
          <h3>All Expenses</h3>
          <table>
            <thead>
              <tr>
                <th>Expense</th>
                <th>Date</th>
                <th>Person</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((e) => (
                <tr key={e._id}>
                  <td>{e.category}</td>
                  <td>{new Date(e.date).toLocaleDateString()}</td>
                  <td>{e.person || "-"}</td>
                  <td>{e.status}</td>
                  <td>₹{e.amount}</td>
                  <td>
                    <button onClick={()=>handleDelete(e._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;