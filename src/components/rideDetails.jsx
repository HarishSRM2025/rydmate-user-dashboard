import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "../styles/rideDetails.css";
import { useNavigate } from "react-router-dom";

export default function RideModal({ ride, onClose }) {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;
  const userData = JSON.parse(localStorage.getItem("RydmateUserData") || "null");
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    if (!ride || !ride.driverId) {
      setDriver(null);
      return;
    }

    const fetchDriver = async () => {
      try {
        const res = await fetch(`${apiUrl}/api/user/getuser/${ride.driverId}`);
        const data = await res.json();
        setDriver(data);
      } catch (err) {
        console.error("Driver fetch error:", err);
      }
    };

    fetchDriver();
  }, [ride]);

  const Cancel = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/trip/status/${ride.id}`,
        { status: "cancelled" },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Trip Cancelled");
      navigate("/");
      onClose();
    } catch (error) {
      alert(error);
    }
  };

  function formatToAMPM(timeString) {
    if (!timeString) return "N/A";

    let [hours, minutes] = timeString.split(":").map(Number);
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  if (!ride) return null;

  // ---------------------------------------
  // FIXED PDF GENERATOR (WORKS INSIDE MODAL)
  // ---------------------------------------
const handleDownloadPDF = () => {
  setTimeout(() => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.width;

    // HEADER
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, pageWidth, 140, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(255, 255, 255);
    doc.text("RYDMATE", 40, 70);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Premium Ride Services", 40, 95);

    // INVOICE BOX
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(pageWidth - 180, 40, 140, 80, 10, 10, "F");

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - 160, 65);

    doc.setFontSize(12);
    doc.text(`#${ride.id}`, pageWidth - 160, 85);
    doc.text(ride.pickup_date || "", pageWidth - 160, 105);

    // CONTENT START
    let y = 180;
    const containerX = 30;
    const containerWidth = pageWidth - 60;
    const rowHeight = 50;

    const safe = (v) => (v ? String(v) : "N/A");

    // TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Trip Information", containerX, y);
    y += 30;

    // ---------- TABLE DRAW FUNCTION (UPDATED FOR WRAP) ----------
    const drawRow = (label, value) => {
      doc.setFillColor(248, 248, 248);
      doc.rect(containerX, y - 18, containerWidth, rowHeight, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(label, containerX + 10, y);

      doc.setFont("helvetica", "normal");

      // ⭐ WRAP LONG TEXT ⭐
      doc.text(String(value), containerX + 180, y, {
        maxWidth: containerWidth - 200,
      });

      y += rowHeight + 4;
    };

    // ---------- ROWS ----------
    drawRow("Pickup Location", safe(ride.pickup_location));
    drawRow("Drop Location", safe(ride.drop_location));
    drawRow("Pickup Date", safe(ride.pickup_date));
    drawRow("Pickup Time", safe(formatToAMPM(ride.pickup_time)));
    drawRow("Return Date", safe(ride.return_date));
    drawRow("Return Time", safe(formatToAMPM(ride.return_time)));
    drawRow("Vehicle", safe(ride.vehicle));
    drawRow("Trip Type", safe(ride.trip_type));
    drawRow("Status", safe(ride.status));
    drawRow("Driver Name", driver ? safe(driver.name) : "Not Assigned");

    // SPACE
    y += 20;

    // ---------- PAYMENT SUMMARY ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Payment Summary", containerX, y);
    y += 25;

    doc.setFillColor(255, 230, 230);
    doc.roundedRect(containerX, y, containerWidth, 50, 10, 10, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Total Fare", containerX + 15, y + 30);

    doc.setFontSize(20);

    // ⭐ CENTER ALIGN THE FARE ⭐
    doc.text(`₹${safe(ride.fare)}/-`, containerX + containerWidth / 2, y + 32, {
      align: "center",
    });

    // SAVE
    doc.save(`Rydmate_Invoice_${ride.id}.pdf`);
  }, 0);
};



  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-gradient">
          <h2>Trip Details</h2>
          <p>OTP : {ride.otp}</p>
        </div>

        <div className="modal-content-grid">
          <div className="modal-row"><span>Pickup</span><span>{ride.pickup_location}</span></div>
          <div className="modal-row"><span>Drop</span><span>{ride.drop_location}</span></div>
          <div className="modal-row"><span>Pickup Date</span><span>{ride.pickup_date}</span></div>
          <div className="modal-row"><span>Pickup Time</span><span>{formatToAMPM(ride.pickup_time)}</span></div>

          {ride.return_date && (
            <>
              <div className="modal-row"><span>Return Date</span><span>{ride.return_date}</span></div>
              <div className="modal-row"><span>Return Time</span><span>{formatToAMPM(ride.return_time)}</span></div>
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
          ) : ride.status === "pending" ? (
            <button className="btn-download" onClick={Cancel}>
              <i className="fas fa-close"></i> Cancel Ride
            </button>
          ) : (
            <button
              className="btn-download"
              disabled
              style={{ cursor: "not-allowed", background: "#ccc", color: "#000" }}
            >
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
