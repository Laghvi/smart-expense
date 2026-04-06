import heroImage from "../assets/Images/expense-hero.png";
import Navbar from "../components/Navbar";
import "./Home.css";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

function Home() {

  // 🔥 SCROLL LOGIC
  const location = useLocation();

  useEffect(() => {
    if (location.hash === "#features") {
      const el = document.getElementById("features");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="hero">

        <div className="hero-left">

          <h1 className="hero-title">

            <span className="hero-cursive">
              Paisa udta nahi…
            </span>

            <br />

            <span className="hero-main">
              SmartExpense sab pakad leta hai.
            </span>

          </h1>

          <p className="hero-subtitle">
            Track your expenses, manage budgets, and understand your finances
            with powerful analytics.
          </p>

          <Link to="/register">
            <button className="hero-btn">Get Started</button>
          </Link>

        </div>

        <div className="hero-right">
          <img src={heroImage} alt="expense illustration" />
        </div>

      </section>

      {/* FEATURES */}
      <section id="features" className="features">

        <h2>Powerful Features</h2>

        <div className="features-grid">

          <div className="feature-card">
            <ion-icon name="wallet-outline" className="feature-icon"></ion-icon>
            <h3>Expense Tracking</h3>
            <p>Track daily expenses and understand where your money goes.</p>
          </div>

          <div className="feature-card">
            <ion-icon name="card-outline" className="feature-icon"></ion-icon>
            <h3>Budget Planning</h3>
            <p>Create monthly budgets and control overspending easily.</p>
          </div>

          <div className="feature-card">
            <ion-icon name="analytics-outline" className="feature-icon"></ion-icon>
            <h3>Financial Analytics</h3>
            <p>Visualize your spending patterns using charts and reports.</p>
          </div>

          <div className="feature-card">
            <ion-icon name="trending-up-outline" className="feature-icon"></ion-icon>
            <h3>Investment Tracking</h3>
            <p>Monitor your investments and grow your savings smartly.</p>
          </div>

          <div className="feature-card">
            <ion-icon name="cash-outline" className="feature-icon"></ion-icon>
            <h3>Lending Tracker</h3>
            <p>Track money you lent or borrowed from friends.</p>
          </div>

          <div className="feature-card">
            <ion-icon name="bulb-outline" className="feature-icon"></ion-icon>
            <h3>Smart Insights</h3>
            <p>AI powered suggestions to improve your financial habits.</p>
          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">

        <h2>How SmartExpense Works</h2>

        <div className="steps">

          <div className="step">
            <div className="step-icon">
              <ion-icon name="person-add-outline"></ion-icon>
            </div>
            <h3>Create Account</h3>
            <p>Sign up and securely connect your financial accounts.</p>
          </div>

          <div className="step">
            <div className="step-icon">
              <ion-icon name="wallet-outline"></ion-icon>
            </div>
            <h3>Track Expenses</h3>
            <p>Add transactions and categorize spending automatically.</p>
          </div>

          <div className="step">
            <div className="step-icon">
              <ion-icon name="analytics-outline"></ion-icon>
            </div>
            <h3>Analyze Finances</h3>
            <p>Understand spending patterns with charts and insights.</p>
          </div>

        </div>

      </section>

      {/* CTA */}
      <div className="cta-wrapper">
        <section className="cta">

          <h2>Start Managing Your Money Today</h2>

          <p>
            Join thousands of users already tracking their finances smarter.
          </p>

          <Link to="/register">
            <button className="cta-btn">
              Create Free Account
            </button>
          </Link>

        </section>
      </div>

    </>
  );
}

export default Home;