import { useState } from "react";
import "./Settings.css";

function Settings() {

  const [name, setName] = useState(localStorage.getItem("username") || "User");
  const [email] = useState(localStorage.getItem("email") || "user@gmail.com");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "INR");
  const username = localStorage.getItem("username");
  const [profilePic, setProfilePic] = useState(() => {
  return localStorage.getItem(`profilePic_${username}`) || "";
});


  // Upload image (click on image)
  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    const base64 = reader.result;

    setProfilePic(base64);

    // ✅ SAVE WITH USER-SPECIFIC KEY
    const username = localStorage.getItem("username");
    localStorage.setItem(`profilePic_${username}`, base64);
  };

  reader.readAsDataURL(file);
};

  const handleNameChange = (val) => {
    setName(val);
    localStorage.setItem("username", val);
  };

  const handleCurrencyChange = (val) => {
    setCurrency(val);
    localStorage.setItem("currency", val);
  };

  const handleReset = () => {
    if (!window.confirm("Reset account?")) return;
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="settings-container">

      <h2 className="settings-title">⚙️ Settings</h2>

      <div className="settings-card">

        {/* ===== PROFILE ===== */}
        <div className="profile-section">

          <label htmlFor="upload-photo" className="profile-pic-wrapper">
            {profilePic ? (
              <img src={profilePic} alt="profile" className="profile-pic" />
            ) : (
              <div className="profile-initial">
                {name[0]?.toUpperCase()}
              </div>
            )}
          </label>

          <input
            id="upload-photo"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            hidden
          />

          <input
            className="name-input"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
          />

          <p className="email-text">{email}</p>

        </div>

        {/* ===== PREFERENCES ===== */}
        <div className="pref-section">
          <label>Currency</label>
          <input
            list="currency-options"
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value)}
          />
          <datalist id="currency-options">
            <option value="INR" />
            <option value="USD" />
            <option value="EUR" />
          </datalist>
        </div>

        {/* ===== RESET ===== */}
        <button className="btn-danger" onClick={handleReset}>
          Reset Account
        </button>

      </div>
    </div>
  );
}

export default Settings;