import "./Sidebarpages.css";

function Help() {
  return (
    <div className="page-container">
      <div className="card">
        <h2 className="page-title">Help Center</h2>

        <div className="faq">
          <h4>How to add expense?</h4>
          <p>Fill form and click Add</p>
        </div>

        <div className="faq">
          <h4>How to edit?</h4>
          <p>Click edit button in table</p>
        </div>

        <div className="faq">
          <h4>How to delete?</h4>
          <p>Click delete button</p>
        </div>
      </div>
    </div>
  );
}

export default Help;