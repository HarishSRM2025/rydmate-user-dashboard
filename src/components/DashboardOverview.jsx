import React, { useState } from 'react';
import '../styles/cards.css';
import RideModal from './rideDetails';
import ridesData from '../data/rides.json'; // JSON file

export default function DashboardOverview({ wallet, offers }) {
  const [selectedRide, setSelectedRide] = useState(null);

  const totalRides = ridesData.length;
  const scheduled = ridesData.filter(r => r.status.toLowerCase() === 'scheduled').length;
  const activeOffers = offers.filter(o => o.active).length;

  return (
    <>
      <h2 className="section-title">Dashboard Overview</h2>

      <div className="stats-grid">
        <div className="stat-card red">
          <div className="stat-content">
            <div>
              <div className="stat-label">Total Rides</div>
              <div className="stat-value">{totalRides}</div>
            </div>
            <div className="stat-icon"><i className="fas fa-car"></i></div>
          </div>
        </div>

        <div className="stat-card blue">
          <div className="stat-content">
            <div>
              <div className="stat-label">Wallet Balance</div>
              <div className="stat-value">₹{wallet.balance}</div>
            </div>
            <div className="stat-icon"><i className="fas fa-wallet"></i></div>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-content">
            <div>
              <div className="stat-label">Scheduled</div>
              <div className="stat-value">{scheduled}</div>
            </div>
            <div className="stat-icon"><i className="fas fa-calendar"></i></div>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-content">
            <div>
              <div className="stat-label">Active Offers</div>
              <div className="stat-value">{activeOffers}</div>
            </div>
            <div className="stat-icon"><i className="fas fa-tags"></i></div>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="card-title">Recent Rides</h3>
        <div className="rides-container">
          {ridesData.slice(0, 5).map((r) => (
            <div className="ride-card" key={r.id}>
              <div className="ride-top">
                <div className="ride-icon">
                  <i className={`${r.vehicle === "Bike" ? "fas fa-motorcycle" : r.vehicle === "Car" ? "fas fa-car" : "fas fa-truck-pickup"}`}></i>
                </div>
                <div className="ride-info">
                  <div className="ride-location">{r.route}</div>
                  <div className="ride-date">{r.date}</div>
                </div>
              </div>

              <div className="ride-details">
                <div>
                  <span className="lbl">Fare</span>
                  <span className="value">₹{r.fare}</span>
                </div>
                <div>
                  <span className="lbl">Status</span>
                  <span className={`badge status-${r.status.toLowerCase()}`}>{r.status}</span>
                </div>
              </div>

              <button className="ride-btn" onClick={() => setSelectedRide(r)}>View Details</button>
            </div>
          ))}
        </div>
      </div>

      <RideModal ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </>
  );
}
