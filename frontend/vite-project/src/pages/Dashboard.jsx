import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
  FaHome, FaChartPie, FaWallet, FaUser,
  FaQuestionCircle, FaCog, FaArrowUp, FaArrowDown,
  FaFire, FaChartLine, FaCoins, FaBullseye
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const COLORS = ["#7C3AED", "#A78BFA", "#F59E0B", "#EF4444", "#10B981", "#3B82F6", "#EC4899"];
const MONTHLY_BUDGET = 20000;

function Dashboard() {

  const username = localStorage.getItem("username") || "User";

  const [profilePic, setProfilePic] = useState(() => {
    return localStorage.getItem(`profilePic_${username}`) || "";
  });

  useEffect(() => {
    const updatedPic = localStorage.getItem(`profilePic_${username}`);
    setProfilePic(updatedPic);
  }, [username]);

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [person, setPerson] = useState("");
  const [status, setStatus] = useState("paid");
  const [type, setType] = useState("expense");

  const [nextId, setNextId] = useState(100);
  const [editId, setEditId] = useState(null);
  const [editFields, setEditFields] = useState({});

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/api/expenses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => {
        if (data.expenses && data.expenses.length > 0) {
          const cleaned = data.expenses.map(e => ({
            ...e,
            amount: Number(e.amount),
            type:
              ["salary", "freelance", "freelancing"].includes(
                e.category?.toLowerCase()
              )
                ? "income"
                : e.type || "expense"
          }));
          setExpenses(cleaned);
          localStorage.setItem("expenses", JSON.stringify(cleaned));
        }
      })
      .catch(() => {});
  }, []);

  const handleAddExpense = async () => {
    if (!category || !amount || !date) return;

    const newEntry = {
      _id: String(nextId),
      category,
      amount: Number(amount),
      date,
      person,
      status,
      type,
    };

    setExpenses(prev => [newEntry, ...prev]);
    setNextId(n => n + 1);
    setAmount(""); setCategory(""); setDate(""); setPerson("");

    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ category, amount, date, person, status, type }),
      }).catch(() => {});
    }
  };

  const handleDelete = async (id) => {
    setExpenses(prev => prev.filter(e => e._id !== id));
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
  };

  const startEdit = (e) => {
    setEditId(e._id);
    setEditFields({ category: e.category, amount: e.amount, date: e.date, person: e.person || "", status: e.status || "paid", type: e.type });
  };

  const cancelEdit = () => { setEditId(null); setEditFields({}); };

  const saveEdit = async (id) => {
    setExpenses(prev => prev.map(e => e._id === id ? { ...e, ...editFields, amount: Number(editFields.amount) } : e));
    setEditId(null);
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`http://localhost:3000/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editFields),
      }).catch(() => {});
    }
  };

  const income = expenses.filter(e => e.type === "income").reduce((a, c) => a + Number(c.amount), 0);
  const expense = expenses.filter(e => e.type === "expense").reduce((a, c) => a + Number(c.amount), 0);
  const balance = income - expense;

  const categoryTotals = {};
  expenses.forEach(e => {
    if (e.type === "expense") {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    }
  });
  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  const incomeTotals = {};
  expenses.forEach(e => {
    if (e.type === "income") {
      incomeTotals[e.category] = (incomeTotals[e.category] || 0) + Number(e.amount);
    }
  });
  const incomeData = Object.entries(incomeTotals).map(([name, value]) => ({ name, value }));

  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
  const topCategory = [...categoryData].sort((a, b) => b.value - a.value)[0];
  const budgetUsed = Math.min(Math.round((expense / MONTHLY_BUDGET) * 100), 100);
  const dailyAvg = expenses.filter(e => e.type === "expense").length > 0 ? Math.round(expense / 30) : 0;
  const remainingBudget = Math.max(MONTHLY_BUDGET - expense, 0);

  const formatINR = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="custom-tooltip">
          <p className="tt-label">{payload[0].name}</p>
          <p className="tt-value">{formatINR(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="layout">

      {/* ── SIDEBAR ── */}
      <div className="sidebar">
        <div className="sidebar-brand">
          <h2>SmartExpense</h2>
        </div>
        <ul>
          <li><Link to="/"><FaHome /><span>Home</span></Link></li>
          <li className="active"><Link to="/dashboard"><FaChartPie /><span>Dashboard</span></Link></li>
          <li><a href="#expenses-section"><FaWallet /><span>Expenses</span></a></li>
          <li><Link to="/profile"><FaUser /><span>Profile</span></Link></li>
          <li><Link to="/help"><FaQuestionCircle /><span>Help</span></Link></li>
          <li><Link to="/settings"><FaCog /><span>Settings</span></Link></li>
        </ul>
      </div>

      {/* ── MAIN ── */}
      <div className="main">

        {/* ── TOPBAR ── */}
        <div className="topbar">
          <div className="topbar-left">
            <h2>Kharcha Overview</h2>
            <span className="topbar-date">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </span>
          </div>

          <div className="topbar-right">
            <div className="user-badge">
              <div className="user-avatar">
                {profilePic
                  ? <img src={profilePic} alt="profile" />
                  : username[0]?.toUpperCase()
                }
              </div>
              <span>{username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="main-content">
          <div className="dashboard-section">

            {/* TOP 3 STAT CARDS */}
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-icon-wrap balance-icon"><FaCoins /></div>
                <div>
                  <p>Total Balance</p>
                  <h2 className={balance >= 0 ? "positive" : "negative"}>{formatINR(balance)}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap income-icon"><FaArrowDown /></div>
                <div>
                  <p>Total Income</p>
                  <h2 className="positive">{formatINR(income)}</h2>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon-wrap expense-icon"><FaArrowUp /></div>
                <div>
                  <p>Total Expenses</p>
                  <h2 className="negative">{formatINR(expense)}</h2>
                </div>
              </div>
            </div>

            {/* ADD TRANSACTION FORM */}
            <div className="add-form-wrapper">
              <h3 className="form-title">➕ Add Transaction</h3>
              <div className="add-form">
                <input placeholder="Category (e.g. Food)" value={category} onChange={e => setCategory(e.target.value)} />
                <input type="date" value={date} onChange={e => setDate(e.target.value)} />
                <input placeholder="Person (optional)" value={person} onChange={e => setPerson(e.target.value)} />
                <select value={type} onChange={e => setType(e.target.value)}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
                <input type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} />
                <button onClick={handleAddExpense} className="add-btn">Add</button>
              </div>
            </div>

            {/* ROW 1: Recent Transactions | Insights */}
            <div className="dashboard-row">
              <div className="card">
                <h3 className="card-title">🕐 Recent Transactions</h3>
                <div className="txn-list">
                  {expenses.slice(0, 6).map(e => (
                    <div key={e._id} className="txn-item">
                      <div className="txn-left">
                        <div className={`txn-dot ${e.type}`}></div>
                        <div>
                          <p className="txn-cat">{e.category}</p>
                          <p className="txn-meta">
                            {e.date
                              ? new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                              : ""}
                            {e.person ? ` · ${e.person}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className={`txn-amt ${e.type === "income" ? "txn-income" : "txn-expense"}`}>
                        {e.type === "income" ? "+" : "-"}{formatINR(e.amount)}
                      </span>
                    </div>
                  ))}
                  {expenses.length === 0 && <p className="empty-state">No transactions yet. Add one above!</p>}
                </div>
              </div>

              <div className="card">
                <h3 className="card-title">💡 Insights</h3>
                <div className="insights-grid">
                  <div className="insight-tile green">
                    <div className="insight-icon"><FaChartLine /></div>
                    <div>
                      <p className="insight-label">Savings Rate</p>
                      <p className="insight-value">{savingsRate}%</p>
                    </div>
                  </div>
                  <div className="insight-tile purple">
                    <div className="insight-icon"><FaBullseye /></div>
                    <div>
                      <p className="insight-label">Budget Used</p>
                      <p className="insight-value">{budgetUsed}%</p>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar" style={{ width: `${budgetUsed}%`, background: budgetUsed > 80 ? "#EF4444" : "#7C3AED" }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="insight-tile orange">
                    <div className="insight-icon"><FaFire /></div>
                    <div>
                      <p className="insight-label">Top Category</p>
                      <p className="insight-value">{topCategory?.name || "—"}</p>
                    </div>
                  </div>
                  <div className="insight-tile blue">
                    <div className="insight-icon"><FaChartPie /></div>
                    <div>
                      <p className="insight-label">Daily Avg Spend</p>
                      <p className="insight-value">{formatINR(dailyAvg)}</p>
                    </div>
                  </div>
                  <div className="insight-tile teal">
                    <div className="insight-icon"><FaWallet /></div>
                    <div>
                      <p className="insight-label">Remaining Budget</p>
                      <p className="insight-value">{formatINR(remainingBudget)}</p>
                    </div>
                  </div>
                  <div className="insight-tile gray">
                    <div className="insight-icon"><FaCoins /></div>
                    <div>
                      <p className="insight-label">Total Transactions</p>
                      <p className="insight-value">{expenses.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2: Expenses List | Expense Pie Chart */}
            <div id="expenses-section" className="dashboard-row">
              <div className="card">
                <h3 className="card-title">📤 Expenses</h3>
                <div className="txn-list">
                  {expenses.filter(e => e.type === "expense").map(e => (
                    <div key={e._id} className="txn-item">
                      <div className="txn-left">
                        <div className="txn-dot expense"></div>
                        <div>
                          <p className="txn-cat">{e.category}</p>
                          <p className="txn-meta">
                            {e.date ? new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                          </p>
                        </div>
                      </div>
                      <span className="txn-amt txn-expense">-{formatINR(e.amount)}</span>
                    </div>
                  ))}
                  {expenses.filter(e => e.type === "expense").length === 0 && (
                    <p className="empty-state">No expenses recorded yet.</p>
                  )}
                </div>
              </div>

              <div className="card chart-card">
                <h3 className="card-title">🥧 Expense Breakdown</h3>
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={50}
                        paddingAngle={3}
                      >
                        {categoryData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        iconType="circle"
                        iconSize={8}
                        formatter={(value) => <span style={{ color: "#6B7280", fontSize: "12px" }}>{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart">No expense data to display</div>
                )}
              </div>
            </div>

            {/* ROW 3: Income List | Income Bar Chart */}
            <div className="dashboard-row">
              <div className="card">
                <h3 className="card-title">📥 Income</h3>
                <div className="txn-list">
                  {expenses.filter(e => e.type === "income").map(e => (
                    <div key={e._id} className="txn-item">
                      <div className="txn-left">
                        <div className="txn-dot income"></div>
                        <div>
                          <p className="txn-cat">{e.category}</p>
                          <p className="txn-meta">
                            {e.date ? new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                          </p>
                        </div>
                      </div>
                      <span className="txn-amt txn-income">+{formatINR(e.amount)}</span>
                    </div>
                  ))}
                  {expenses.filter(e => e.type === "income").length === 0 && (
                    <p className="empty-state">No income recorded yet.</p>
                  )}
                </div>
              </div>

              <div className="card chart-card">
                <h3 className="card-title">📊 Income by Source</h3>
                {incomeData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={incomeData} barSize={40}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F5F3FF" }} />
                      <Bar dataKey="value" fill="#7C3AED" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart">No income data to display</div>
                )}
              </div>
            </div>

            {/* ROW 4: All Transactions Table — Full Width */}
            <div className="card full-width-card">
              <div className="table-header-row">
                <h3 className="card-title" style={{ margin: 0 }}>📋 All Transactions</h3>
                <div className="table-summary-pills">
                  <span className="pill pill-total">Total: {expenses.length}</span>
                  <span className="pill pill-income">Income: {expenses.filter(e => e.type === "income").length}</span>
                  <span className="pill pill-expense">Expenses: {expenses.filter(e => e.type === "expense").length}</span>
                </div>
              </div>

              <div className="table-wrap">
                <table className="txn-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th>Expense / Category</th>
                      <th>Type</th>
                      <th>Person</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((e, i) =>
                      editId === e._id ? (
                        <tr key={e._id} className="row-editing">
                          <td className="row-num">{i + 1}</td>
                          <td>
                            <input className="tbl-input" value={editFields.category}
                              onChange={ev => setEditFields(f => ({ ...f, category: ev.target.value }))}
                              placeholder="Category" />
                          </td>
                          <td>
                            <select className="tbl-select" value={editFields.type}
                              onChange={ev => setEditFields(f => ({ ...f, type: ev.target.value }))}>
                              <option value="expense">Expense</option>
                              <option value="income">Income</option>
                            </select>
                          </td>
                          <td>
                            <input className="tbl-input" value={editFields.person}
                              onChange={ev => setEditFields(f => ({ ...f, person: ev.target.value }))}
                              placeholder="Person" />
                          </td>
                          <td>
                            <input className="tbl-input" type="date" value={editFields.date}
                              onChange={ev => setEditFields(f => ({ ...f, date: ev.target.value }))} />
                          </td>
                          <td>
                            <select className="tbl-select" value={editFields.status}
                              onChange={ev => setEditFields(f => ({ ...f, status: ev.target.value }))}>
                              <option value="paid">Paid</option>
                              <option value="pending">Pending</option>
                              <option value="unpaid">Unpaid</option>
                            </select>
                          </td>
                          <td>
                            <input className="tbl-input tbl-amount" type="number" value={editFields.amount}
                              onChange={ev => setEditFields(f => ({ ...f, amount: ev.target.value }))}
                              placeholder="Amount" />
                          </td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-save" onClick={() => saveEdit(e._id)}>✓ Save</button>
                              <button className="btn-cancel" onClick={cancelEdit}>✕</button>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        <tr key={e._id} className={i % 2 === 0 ? "row-even" : "row-odd"}>
                          <td className="row-num">{i + 1}</td>
                          <td className="cat-cell">
                            <div className="cat-with-dot">
                              <div className={`txn-dot ${e.type}`}></div>
                              {e.category}
                            </div>
                          </td>
                          <td>
                            <span className={`type-badge ${e.type}`}>
                              {e.type === "income" ? "↑ Income" : "↓ Expense"}
                            </span>
                          </td>
                          <td className="person-cell">{e.person || "—"}</td>
                          <td className="date-cell">
                            {e.date
                              ? new Date(e.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                              : "—"}
                          </td>
                          <td>
                            <span className={`status-badge status-${e.status || "paid"}`}>
                              {e.status || "paid"}
                            </span>
                          </td>
                          <td className={`amt-cell ${e.type === "income" ? "txn-income" : "txn-expense"}`}>
                            {e.type === "income" ? "+" : "-"}{formatINR(e.amount)}
                          </td>
                          <td>
                            <div className="action-btns">
                              <button className="btn-edit" onClick={() => startEdit(e)}>✏ Edit</button>
                              <button className="btn-delete" onClick={() => handleDelete(e._id)}>🗑 Delete</button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                    {expenses.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: "14px" }}>
                          No transactions yet. Add one above!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
