import React from 'react';
import '../styles/nav.css';

export default function TopNav({ user, onToggleSidebar, onOpenBooking }) {
  return (
    <header className="top-nav">
      <div className="nav-content">
        <div className="nav-left">
          <button className="hamburger" onClick={onToggleSidebar}><i className="fas fa-bars"></i></button>
          <div className="logo"><span>Rydmate</span></div>
        </div>

        <div className="nav-right">
          <button className="notification-btn"><i className="fas fa-bell"></i><span className="notification-dot"/></button>

          <div className="user-info">
            <div className="user-avatar">{user.initials}</div>
          </div>

          <button className="btn book-btn" onClick={onOpenBooking}><i className="fas fa-plus"></i> Book Ride</button>
        </div>
      </div>
    </header>
  );
}
