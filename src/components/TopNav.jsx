import React, { useEffect, useState } from 'react';
import '../styles/nav.css';

export default function TopNav({ onToggleSidebar, onOpenBooking }) {
  const [userInitial, setUserInitial] = useState("U");

  useEffect(() => {
    const storedUser = localStorage.getItem("RydmateUserData");

    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);

        // Safely extract name
        const name =(userObj.user.name && String(userObj.user.name)) 

        const initial = name.trim().charAt(0)?.toUpperCase() || "U";
        setUserInitial(initial);

      } catch (err) {
        console.error("Invalid user JSON");
      }
    }
  }, []);

  return (
    <header className="top-nav">
      <div className="nav-content">
        <div className="nav-left">
          <button className="hamburger" onClick={onToggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className="logo"><span>Rydmate</span></div>
        </div>

        <div className="nav-right">
          <button className="notification-btn">
            <i className="fas fa-bell"></i>
            <span className="notification-dot" />
          </button>

          <div className="user-info">
            <div className="user-avatar">{userInitial}</div>
          </div>

          <button className="btn book-btn" onClick={onOpenBooking}>
            <i className="fas fa-plus"></i> Book Ride
          </button>
        </div>
      </div>
    </header>
  );
}
