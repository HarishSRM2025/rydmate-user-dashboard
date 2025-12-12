import React, { useState, useEffect } from 'react';
import '../styles/cards.css';
import RideModal from './rideDetails';

export default function DashboardOverview({ wallet, offers }) {
  const [trips, setTrips] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(true);
  function formatToAMPM(timeString) {
    if (!timeString) return "N/A";

    let [hours, minutes] = timeString.split(":").map(Number);

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 → 12

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }
  function trimWords(text, limit = 4) {
    if (!text) return "";
    return text.split(" ").slice(0, limit).join(" ");
  }


  useEffect(() => {
    async function fetchTrips() {
      try {
        const stored = JSON.parse(localStorage.getItem("RydmateUserData"));
        const token = stored?.token;

        if (!token) {
          console.log("No token found");
          return;
        }

        const res = await fetch( `${import.meta.env.VITE_API_URL}/api/trip/my-trips`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          console.log("API error");
          return;
        }

        const data = await res.json();
        setTrips(data);
        setLoading(false);

      } catch (err) {
        console.log("Error fetching trips", err);
        setLoading(false);
      }
    }

    fetchTrips();
  }, []);

  if (loading) return <p className="loading">Loading trips…</p>;

  const totalRides = trips.length;
  const scheduled = trips.filter(r => r.status === "pending").length;
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
          {trips.map((r) => (
            <div className="ride-card" key={r.id}>
              
              <div className="ride-top">
                <div className="ride-icon">
                  <i className={
                    r.vehicle === "bike" ? "fas fa-motorcycle" :
                    r.vehicle === "car" ? "fas fa-car" :
                    r.vehicle === "auto" ? "fas fa-truck-pickup" :
                    "fas fa-car"
                  }></i>
                </div>

                <div className="ride-info">
                  <div className="ride-location">
                    {trimWords(r.pickup_location)}.. → {trimWords(r.drop_location)}..
                  </div>
                  <div className="ride-date">
                    {r.pickup_date} | {formatToAMPM(r.pickup_time)}
                  </div>
                </div>
              </div>

              <div className="ride-details">
                <div>
                  <span className="lbl">Fare</span>
                  <span className="value">₹{r.fare}</span>
                </div>
                <div>
                  <span className="lbl">Status</span>
                  <span className={`badge status-${r.status}`}>{r.status}</span>
                </div>
              </div>

              <button className="ride-btn" onClick={() => setSelectedRide(r)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      <RideModal ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </>
  );
}
