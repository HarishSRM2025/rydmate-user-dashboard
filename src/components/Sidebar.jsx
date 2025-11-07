import React from 'react';
import '../styles/sidebar.css';

const items = [
  {key:'overview', icon: 'fa-home', label:'Dashboard'},
  {key:'rides', icon: 'fa-car', label:'My Rides'},
  {key:'wallet', icon: 'fa-wallet', label:'Wallet'},
  {key:'offers', icon: 'fa-ticket-alt', label:'Offers'},
  {key:'profile', icon: 'fa-user', label:'Profile'},
  {key:'support', icon: 'fa-headset', label:'Support'}
];

export default function Sidebar({ current, onChange, open, onOpenBooking }) {
  return (
    <aside className={`sidebar ${open ? 'mobile-open' : ''}`}>
      <nav className="sidebar-nav">
        {items.map(i => (
          <button
            key={i.key}
            className={`nav-item ${current === i.key ? 'active' : ''}`}
            onClick={() => onChange(i.key)}
          >
            <i className={`fas ${i.icon}`}></i>
            <span>{i.label}</span>
          </button>
        ))}

        <button className="nav-item book-ride-btn" onClick={onOpenBooking}>
          <i className="fas fa-plus"></i>
          <span>Book Ride</span>
        </button>
      </nav>

      <div className="logout-btn">
        <button className="nav-item">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
