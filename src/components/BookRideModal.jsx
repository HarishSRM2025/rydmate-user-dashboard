import React, { useState } from 'react';
import '../styles/modal.css';

export default function BookRideModal({ open, onClose, vehicles = [] }) {
  const [selected, setSelected] = useState(null);
  const [tripType, setTripType] = useState('single');

  if (!open) return null;

  function submit() {
    if (!selected) {
      alert('Please select a vehicle type');
      return;
    }
    alert('Ride booked successfully!');
    setSelected(null);
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Book New Ride</h2>
          <button className="modal-close" onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        <div className="modal-body">
          <div className="tabs">
            <button 
              className={`tab-btn ${tripType === 'single' ? 'active' : ''}`}
              onClick={() => setTripType('single')}
            >
              <i className="fas fa-route"></i> Single Trip
            </button>
            <button 
              className={`tab-btn ${tripType === 'round' ? 'active' : ''}`}
              onClick={() => setTripType('round')}
            >
              <i className="fas fa-sync-alt"></i> Round Trip
            </button>
          </div>

          {tripType === 'single' ? (
            // Single Trip Form
            <>
              <div className="form-group">
                <label className="form-label">Pickup Location</label>
                <div className="input-wrapper">
                  <input className="form-input" placeholder="Enter pickup location" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Drop Location</label>
                <div className="input-wrapper">
                  <input className="form-input" placeholder="Enter drop location" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Pickup Date & Time</label>
                <div className="input-wrapper">
                  <input className="form-input" type="datetime-local" />
                </div>
              </div>
            </>
          ) : (
            // Round Trip Form
            <>
              <div className="form-group">
                <label className="form-label">Pickup Location</label>
                <div className="input-wrapper">
                  <input className="form-input" placeholder="Enter pickup location" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Destination</label>
                <div className="input-wrapper">
                  <input className="form-input" placeholder="Enter destination" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Pickup Date & Time</label>
                <div className="input-wrapper">
                  <input className="form-input" type="datetime-local" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Return Date & Time</label>
                <div className="input-wrapper">
                  <input className="form-input" type="datetime-local" />
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <div className="vehicle-grid">
              {vehicles.map(v => (
                <div key={v} className={`vehicle-option ${selected===v ? 'selected' : ''}`} onClick={() => setSelected(v)}>
                  <div className="vehicle-icon">
                    {v==='bike' && <i className="fas fa-motorcycle"></i>}
                    {v==='auto' && <i className="fas fa-truck-pickup"></i>}
                    {v==='car' && <i className="fas fa-car"></i>}
                  </div>
                  <div className="vehicle-name">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-primary" onClick={submit} style={{width:'100%',marginTop:'20px'}}>
            Confirm Booking <i className="fas fa-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
}