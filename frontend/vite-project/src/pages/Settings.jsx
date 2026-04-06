import { useState } from "react";
import "./Sidebarpages.css";

function Settings() {
  const [name, setName] = useState(localStorage.getItem("username") || "");

  const handleSave = () => {
    localStorage.setItem("username", name);
    alert("Name updated!");
    window.location.reload(); // 🔥 update UI instantly
  };

  const handleReset = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="page-title">Settings</h2>

        <label className="section-title">Change Name</label>

        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="primary-btn" onClick={handleSave}>
          Save
        </button>

        <button className="danger-btn" onClick={handleReset}>
          Reset Account
        </button>
      </div>
    </div>
  );
}

export default Settings;