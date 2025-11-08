import React from 'react';
import { NavLink } from "react-router-dom";
import '../styles/sidebar.css';

const items = [
  { path: '/user/overview', icon: 'fa-home', label: 'Dashboard' },
  { path: '/user/rides', icon: 'fa-car', label: 'My Rides' },
  { path: '/user/wallet', icon: 'fa-wallet', label: 'Wallet' },
  { path: '/user/offers', icon: 'fa-ticket-alt', label: 'Offers' },
  { path: '/user/profile', icon: 'fa-user', label: 'Profile' },
  { path: '/user/support', icon: 'fa-headset', label: 'Support' },
];

export default function Sidebar({ open, onOpenBooking, onNavigate }) {
  return (
    <aside className={`sidebar ${open ? 'mobile-open' : ''}`}>
      <nav className="sidebar-nav">

        {items.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onNavigate}
          >
            <i className={`fas ${item.icon}`}></i>
            <span>{item.label}</span>
          </NavLink>
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
