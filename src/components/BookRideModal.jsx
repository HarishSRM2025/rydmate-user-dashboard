import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/modal.css";

export default function BookRideModal({ open, onClose, vehicles = [] }) {

  const apiUrl = import.meta.env.VITE_API_URL || "";
  const OLA_KEY = import.meta.env.VITE_OLA_API_KEY;

  const [selected, setSelected] = useState(null);
  const [tripType, setTripType] = useState("single");

  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [dropSuggestions, setDropSuggestions] = useState([]);

  const [pickupCoords, setPickupCoords] = useState(null); 
  const [dropCoords, setDropCoords] = useState(null);

  const [distance, setDistance] = useState(null); 
  const [fare, setFare] = useState(null);

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [loading, setLoading] = useState(false);

  const pickupWrapperRef = useRef(null);
  const dropWrapperRef = useRef(null);

  const FARES = {
    bike: { base: 20, per_km: 6, min: 20 },
    auto: { base: 30, per_km: 10, min: 30 },
    car: { base: 50, per_km: 15, min: 50 },
  };

  function debounce(fn, wait = 300) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }

  const latitude = 12.9716;
  const longitude = 77.5946;
  const radius = 50000;

  async function requestAutocomplete(query) {
    if (!OLA_KEY) {
      console.warn("VITE_OLA_MAP_KEY not set.");
      return [];
    }
    if (!query || query.length < 1) return [];

    const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
      query
    )}&language=en&api_key=${OLA_KEY}&location=${latitude}%2C${longitude}&radius=${radius}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error("Autocomplete failed:", res.status, await res.text());
        return [];
      }
      const data = await res.json();
      return data.predictions || [];
    } catch (err) {
      console.error("Autocomplete error:", err);
      return [];
    }
  }

  const debouncedPickup = debounce(async (q) => {
    const preds = await requestAutocomplete(q);
    setPickupSuggestions(preds);
  }, 300);

  const debouncedDrop = debounce(async (q) => {
    const preds = await requestAutocomplete(q);
    setDropSuggestions(preds);
  }, 300);

  async function getPlaceDetails(place_id) {
    if (!OLA_KEY) return null;
    try {
      const url = `https://api.olamaps.io/places/v1/details?place_id=${encodeURIComponent(
        place_id
      )}&api_key=${OLA_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.error("Place details failed:", res.status, await res.text());
        return null;
      }
      const data = await res.json();

      const loc = data?.result?.geometry?.location;
      if (loc && loc.lat != null && loc.lng != null) return { lat: loc.lat, lng: loc.lng };
      // fallback
      if (data?.result?.geometry?.lat && data?.result?.geometry?.lng) {
        return { lat: data.result.geometry.lat, lng: data.result.geometry.lng };
      }
      return null;
    } catch (err) {
      console.error("getPlaceDetails error:", err);
      return null;
    }
  }

  async function useCurrentLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPickupCoords({ lat, lng });

        if (!OLA_KEY) {
          setPickupLocation(`Lat: ${lat}, Lng: ${lng}`);
          return;
        }

        try {
          const url = `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat}%2C${lng}&language=en&api_key=${OLA_KEY}`;
          const res = await fetch(url);
          if (!res.ok) {
            console.warn("Reverse geocode failed:", res.status, await res.text());
            setPickupLocation(`Lat: ${lat}, Lng: ${lng}`);
            return;
          }
          const data = await res.json();
          const place = data.results?.[0]?.formatted_address || data.results?.[0]?.name || `Lat:${lat}, Lng:${lng}`;
          setPickupLocation(place);
        } catch (err) {
          console.error("Reverse geocode error:", err);
          setPickupLocation(`Lat: ${lat}, Lng: ${lng}`);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Unable to get your location. Please enable location services.");
      },
      { timeout: 10000 }
    );
  }

  async function fetchDistanceMatrix(orig, dest) {

    if (!OLA_KEY || !orig || !dest) return null;

    const origins = `${orig.lat},${orig.lng}`;
    const destinations = `${dest.lat},${dest.lng}`;

    const url = `https://api.olamaps.io/routing/v1/distanceMatrix?origins=${encodeURIComponent(
      origins
    )}&destinations=${encodeURIComponent(destinations)}&mode=driving&api_key=${OLA_KEY}`;

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error("DistanceMatrix fail:", res.status, await res.text());
        return null;
      }
      const data = await res.json();
      const meters = data?.rows?.[0]?.elements?.[0]?.distance;
      if (meters == null) return null;
      const km = meters / 1000;
      return km; 
    } catch (err) {
      console.error("DistanceMatrix error:", err);
      return null;
    }
  }

  function calculateFare(km, vehicleKey) {
    if (!km || !vehicleKey) return null;
    const cfg = FARES[vehicleKey] || FARES.car;
    const raw = cfg.base + cfg.per_km * km;
    const computed = Math.round(raw); 
    return Math.max(computed, cfg.min || cfg.base);
  }

  // when both coords available -> fetch distance & compute fare
  useEffect(() => {
    let mounted = true;
    async function getDistAndFare() {
      setDistance(null);
      setFare(null);
      if (!pickupCoords || !dropCoords) return;

      const km = await fetchDistanceMatrix(pickupCoords, dropCoords);
      if (!mounted) return;
      if (km != null) {
        const kmRounded = Number(km.toFixed(2));
        setDistance(kmRounded.toFixed(2));
        // compute fare for currently selected vehicle (if any), else show for default 'car'
        const vehicleKey = selected || "car";
        const computedFare = calculateFare(kmRounded, vehicleKey);
        setFare(computedFare);
      } else {
        setDistance(null);
        setFare(null);
      }
    }
    getDistAndFare();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupCoords, dropCoords, selected]);

  function opt() {
  const number = Math.floor(1000 + Math.random() * 9000);
  return number.toString();
}

  // ---------------- SUBMIT ----------------
  const submit = async () => {
    if (!selected) return alert("Please select a vehicle type");
    if (!pickupLocation || !dropLocation) return alert("Please enter pickup & drop");
    if (!pickupDate || !pickupTime) return alert("Please select pickup date & time");

    const userData = JSON.parse(localStorage.getItem("RydmateUserData") || "null");
    if (!userData) return alert("User not logged in!");

    const payload = {
      userId: userData.user.id,
      trip_type: tripType === "single" ? "normal" : "round",
      pickup_location: pickupLocation,
      drop_location: dropLocation,
      pickup_date: pickupDate,
      pickup_time: pickupTime,
      distance_km: distance,
      opt:opt(),
      fare: tripType === "single" ? calculateFare(distance,selected) : Math.round(calculateFare(distance,selected)),
      vehicle: selected,
    };

    if (tripType === "round") {
      if (!returnDate || !returnTime) return alert("Please select return date & time");
      payload.return_date = returnDate;
      payload.return_time = returnTime;
    }

    try {
      setLoading(true);
      await axios.post(`${apiUrl}/api/trip/create`, payload, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Ride booked successfully!");
      // reset
      setSelected(null);
      setPickupLocation("");
      setDropLocation("");
      setPickupCoords(null);
      setDropCoords(null);
      setDistance(null);
      setFare(null);
      setPickupDate("");
      setPickupTime("");
      setReturnDate("");
      setReturnTime("");
      onClose();
    } catch (err) {
      console.error("Booking error:", err);
      alert(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- CLICK OUTSIDE CLOSE ----------------
  useEffect(() => {
    function handleClick(e) {
      if (pickupWrapperRef.current && !pickupWrapperRef.current.contains(e.target)) {
        setPickupSuggestions([]);
      }
      if (dropWrapperRef.current && !dropWrapperRef.current.contains(e.target)) {
        setDropSuggestions([]);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        {/* header */}
        <div className="modal-header">
          <h2 className="modal-title">Book New Ride</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="modal-body">
          {/* tabs */}
          <div className="tabs">
            <button className={`tab-btn ${tripType === "single" ? "active" : ""}`} onClick={() => setTripType("single")}>
              <i className="fas fa-route" /> Single Trip
            </button>
            <button className={`tab-btn ${tripType === "round" ? "active" : ""}`} onClick={() => setTripType("round")}>
              <i className="fas fa-sync-alt" /> Round Trip
            </button>
          </div>

          {/* Pickup */}
          <div className="form-group" ref={pickupWrapperRef} style={{ position: "relative" }}>
            <label className="form-label">Pickup Location</label>
            <div className="pickup-row">
              <input
                className="form-input"
                value={pickupLocation}
                placeholder="Enter pickup location"
                onChange={(e) => {
                  const v = e.target.value;
                  setPickupLocation(v);
                  debouncedPickup(v);
                }}
                aria-label="Pickup location"
                style={{ flex: 1 }}
              />
              <button className="loc-btn" type="button" onClick={useCurrentLocation}>
                <i class="fa-solid fa-location-crosshairs"></i> 
              </button>
            </div>

            {pickupSuggestions.length > 0 && (
              <ul className="suggestion-box">
                {pickupSuggestions.map((s, i) => (
                  <li
                    key={s.place_id || i}
                    onClick={async () => {
                      setPickupLocation(s.description || s.name || "");
                      setPickupSuggestions([]);
                      const coords = await getPlaceDetails(s.place_id);
                      if (coords) setPickupCoords(coords);
                    }}
                  >
                    {s.description || s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Drop */}
          <div className="form-group" ref={dropWrapperRef} style={{ position: "relative" }}>
            <label className="form-label">Drop Location</label>
            <input
              className="form-input"
              value={dropLocation}
              placeholder="Enter drop location"
              onChange={(e) => {
                const v = e.target.value;
                setDropLocation(v);
                debouncedDrop(v);
              }}
              aria-label="Drop location"
            />
            {dropSuggestions.length > 0 && (
              <ul className="suggestion-box">
                {dropSuggestions.map((s, i) => (
                  <li
                    key={s.place_id || i}
                    onClick={async () => {
                      setDropLocation(s.description || s.name || "");
                      setDropSuggestions([]);
                      const coords = await getPlaceDetails(s.place_id);
                      if (coords) setDropCoords(coords);
                    }}
                  >
                    {s.description || s.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* date & time */}
          <div className="form-group">
            <label className="form-label">Pickup Date & Time</label>
            <div className="input-wrapper DateTime">
              <input className="form-input" type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
              <input className="form-input" type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
            </div>
          </div>

          {/* return */}
          {tripType === "round" && (
            <div className="form-group">
              <label className="form-label">Return Date & Time</label>
              <div className="input-wrapper DateTime">
                <input className="form-input" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                <input className="form-input" type="time" value={returnTime} onChange={(e) => setReturnTime(e.target.value)} />
              </div>
            </div>
          )}

          {/* vehicle selection */}
          <div className="form-group">
            <label className="form-label">Vehicle Type</label>
            <div className="vehicle-grid">
              {/* default to provided vehicles array; if none, show keys from FARES */}
              {(vehicles.length ? vehicles : Object.keys(FARES)).map((v) => (
                <div
                  key={v}
                  className={`vehicle-option ${selected === v ? "selected" : ""}`}
                  onClick={() => {
                    setSelected(v);
                    // recalc fare if distance already present
                    if (distance != null) {
                      const computedFare = calculateFare(Number(distance), v);
                      setFare(computedFare);
                    }
                  }}
                >
                  <div className="vehicle-icon">
                    {v === "bike" && <i className="fas fa-motorcycle" />}
                    {v === "auto" && <i className="fas fa-truck-pickup" />}
                    {v === "car" && <i className="fas fa-car" />}
                  </div>
                  <div className="vehicle-name">
                      {v} <br />
                      {distance && (
                        <>
                          <p>{tripType === 'single' ? `${distance} Km` : `${distance * 2} Km`}</p>
                          <p>
                            Rs.{tripType == 'single' ? calculateFare(distance,v) : calculateFare(distance,v)*2.5}
                          </p>
                        </>
                      )}
                    </div>

                </div>
              ))}
            </div>
          </div>

          {/* confirm button */}
          <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ width: "100%", marginTop: 20 }}>
            {loading ? "Booking..." : "Confirm Booking"} <i className="fas fa-arrow-right" />
          </button>
        </div>
      </div>
    </div>
  );
}
