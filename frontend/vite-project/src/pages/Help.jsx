import { useState } from "react";
import "./Help.css";

function Help() {

  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How to add expense?",
      answer: "Fill the form in dashboard and click on Add button."
    },
    {
      question: "How to edit transaction?",
      answer: "Click on edit button in the transactions table and update values."
    },
    {
      question: "How to delete transaction?",
      answer: "Click on delete button in the table."
    },
    {
      question: "How is balance calculated?",
      answer: "Balance = Total Income - Total Expenses."
    }
  ];

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="help-container">

      <div className="help-card">
        <h2>💡 Help Center</h2>
        <p className="help-subtitle">
          Find answers to common questions
        </p>

        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`faq-item ${openIndex === index ? "open" : ""}`}
              onClick={() => toggle(index)}
            >
              <div className="faq-question">
                {faq.question}
                <span>{openIndex === index ? "−" : "+"}</span>
              </div>

              {openIndex === index && (
                <div className="faq-answer">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default Help;