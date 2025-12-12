import React, { useState, useEffect } from "react";
import "../styles/rideCard.css";
import RideModal from "./rideDetails";

export default function Rides({ openBooking }) {
  const [rides, setRides] = useState([]);
  const [selectedRide, setSelectedRide] = useState(null);
  const [loading, setLoading] = useState(true);

  function trimWords(text, limit = 5) {
    if (!text) return "";
    return text.split(" ").slice(0, limit).join(" ");
  }

  const fetchTrips = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("RydmateUserData"));

      if (!userData || !userData.token) {
        console.error("Token missing!");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/trip/my-trips`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setRides(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };
  function formatToAMPM(timeString) {
    if (!timeString) return "N/A";

    let [hours, minutes] = timeString.split(":").map(Number);

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 → 12

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 className="section-title" style={{ margin: 0 }}>My Rides</h2>

        <button className="btn btn-primary" onClick={openBooking}>
          <i className="fas fa-plus"></i> Book New Ride
        </button>
      </div>

      {/* Loading State */}
      {loading && <p>Loading rides...</p>}

      {/* No Rides */}
      {!loading && rides.length === 0 && (
        <p style={{ textAlign: "center", padding: 20 }}>No rides found.</p>
      )}

      {/* Rides List */}
      <div className="card">
        <div className="rides-page-list">
          {rides.map((r) => (
            <div className="rides-page-card" key={r.id}>
              
              {/* Header */}
              <div className="rides-page-header">
                <div className="rides-page-title">
                  <i className={
                    r.vehicle === "Bike"
                      ? "fas fa-motorcycle"
                      : r.vehicle === "Car"
                      ? "fas fa-car"
                      : "fas fa-truck-pickup"
                  }></i>
                  <span>{trimWords(r.pickup_location)}.. → {trimWords(r.drop_location)}..</span>
                </div>

                <span className={`rides-page-badge rides-page-status-${r.status?.toLowerCase()}`}>
                  {r.status}
                </span>
              </div>

              {/* Body */}
              <div className="rides-page-body">
                <div>
                  <span className="rides-page-label">Date</span>
                  <span className="rides-page-value">{r.pickup_date}</span>
                </div>
                <div>
                  <span className="rides-page-label">Time</span>
                  <span className="rides-page-fare">{formatToAMPM(r.pickup_time)}</span>
                </div>
                <div>
                  <span className="rides-page-label">Vehicle</span>
                  <span className="rides-page-value">{r.vehicle || "N/A"}</span>
                </div>

                <div>
                  <span className="rides-page-label">Fare</span>
                  <span className="rides-page-fare">₹{r.fare}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="rides-page-footer">
                <button className="rides-page-btn" onClick={() => setSelectedRide(r)}>
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <RideModal ride={selectedRide} onClose={() => setSelectedRide(null)} />
    </>
  );
}
