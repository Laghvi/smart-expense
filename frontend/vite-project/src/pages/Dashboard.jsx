// import { useEffect, useState } from "react";
// import {
//   PieChart, Pie, Cell, Tooltip, Legend,
//   LineChart, Line, XAxis, YAxis, ResponsiveContainer
// } from "recharts";
// import {
//   FaHome, FaChartPie, FaCalculator, FaUser,
//   FaWallet, FaQuestionCircle, FaCog
// } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import "./Dashboard.css";

// const COLORS = ["#4F46E5", "#22C55E", "#F59E0B", "#EF4444", "#3B82F6"];

// function Dashboard() {
//   const [expenses, setExpenses] = useState([]);
//   const [amount, setAmount] = useState("");
//   const [category, setCategory] = useState("");
//   const [date, setDate] = useState("");
//   const [person, setPerson] = useState("");
//   const [status, setStatus] = useState("paid");
//   const [type, setType] = useState("expense");

//   const [calcInput, setCalcInput] = useState("");
//   const [showCalc, setShowCalc] = useState(false);

//   const [editId, setEditId] = useState(null);
//   const [editData, setEditData] = useState({});

//   const username = localStorage.getItem("username") || "User";

//   useEffect(() => {
//     fetchExpenses();
//   }, []);

//   const fetchExpenses = async () => {
//     const token = localStorage.getItem("token");
//     const res = await fetch("http://localhost:3000/api/expenses", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     const data = await res.json();
//     setExpenses(data.expenses || []);
//   };

//   const handleAddExpense = async () => {
//     if (!category || !amount || !date) return;

//     const token = localStorage.getItem("token");

//     await fetch("http://localhost:3000/api/expenses", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ category, amount, date, person, status, type }),
//     });

//     fetchExpenses();
//     setAmount("");
//     setCategory("");
//     setDate("");
//     setPerson("");
//     setStatus("paid");
//     setType("expense");
//   };

//   const handleDelete = async (id) => {
//     const token = localStorage.getItem("token");

//     await fetch(`http://localhost:3000/api/expenses/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     fetchExpenses();
//   };

//   const handleUpdate = async (id) => {
//     const token = localStorage.getItem("token");

//     await fetch(`http://localhost:3000/api/expenses/${id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(editData),
//     });

//     setEditId(null);
//     fetchExpenses();
//   };

//   // DATA
//   const categoryTotals = expenses.reduce((acc, curr) => {
//     if (curr.status !== "paid") return acc;
//     acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
//     return acc;
//   }, {});

//   const categoryData = Object.entries(categoryTotals).map(([key, value]) => ({
//     name: key,
//     value,
//   }));

//    const income = expenses
//   .filter((e) => e.type?.toLowerCase().trim() === "income")
//   .reduce((acc, curr) => acc + Number(curr.amount), 0);

// const expense = expenses
//   .filter((e) => e.type?.toLowerCase().trim() === "expense")
//   .reduce((acc, curr) => acc + Number(curr.amount), 0);

//   const balance = income - expense;
//   const budget = 10000;
//   const remaining = budget - expense;

//   const insights = [
//     `Balance: ₹${balance}`,
//     `Remaining budget: ₹${remaining}`
//   ];

//   const getLast30DaysData = () => {
//     const result = [];
//     for (let i = 29; i >= 0; i--) {
//       const d = new Date();
//       d.setDate(d.getDate() - i);

//       const total = expenses
//         .filter(e => new Date(e.date).toDateString() === d.toDateString())
//         .reduce((acc, curr) => acc + Number(curr.amount), 0);

//       result.push({ date: d.getDate(), amount: total });
//     }
//     return result;
//   };

//   return (
//     <div className="layout">

//       {/* SIDEBAR */}
//       <div className="sidebar">
//         <h2 className="logo">SmartExpense</h2>
//         <ul>
//           <li><Link to="/"><FaHome /> Home</Link></li>
//           <li><Link to="/dashboard"><FaChartPie /> Dashboard</Link></li>
//           <li><a href="#"><FaWallet /> Expenses</a></li>
//           <li><a href="#"><FaChartPie /> Analytics</a></li>
//           <li><Link to="/profile"><FaUser /> Profile</Link></li>
//           <li><Link to="/help"><FaQuestionCircle /> Help</Link></li>
//           <li><Link to="/settings"><FaCog /> Settings</Link></li>
//         </ul>
//       </div>

//       {/* MAIN */}
//       <div className="main">

//         {/* TOPBAR */}
//         <div className="topbar">
//           <h3>--Kharcha Overview--</h3>

//           <div className="topbar-right">

//             <div className="calc-top">
//               <FaCalculator
//                 className="calc-icon"
//                 onClick={() => setShowCalc(!showCalc)}
//               />

//               {showCalc && (
//                 <div className="calc-box">
//                   <input className="calc-display" value={calcInput} readOnly />

//                   <div className="calc-buttons">
//                     {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map((btn) => (
//                       <button
//                         key={btn}
//                         onClick={() => {
//                           if (btn === "=") {
//                             try {
//                               setCalcInput(eval(calcInput).toString());
//                             } catch {
//                               alert("Invalid");
//                             }
//                           } else {
//                             setCalcInput(calcInput + btn);
//                           }
//                         }}
//                       >
//                         {btn}
//                       </button>
//                     ))}
//                     <button className="clear-btn" onClick={() => setCalcInput("")}>
//                       AC
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="avatar">
//               {username?.charAt(0).toUpperCase()}
//             </div>

//           </div>
//         </div>

//         {/* HEADER */}
//         <div className="header-section">
//           <h2>Welcome, {username} !!</h2>

//           <div className="cards-row">

//   <div className="total-card">
//     <h4>Total Balance</h4>
//     <p style={{ color: balance < 0 ? "red" : "green" }}>
//       ₹{balance}
//     </p>
//   </div>

//   <div className="total-card">
//     <h4>Total Income</h4>
//     <p style={{ color: "green" }}>
//       ₹{income}
//     </p>
//   </div>

//   <div className="total-card">
//     <h4>Total Expense</h4>
//     <p style={{ color: "red" }}>
//       ₹{expense}
//     </p>
//   </div>

//   <div className="total-card">
//     <h4>Budget Left</h4>
//     <p style={{ color: remaining < 0 ? "red" : "green" }}>
//       ₹{remaining}
//     </p>
//   </div>

// </div>

//           {/* FORM */}
//           <div className="add-expense-inline">
//             <input placeholder="Expense Name" value={category} onChange={(e)=>setCategory(e.target.value)} />
//             <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
//             <input placeholder="Person" value={person} onChange={(e)=>setPerson(e.target.value)} />

//             <select value={type} onChange={(e)=>setType(e.target.value)}>
//               <option value="expense">Expense</option>
//               <option value="income">Income</option>
//             </select>

//             <select value={status} onChange={(e)=>setStatus(e.target.value)}>
//               <option value="paid">Paid</option>
//               <option value="pending">Pending</option>
//               <option value="cleared">Cleared</option>
//             </select>

//             <input type="number" placeholder="Amount" value={amount} onChange={(e)=>setAmount(e.target.value)} />
//             <button onClick={handleAddExpense}>Add</button>
//           </div>
//         </div>

//         {/* MIDDLE */}
//         <div className="middle-section">

//           {/* ACTIVITY */}
//           <div className="card activity-card">
//             <h3>Recent Activity</h3>
//             {[...expenses]
//               .sort((a, b) => new Date(b.date) - new Date(a.date))
//               .slice(0, 5)
//               .map(e => (
//                 <div key={e._id} className="activity-item">
//                   <div>
//                     <p>{e.category}</p>
//                     <span>{new Date(e.date).toLocaleDateString()}</span>
//                   </div>
//                   <p style={{color:e.type==="income"?"green":"red"}}>
//                     {e.type==="income"?"+":"-"}₹{e.amount}
//                   </p>
//                 </div>
//               ))}
//           </div>

//           {/* CHART */}
//           <div className="card chart-card">
//             <h3>Expense Breakdown</h3>
//             <PieChart width={400} height={400}>
//               <Pie data={categoryData} dataKey="value" nameKey="name" label>
//                 {categoryData.map((entry,i)=>(
//                   <Cell key={i} fill={COLORS[i%COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </div>

//         </div>

//         {/* TREND */}
//         <div className="card">
//           <h3>Last 30 Days Spending</h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={getLast30DaysData()}>
//               <XAxis dataKey="date"/>
//               <YAxis/>
//               <Tooltip/>
//               <Line dataKey="amount" stroke="#4f46e5"/>
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* INSIGHTS */}
//         <div className="card">
//           <h3>Insights</h3>
//           {insights.map((i,idx)=><p key={idx}>{i}</p>)}
//         </div>

//         {/* TABLE */}
//         <div className="expense-table">
//           <h3>All Expenses</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Expense</th>
//                 <th>Date</th>
//                 <th>Person</th>
//                 <th>Status</th>
//                 <th>Amount</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {expenses.map((e) => (
//                 <tr key={e._id}>
//                   <td>{e.category}</td>
//                   <td>{new Date(e.date).toLocaleDateString()}</td>
//                   <td>{e.person || "-"}</td>
//                   <td>{e.status}</td>
//                   <td>₹{e.amount}</td>
//                   <td>
//                     <button onClick={()=>handleDelete(e._id)}>Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//       </div>
//     </div>
//   );
// }

// export default Dashboard;

import { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from "recharts";
import {
  FaHome, FaChartPie, FaCalculator, FaUser,
  FaWallet, FaQuestionCircle, FaCog, FaPlus,
  FaArrowUp, FaArrowDown, FaEdit, FaTrash, FaCheck, FaTimes
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const COLORS = ["#6C3BFF", "#A78BFA", "#F59E0B", "#EF4444", "#3B82F6", "#22C55E"];

const CATEGORY_ICONS = {
  Food: "🍔", Shopping: "🛍️", Travel: "✈️", Books: "📚",
  Salary: "💼", Stationary: "✏️", Entertainment: "🎬",
  Health: "💊", Utilities: "💡", Other: "📦"
};

function getCategoryIcon(cat) {
  if (!cat) return "📦";
  const key = Object.keys(CATEGORY_ICONS).find(k => cat.toLowerCase().includes(k.toLowerCase()));
  return key ? CATEGORY_ICONS[key] : "📦";
}

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

  const [activeTab, setActiveTab] = useState("all");

  const username = localStorage.getItem("username") || "User";

  useEffect(() => { fetchExpenses(); }, []);

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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ category, amount, date, person, status, type }),
    });
    fetchExpenses();
    setAmount(""); setCategory(""); setDate(""); setPerson(""); setStatus("paid"); setType("expense");
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
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(editData),
    });
    setEditId(null);
    fetchExpenses();
  };

  const startEdit = (e) => {
    setEditId(e._id);
    setEditData({ category: e.category, amount: e.amount, date: e.date?.slice(0,10), person: e.person, status: e.status, type: e.type });
  };

  // Computed data
  const income = expenses.filter(e => e.type?.toLowerCase().trim() === "income").reduce((a, c) => a + Number(c.amount), 0);
  const expense = expenses.filter(e => e.type?.toLowerCase().trim() === "expense").reduce((a, c) => a + Number(c.amount), 0);
  const balance = income - expense;
  const budget = 10000;
  const remaining = budget - expense;

  const categoryTotals = expenses.reduce((acc, curr) => {
    if (curr.type !== "expense") return acc;
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});
  const categoryData = Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));

  const incomeTotals = expenses.reduce((acc, curr) => {
    if (curr.type !== "income") return acc;
    acc[curr.category] = (acc[curr.category] || 0) + Number(curr.amount);
    return acc;
  }, {});
  const incomeData = Object.entries(incomeTotals).map(([name, value]) => ({ name, value }));

  const getLast30DaysData = () => {
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayExpense = expenses.filter(e => e.type === "expense" && new Date(e.date).toDateString() === d.toDateString()).reduce((a, c) => a + Number(c.amount), 0);
      const dayIncome = expenses.filter(e => e.type === "income" && new Date(e.date).toDateString() === d.toDateString()).reduce((a, c) => a + Number(c.amount), 0);
      result.push({ date: `${d.getDate()}/${d.getMonth()+1}`, expense: dayExpense, income: dayIncome });
    }
    return result;
  };

  const savingsRate = income > 0 ? Math.round((balance / income) * 100) : 0;
  const topCategory = categoryData.sort((a,b) => b.value - a.value)[0];
  const budgetUsed = Math.min(Math.round((expense / budget) * 100), 100);

  const filteredExpenses = expenses.filter(e => {
    if (activeTab === "income") return e.type === "income";
    if (activeTab === "expense") return e.type === "expense";
    if (activeTab === "pending") return e.status === "pending";
    return true;
  });

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <span className="logo-icon">💸</span>
          <h2>SmartExpense</h2>
        </div>

        <div className="sidebar-avatar">
          <div className="avatar-big">{username?.charAt(0).toUpperCase()}</div>
          <p className="avatar-name">{username}</p>
          <p className="avatar-sub">Personal Finance</p>
        </div>

        <ul>
          <li><Link to="/"><FaHome /><span>Home</span></Link></li>
          <li className="active"><Link to="/dashboard"><FaChartPie /><span>Dashboard</span></Link></li>
          <li><a href="#"><FaWallet /><span>Expenses</span></a></li>
          <li><a href="#"><FaChartPie /><span>Analytics</span></a></li>
          <li><Link to="/profile"><FaUser /><span>Profile</span></Link></li>
          <li><Link to="/help"><FaQuestionCircle /><span>Help</span></Link></li>
          <li><Link to="/settings"><FaCog /><span>Settings</span></Link></li>
        </ul>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <h3>Kharcha Overview</h3>
            <p className="topbar-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="topbar-right">
            <div className="calc-top">
              <button className="calc-btn" onClick={() => setShowCalc(!showCalc)}>
                <FaCalculator /> Calculator
              </button>
              {showCalc && (
                <div className="calc-box">
                  <input className="calc-display" value={calcInput} readOnly />
                  <div className="calc-buttons">
                    {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","=","+"].map((btn) => (
                      <button key={btn} onClick={() => {
                        if (btn === "=") {
                          try { setCalcInput(eval(calcInput).toString()); } catch { alert("Invalid"); }
                        } else { setCalcInput(calcInput + btn); }
                      }}>{btn}</button>
                    ))}
                    <button className="clear-btn" onClick={() => setCalcInput("")}>AC</button>
                  </div>
                </div>
              )}
            </div>
            <div className="top-avatar">{username?.charAt(0).toUpperCase()}</div>
          </div>
        </div>

        <div className="main-content">
          {/* STAT CARDS */}
          <div className="stat-cards">
            <div className="stat-card balance">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <p>Total Balance</p>
                <h2 style={{ color: balance < 0 ? "#EF4444" : "#22C55E" }}>₹{balance.toLocaleString()}</h2>
              </div>
            </div>
            <div className="stat-card income">
              <div className="stat-icon">📈</div>
              <div className="stat-info">
                <p>Total Income</p>
                <h2>₹{income.toLocaleString()}</h2>
              </div>
              <span className="stat-badge income-badge"><FaArrowUp /> Income</span>
            </div>
            <div className="stat-card expense-card">
              <div className="stat-icon">📉</div>
              <div className="stat-info">
                <p>Total Expenses</p>
                <h2>₹{expense.toLocaleString()}</h2>
              </div>
              <span className="stat-badge expense-badge"><FaArrowDown /> Expense</span>
            </div>
            <div className="stat-card budget">
              <div className="stat-icon">🎯</div>
              <div className="stat-info">
                <p>Budget Left</p>
                <h2 style={{ color: remaining < 0 ? "#EF4444" : "#6C3BFF" }}>₹{remaining.toLocaleString()}</h2>
              </div>
              <div className="budget-bar">
                <div className="budget-fill" style={{ width: `${budgetUsed}%`, background: budgetUsed > 80 ? "#EF4444" : "#6C3BFF" }}></div>
              </div>
              <span className="budget-label">{budgetUsed}% used</span>
            </div>
          </div>

          {/* ADD FORM */}
          <div className="add-form-card">
            <h3><FaPlus /> Add Transaction</h3>
            <div className="add-form-grid">
              <input placeholder="Category / Name" value={category} onChange={e => setCategory(e.target.value)} />
              <input type="date" value={date} onChange={e => setDate(e.target.value)} />
              <input placeholder="Person (optional)" value={person} onChange={e => setPerson(e.target.value)} />
              <select value={type} onChange={e => setType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <select value={status} onChange={e => setStatus(e.target.value)}>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cleared">Cleared</option>
              </select>
              <input type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} />
              <button className="add-btn" onClick={handleAddExpense}><FaPlus /> Add</button>
            </div>
          </div>

          {/* MIDDLE ROW: Recent Transactions + Charts */}
          <div className="middle-grid">
            {/* Recent Transactions */}
            <div className="card transactions-card">
              <div className="card-header">
                <h3>Recent Transactions</h3>
                <span className="see-all">See All →</span>
              </div>
              <div className="txn-list">
                {[...expenses].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,6).map(e => (
                  <div key={e._id} className="txn-item">
                    <div className="txn-icon">{getCategoryIcon(e.category)}</div>
                    <div className="txn-details">
                      <p className="txn-name">{e.category}</p>
                      <span className="txn-date">{new Date(e.date).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                    </div>
                    <span className={`txn-amount ${e.type === "income" ? "txn-income" : "txn-expense"}`}>
                      {e.type === "income" ? "+" : "-"}₹{Number(e.amount).toLocaleString()}
                      <span className="txn-arrow">{e.type === "income" ? "↗" : "↘"}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Overview Donut */}
            <div className="card chart-card">
              <div className="card-header">
                <h3>Financial Overview</h3>
              </div>
              <div className="donut-wrapper">
                <PieChart width={260} height={260}>
                  <Pie data={[
                    { name: "Balance", value: Math.max(balance, 0) },
                    { name: "Expenses", value: expense },
                    { name: "Income", value: income }
                  ]} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={3}>
                    <Cell fill="#6C3BFF" />
                    <Cell fill="#EF4444" />
                    <Cell fill="#F59E0B" />
                  </Pie>
                  <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
                </PieChart>
                <div className="donut-center">
                  <p>Total Balance</p>
                  <h3>₹{balance.toLocaleString()}</h3>
                </div>
              </div>
              <div className="donut-legend">
                <span><span className="dot" style={{background:"#6C3BFF"}}></span>Balance</span>
                <span><span className="dot" style={{background:"#EF4444"}}></span>Expenses</span>
                <span><span className="dot" style={{background:"#F59E0B"}}></span>Income</span>
              </div>
            </div>
          </div>

          {/* EXPENSE + INCOME CHARTS ROW */}
          <div className="charts-row">
            <div className="card">
              <div className="card-header">
                <h3>Expense Breakdown</h3>
              </div>
              {categoryData.length > 0 ? (
                <PieChart width={300} height={280}>
                  <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100} label={({name, percent}) => `${name} ${(percent*100).toFixed(0)}%`}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => `₹${v.toLocaleString()}`} />
                </PieChart>
              ) : <p className="empty-chart">No expense data yet</p>}
            </div>

            <div className="card">
              <div className="card-header">
                <h3>Income Sources</h3>
                <span className="see-all">See All →</span>
              </div>
              {incomeData.length > 0 ? (
                <div className="income-sources">
                  {incomeData.map((item, i) => (
                    <div key={i} className="income-source-item">
                      <div className="income-source-left">
                        <span className="income-source-icon">{getCategoryIcon(item.name)}</span>
                        <span>{item.name}</span>
                      </div>
                      <span className="income-source-amount">+₹{item.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : <p className="empty-chart">No income data yet</p>}
            </div>

            {/* INSIGHTS */}
            <div className="card insights-card">
              <div className="card-header">
                <h3>💡 Insights</h3>
              </div>
              <div className="insights-list">
                <div className="insight-item">
                  <span className="insight-label">Savings Rate</span>
                  <span className={`insight-val ${savingsRate < 0 ? "neg" : "pos"}`}>{savingsRate}%</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Budget Used</span>
                  <span className={`insight-val ${budgetUsed > 80 ? "neg" : "pos"}`}>{budgetUsed}%</span>
                </div>
                {topCategory && (
                  <div className="insight-item">
                    <span className="insight-label">Top Expense</span>
                    <span className="insight-val">{topCategory.name}</span>
                  </div>
                )}
                <div className="insight-item">
                  <span className="insight-label">Balance</span>
                  <span className={`insight-val ${balance < 0 ? "neg" : "pos"}`}>₹{balance.toLocaleString()}</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Remaining Budget</span>
                  <span className={`insight-val ${remaining < 0 ? "neg" : "pos"}`}>₹{remaining.toLocaleString()}</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Total Transactions</span>
                  <span className="insight-val">{expenses.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* TREND CHART */}
          <div className="card trend-card">
            <div className="card-header">
              <h3>Last 30 Days Expenses</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={getLast30DaysData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => `₹${v}`} />
                <Bar dataKey="expense" name="Expense" fill="#6C3BFF" radius={[4,4,0,0]} />
                <Bar dataKey="income" name="Income" fill="#F59E0B" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* TRANSACTION TABLE */}
          <div className="card table-card">
            <div className="card-header">
              <h3>All Transactions</h3>
              <div className="tab-group">
                {["all","income","expense","pending"].map(t => (
                  <button key={t} className={`tab-btn ${activeTab === t ? "tab-active" : ""}`} onClick={() => setActiveTab(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Person</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map(e => (
                    <tr key={e._id}>
                      {editId === e._id ? (
                        <>
                          <td><input value={editData.category} onChange={ev => setEditData({...editData, category: ev.target.value})} className="edit-input" /></td>
                          <td><input type="date" value={editData.date} onChange={ev => setEditData({...editData, date: ev.target.value})} className="edit-input" /></td>
                          <td><input value={editData.person || ""} onChange={ev => setEditData({...editData, person: ev.target.value})} className="edit-input" /></td>
                          <td>
                            <select value={editData.type} onChange={ev => setEditData({...editData, type: ev.target.value})} className="edit-input">
                              <option value="expense">Expense</option>
                              <option value="income">Income</option>
                            </select>
                          </td>
                          <td>
                            <select value={editData.status} onChange={ev => setEditData({...editData, status: ev.target.value})} className="edit-input">
                              <option value="paid">Paid</option>
                              <option value="pending">Pending</option>
                              <option value="cleared">Cleared</option>
                            </select>
                          </td>
                          <td><input type="number" value={editData.amount} onChange={ev => setEditData({...editData, amount: ev.target.value})} className="edit-input" /></td>
                          <td className="actions-cell">
                            <button className="action-btn save-btn" onClick={() => handleUpdate(e._id)}><FaCheck /></button>
                            <button className="action-btn cancel-btn" onClick={() => setEditId(null)}><FaTimes /></button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td><span className="cat-cell">{getCategoryIcon(e.category)} {e.category}</span></td>
                          <td>{new Date(e.date).toLocaleDateString('en-IN')}</td>
                          <td>{e.person || "—"}</td>
                          <td><span className={`type-badge ${e.type === "income" ? "type-income" : "type-expense"}`}>{e.type}</span></td>
                          <td><span className={`status-badge status-${e.status}`}>{e.status}</span></td>
                          <td className={e.type === "income" ? "amount-income" : "amount-expense"}>
                            {e.type === "income" ? "+" : "-"}₹{Number(e.amount).toLocaleString()}
                          </td>
                          <td className="actions-cell">
                            <button className="action-btn edit-btn" onClick={() => startEdit(e)}><FaEdit /></button>
                            <button className="action-btn delete-btn" onClick={() => handleDelete(e._id)}><FaTrash /></button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
