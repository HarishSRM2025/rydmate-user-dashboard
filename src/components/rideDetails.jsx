import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "../styles/rideDetails.css";

export default function RideModal({ ride, onClose }) {
  const [driver, setDriver] = useState(null);

  // -----------------------------
  // ALWAYS KEEP HOOKS AT THE TOP
  // -----------------------------
  useEffect(() => {
    if (!ride || !ride.driverId) {
      setDriver(null);
      return;
    }

    const fetchDriver = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user/getuser/${ride.driverId}`);
        const data = await res.json();
        setDriver(data);
      } catch (err) {
        console.error("Driver fetch error:", err);
      }
    };

    fetchDriver();
  }, [ride]);
  
  function formatToAMPM(timeString) {
    if (!timeString) return "N/A";

    let [hours, minutes] = timeString.split(":").map(Number);

    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 → 12

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  if (!ride) return null;

  const vehicleIcon =
    ride.vehicle === "bike"
      ? "fas fa-motorcycle"
      : ride.vehicle === "car"
      ? "fas fa-car"
      : "fas fa-truck-pickup";

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = 595;

    // HEADER
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, pageWidth, 140, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(255, 255, 255);
    doc.text("RYDMATE", 40, 70);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Premium Ride Services", 40, 95);

    let y = 180;

    // TRIP INFO
    const tripData = [
      ["Pickup Location", ride.pickup_location],
      ["Drop Location", ride.drop_location],
      ["Pickup Date", ride.pickup_date],
      ["Pickup Time", formatToAMPM(ride.pickup_time)],
      ["Return Date", ride.return_date || "N/A"],
      ["Return Time", formatToAMPM(ride.return_time) || "N/A"],
      ["Vehicle", ride.vehicle || "N/A"],
      ["Trip Type", ride.trip_type],
      ["Status", ride.status],
      ["Driver Name", driver ? driver.name : "Not Assigned"],
    ];

    tripData.forEach((row, index) => {
      doc.setFontSize(12);
      doc.text(`${row[0]}: ${row[1]}`, 40, y + index * 20);
    });

    doc.save(`Rydmate_Invoice_${ride.id}.pdf`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-gradient">
          <i className={vehicleIcon}></i>
          <h2>Trip Details</h2>
        </div>

        <div className="modal-content-grid">
          <div className="modal-row"><span>Pickup</span><span>{ride.pickup_location}</span></div>
          <div className="modal-row"><span>Drop</span><span>{ride.drop_location}</span></div>
          <div className="modal-row"><span>Pickup Date</span><span>{ride.pickup_date}</span></div>
          <div className="modal-row"><span>Pickup Time</span><span>{formatToAMPM(ride.pickup_time)}</span></div>

          {ride.return_date && (
            <>
              <div className="modal-row"><span>Return Date</span><span>{ride.return_date}</span></div>
              <div className="modal-row"><span>Return Time</span><span>{formatToAMPM(ride.return_time) || "N/A"}</span></div>
            </>
          )}

          <div className="modal-row"><span>Fare</span><span>₹{ride.fare}</span></div>
          <div className="modal-row"><span>Status</span><span>{ride.status}</span></div>
          <div className="modal-row"><span>Vehicle</span><span>{ride.vehicle}</span></div>
          <div className="modal-row"><span>Trip Type</span><span>{ride.trip_type}</span></div>

          <div className="modal-row">
            <span>Driver</span>
            <span>{driver ? driver.name : "Not Assigned"}</span>
          </div>
        </div>

        <div className="modal-actions">
          {(ride.status === "cancelled" || ride.status === "completed") ? (
            <button className="btn-download" onClick={handleDownloadPDF}>
              <i className="fas fa-download"></i> Download Invoice
            </button>
          ) : (
            <button className="btn-download" disabled style={{ cursor: "not-allowed" }}>
              <i className="fas fa-download"></i> Download Invoice
            </button>
          )}

          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </div>
  );
}
