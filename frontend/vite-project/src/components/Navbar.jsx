import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      
      {/* 🔵 LOGO */}
      <div className="logo">SmartExpense</div>

      {/* 🔵 NAV LINKS */}
      <ul className="nav-links">

        <li>
          <Link to="/#features">Features</Link>
        </li>

        {/* 🔥 SOLUTIONS (MEGA MENU) */}
        <li className="dropdown">
          Solutions

          <div className="mega-menu">

            {/* COLUMN 1 */}
            <div className="menu-column">
              <h3>Use Cases</h3>

              <div className="menu-item">
                <h4>💰 Expense Tracking</h4>
                <p>Track daily spending easily</p>
              </div>

              <div className="menu-item">
                <h4>📊 Budget Planning</h4>
                <p>Control your monthly expenses</p>
              </div>

              <div className="menu-item">
                <h4>📈 Analytics</h4>
                <p>Visual insights & reports</p>
              </div>
            </div>

            {/* COLUMN 2 */}
            <div className="menu-column">
              <h3>For Users</h3>

              <div className="menu-item">
                <h4>👤 Individuals</h4>
                <p>Manage personal finances</p>
              </div>

              <div className="menu-item">
                <h4>👥 Teams</h4>
                <p>Track shared expenses</p>
              </div>

              <div className="menu-item">
                <h4>🏢 Businesses</h4>
                <p>Organize company expenses</p>
              </div>
            </div>

            {/* COLUMN 3 (HIGHLIGHT CARD) */}
            <div className="menu-highlight">
              <h3>🚀 Smart Expense</h3>
              <p>
                Powerful expense tracking with analytics, reports, and smart insights.
              </p>

            <Link to="/login">
  <button className="explore-btn">Explore →</button>
</Link>
            </div>

          </div>
        </li>

        {/* 🔥 RESOURCES (SMALL DROPDOWN) */}
        <li className="dropdown">
          Resources

          <div className="small-menu">

            <div className="menu-item">
              <h4>📝 Blog</h4>
              <p>Finance tips & ideas</p>
            </div>

            <div className="menu-item">
              <h4>📚 Help Center</h4>
              <p>Support & help</p>
            </div>

            <div className="menu-item">
              <h4>📖 Guides</h4>
              <p>Step-by-step tutorials</p>
            </div>

            <div className="menu-item">
              <h4>❓ FAQs</h4>
              <p>Common questions</p>
            </div>

          </div>
        </li>

      </ul>

      {/* 🔵 AUTH BUTTONS */}
      <div className="auth-buttons">
        <Link to="/login">
          <button className="login-btn">Login</button>
        </Link>

        <Link to="/register">
          <button className="register-btn">Register</button>
        </Link>
      </div>

    </nav>
  );
}

export default Navbar;