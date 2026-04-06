import "./ErrorCard.css";

function ErrorCard({ message, showRegister, onClose, onRegister }) {
  if (!message) return null;

  return (
    <div className="error-overlay">
      <div className="error-card">

        <p>{message}</p>

        <div className="error-actions">
          {showRegister && (
            <button className="error-btn primary" onClick={onRegister}>
              Register
            </button>
          )}

          <button className="error-btn" onClick={onClose}>
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

export default ErrorCard;