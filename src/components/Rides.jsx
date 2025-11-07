import React from 'react';
import '../styles/rideCard.css';


export default function Rides({ rides, openBooking }) {
  return (
    <>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <h2 className="section-title" style={{margin:0}}>My Rides</h2>
        <button className="btn btn-primary" onClick={openBooking}><i className="fas fa-plus"></i> Book New Ride</button>
      </div>

      <div className="card">
        <div className="rides-page-list">
            {rides.map(r => (
                <div className="rides-page-card" key={r.id}>
                
                <div className="rides-page-header">
                    <div className="rides-page-title">
                    <i className="fas fa-route"></i>
                    <span>{r.route}</span>
                    </div>
                    <span className={`rides-page-badge rides-page-status-${r.status.toLowerCase()}`}>
                    {r.status}
                    </span>
                </div>

                <div className="rides-page-body">
                    <div>
                    <span className="rides-page-label">Date</span>
                    <span className="rides-page-value">{r.date}</span>
                    </div>

                    <div>
                    <span className="rides-page-label">Driver</span>
                    <span className="rides-page-value">{r.driver}</span>
                    </div>

                    <div>
                    <span className="rides-page-label">Vehicle</span>
                    <span className="rides-page-value">{r.vehicle}</span>
                    </div>

                    <div>
                    <span className="rides-page-label">Fare</span>
                    <span className="rides-page-fare">₹{r.fare}</span>
                    </div>
                </div>

                <div className="rides-page-footer">
                    <button className="rides-page-btn">View Details</button>
                </div>

                </div>
            ))}
            </div>


      </div>
    </>
  );
}
