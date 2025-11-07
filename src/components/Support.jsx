import React from 'react';
import '../styles/support.css';

export default function Support({ tickets }) {
  return (
    <div className="support-page">

      {/* HEADER */}
      <div className="support-page-header">
        <h2 className="support-page-title">Support & Help</h2>
        <button className="support-page-btn-primary">
          <i className="fas fa-plus"></i> New Ticket
        </button>
      </div>

      {/* QUICK ACTION CARDS */}
      <div className="support-page-quick-grid">

        <div className="support-page-quick-card">
          <div className="support-page-quick-icon faq">
            <i className="fas fa-question-circle"></i>
          </div>
          <div>
            <div className="support-page-quick-title">FAQs</div>
            <div className="support-page-quick-sub">Find quick answers</div>
          </div>
        </div>

        <div className="support-page-quick-card">
          <div className="support-page-quick-icon chat">
            <i className="fas fa-comments"></i>
          </div>
          <div>
            <div className="support-page-quick-title">Live Chat</div>
            <div className="support-page-quick-sub">Chat with support</div>
          </div>
        </div>

        <div className="support-page-quick-card">
          <div className="support-page-quick-icon call">
            <i className="fas fa-phone"></i>
          </div>
          <div>
            <div className="support-page-quick-title">Call Support</div>
            <div className="support-page-quick-sub">+91 98765 43210</div>
          </div>
        </div>

      </div>

      {/* URGENT CARD */}
      <div className="support-page-urgent-card">
        <div>
          <h3>Need Urgent Help?</h3>
          <p>Our support team is available 24/7</p>
        </div>
        <button className="support-page-btn-light">
          <i className="fas fa-headset"></i> Contact Now
        </button>
      </div>

      {/* TICKETS LIST */}
      <div className="support-page-ticket-section">
        <h3 className="support-page-section-title">My Support Tickets</h3>

        <div className="support-page-ticket-list">
          {tickets.map(t => (
            <div className="support-page-ticket-card" key={t.id}>
              
              <div className="support-page-ticket-header">
                <span className="support-page-ticket-id">{t.id}</span>
                <span className={`support-page-badge priority-${t.priority.toLowerCase()}`}>
                  {t.priority}
                </span>
              </div>

              <div className="support-page-ticket-subject">{t.subject}</div>

              <div className="support-page-ticket-meta">
                <span className="support-page-ticket-date">{t.date}</span>
                <span className={`support-page-badge status-${t.status.toLowerCase().replace(' ','-')}`}>
                  {t.status}
                </span>
              </div>

              <button className="support-page-btn-primary">View</button>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
