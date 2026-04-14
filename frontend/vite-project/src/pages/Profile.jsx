import "./Profile.css";

function Profile() {

  const username = localStorage.getItem("username") || "User";
  const profilePic = localStorage.getItem("profilePic");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  return (
    <div className="profile-container">

      <div className="profile-card">

        {/* ===== PROFILE HEADER ===== */}
        <div className="profile-header">

          {profilePic ? (
            <img src={profilePic} className="profile-img" />
          ) : (
            <div className="profile-initial">
              {username[0]?.toUpperCase()}
            </div>
          )}

          <h2>{username}</h2>

        </div>

        {/* ===== STATS ===== */}
        <div className="profile-stats">

          <div className="stat-box">
            <p>Total Transactions</p>
            <h4>24</h4>
          </div>

          <div className="stat-box">
            <p>Income Entries</p>
            <h4>10</h4>
          </div>

          <div className="stat-box">
            <p>Expense Entries</p>
            <h4>14</h4>
          </div>

        </div>

        {/* ===== LOGOUT ===== */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>

      </div>

    </div>
  );
}

export default Profile;