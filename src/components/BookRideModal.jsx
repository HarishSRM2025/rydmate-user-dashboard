import React, { useState } from 'react';
import axios from 'axios';
import '../styles/modal.css';

export default function BookRideModal({ open, onClose, vehicles = [] }) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [selected, setSelected] = useState(null);
  const [tripType, setTripType] = useState('single');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    if (!selected) {
      alert('Please select a vehicle type');
      return;
    }
    if (!pickupLocation || !dropLocation || !pickupDate || !pickupTime) {
      alert('Please fill all required fields');
      return;
    }

    const userData = JSON.parse(localStorage.getItem('RydmateUserData'));
    if (!userData) {
      alert('User not logged in!');
      return;
    }

    const payload = {
      userId: userData.user.id,
      trip_type: tripType === 'single' ? 'normal' : 'round',
      pickup_location: pickupLocation,
      drop_location: dropLocation,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      vehicle: selected
    };

    if (tripType === 'round') {
      if (!returnDate || !returnTime) {
        alert('Please select return date and time for round trip');
        return;
      }
      payload.return_date = returnDate;
      payload.return_time = returnTime;
    }

    try {
      setLoading(true);
      const res = await axios.post(`${apiUrl}/api/trip/create`, payload,
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json"
          }
        });
      alert('Ride booked successfully!');
      setSelected(null);
      setPickupLocation('');
      setDropLocation('');
      setPickupDate('');
      setPickupTime('');
      setReturnDate('');
      setReturnTime('');
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

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

          {/* Pickup & Drop */}
          <div className="form-group">
            <label className="form-label">Pickup Location</label>
            <div className="input-wrapper">
              <input className="form-input" value={pickupLocation} onChange={e => setPickupLocation(e.target.value)} placeholder="Enter pickup location" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">{tripType === 'single' ? 'Drop Location' : 'Destination'}</label>
            <div className="input-wrapper">
              <input className="form-input" value={dropLocation} onChange={e => setDropLocation(e.target.value)} placeholder="Enter drop location" />
            </div>
          </div>

          {/* Pickup Date & Time */}
          <div className="form-group">
            <label className="form-label">Pickup Date & Time</label>
            <div className="input-wrapper DateTime">
              <input className="form-input" type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} />
              <input className="form-input" type="time" value={pickupTime} onChange={e => setPickupTime(e.target.value)} />
            </div>
          </div>

          {/* Round trip return */}
          {tripType === 'round' && (
            <div className="form-group">
              <label className="form-label">Return Date & Time</label>
              <div className="input-wrapper DateTime">
                <input className="form-input" type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} />
                <input className="form-input" type="time" value={returnTime} onChange={e => setReturnTime(e.target.value)} />
              </div>
            </div>
          )}

          {/* Vehicle */}
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

          <button className="btn btn-primary" onClick={submit} style={{width:'100%', marginTop:'20px'}} disabled={loading}>
            {loading ? 'Booking...' : 'Confirm Booking'} <i className="fas fa-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
