import React from "react";
import "./Sidebarpages.css";

function Profile() {
  const name = localStorage.getItem("username");
  const email = localStorage.getItem("email");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2 className="page-title">My Profile</h2>

        <p className="text"><strong>Name:</strong> {name}</p>
        <p className="text"><strong>Email:</strong> {email || "Not available"}</p>

        <button className="primary-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;