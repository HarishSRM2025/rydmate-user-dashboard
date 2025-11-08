import React from "react";
import { jsPDF } from "jspdf";
import "../styles/rideDetails.css";
import { Split } from "lucide-react";

export default function RideModal({ ride, onClose }) {
  if (!ride) return null;
  const trip = ride.route.split("→");
  const vehicleIcon =
    ride.vehicle === "Bike"
      ? "fas fa-motorcycle"
      : ride.vehicle === "Car"
      ? "fas fa-car"
      : "fas fa-truck-pickup";
const handleDownloadPDF = () => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = 595;
  const pageHeight = 842;

  // --- Professional Header with Deep Red ---
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, pageWidth, 140, "F");

  // --- Company Branding ---
  doc.setFontSize(42);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("RYDMATE", 40, 65);

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(255, 255, 255);
  doc.text("Premium Ride Services", 40, 90);

  doc.setFontSize(10);
  doc.text("www.rydmate.com | support@rydmate.com", 40, 110);

  // --- Invoice Info Card (White Box) ---
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(360, 40, 195, 80, 3, 3, "F");
  
  doc.setFontSize(11);
  doc.setTextColor(107, 114, 128);
  doc.setFont("helvetica", "normal");
  doc.text("INVOICE", 375, 60);
  
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(`#${ride.id}`, 375, 85);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(ride.date, 375, 105);

  // --- Main Content Area ---
  let y = 180;

  // --- Section: Trip Details ---
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 38, 38);
  doc.text("Trip Information", 40, y);

  y += 30;

  // Create table for trip details
  const tripData = [
    ["Route", trip[0]+"to"+trip[1]],
    ["Driver Name", ride.driver],
    ["Vehicle Type", ride.vehicle],
    ["Pickup Time", ride.pickupTime || "N/A"],
    ["Drop Time", ride.dropTime || "N/A"],
    ["Distance", ride.distance || "N/A"],
    ["Status", ride.status]
  ];

  // Table styling
  doc.setFillColor(248, 250, 252);
  doc.rect(40, y, pageWidth - 80, 35 * tripData.length, "F");

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);

  tripData.forEach((row, index) => {
    const rowY = y + (index * 35);
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(255, 255, 255);
      doc.rect(40, rowY, pageWidth - 80, 35, "F");
    }

    // Draw horizontal line
    doc.line(40, rowY + 35, pageWidth - 40, rowY + 35);

    // Label
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(row[0], 55, rowY + 22);

    // Value
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.text(row[1], 250, rowY + 22);
  });

  y += (tripData.length * 35) + 40;



//  const pageWidth = doc.internal.pageSize.getWidth();
let summaryY = y; // starting Y position

// Section title
doc.setFontSize(18);
doc.setFont("helvetica", "bold");
doc.setTextColor(220, 38, 38);
doc.text("Payment Summary", 40, summaryY);

summaryY += 25; // spacing after title

// Fare box dimensions
const boxHeight = 50;
const boxX = 40;
const boxWidth = pageWidth - 80;

// Draw Fare box with rounded corners
doc.setFillColor(254, 242, 242);  // light background
doc.setDrawColor(220, 38, 38);    // border color
doc.setLineWidth(1);
doc.roundedRect(boxX, summaryY, boxWidth, boxHeight, 6, 6, "FD");

// Label: "TOTAL FARE" (left-aligned)
doc.setFontSize(11);
doc.setFont("helvetica", "bold");
doc.setTextColor(127, 29, 29);
doc.text("TOTAL FARE", boxX + 20, summaryY + 25);

// Fare Amount (right-aligned)
doc.setFontSize(26);
doc.setFont("helvetica", "bold");
doc.setTextColor(220, 38, 38);
doc.text(`Rs. ${ride.fare}/-`, boxX + boxWidth-30, summaryY + 30, { align: "right" });

  // --- Footer ---
  y = pageHeight - 120;

  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.line(40, y, pageWidth - 40, y);

  y += 25;

  // Footer content
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 38, 38);
  doc.text("Thank you for riding with Rydmate!", 40, y);

  y += 25;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("Customer Support: support@rydmate.com | Phone: +91 1800-XXX-XXXX", 40, y);

  y += 18;
  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("This is a computer-generated invoice. No signature required.", 40, y);

  // --- Page border (optional elegant touch) ---
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(1);
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40);

  // --- Save PDF ---
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
          <div className="modal-row"><span>Route</span><span>{ride.route}</span></div>
          <div className="modal-row"><span>Date</span><span>{ride.date}</span></div>
          <div className="modal-row"><span>Fare</span><span>₹{ride.fare}</span></div>
          <div className="modal-row"><span>Status</span><span>{ride.status}</span></div>
          <div className="modal-row"><span>Vehicle</span><span>{ride.vehicle}</span></div>
          <div className="modal-row"><span>Driver</span><span>{ride.driver}</span></div>
          <div className="modal-row"><span>Pickup Time</span><span>{ride.pickupTime || "N/A"}</span></div>
          <div className="modal-row"><span>Drop Time</span><span>{ride.dropTime || "N/A"}</span></div>
          <div className="modal-row"><span>Distance</span><span>{ride.distance || "N/A"}</span></div>
          <div className="modal-row"><span>Notes</span><span>{ride.notes || "N/A"}</span></div>
        </div>

        <div className="modal-actions">
          <button className="btn-download" onClick={handleDownloadPDF}>
            <i className="fas fa-download"></i> Download Invoice
          </button>
          <button className="btn-close" onClick={onClose}>
            <i className="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </div>
  );
}
