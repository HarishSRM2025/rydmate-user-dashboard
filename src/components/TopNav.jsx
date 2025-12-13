import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../styles/nav.css';

export default function TopNav({ onToggleSidebar, onOpenBooking }) {
  const navigate = useNavigate();
  const [userInitial, setUserInitial] = useState("U");
  function navigateToProfile() {
    navigate('/user/profile')
  }
  useEffect(() => {
    const storedUser = localStorage.getItem("RydmateUserData");

    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);

        // Safely extract name
        const name =(userObj.user.name && String(userObj.user.name)) 

        const initial = name.slice(0, 2).toUpperCase()   || "U";
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

          <button className="user-info" style={{background:'rgba(0,0,0,0)',border:"0",cursor:"pointer",padding:'0'}} onClick={navigateToProfile}>
            <span className="user-avatar">{userInitial}</span>
          </button>

          <button className="btn book-btn" onClick={onOpenBooking}>
            <i className="fas fa-plus"></i> Book Ride
          </button>
        </div>
      </div>
    </header>
  );
}
