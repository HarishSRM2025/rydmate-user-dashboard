import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import ProtectedRoute from "./components/ProtectedRoute";
import RydMateAuth from './components/Auth';


import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import Rides from './components/Rides';
import Wallet from './components/Wallet';
import Offers from './components/Offers';
import Profile from './components/Profile';
import Support from './components/Support';
import BookRideModal from './components/BookRideModal';

// JSON data
import userData from './data/user.json';
import ridesData from './data/rides.json';
import walletData from './data/wallet.json';
import offersData from './data/offers.json';
import ticketsData from './data/tickets.json';

// CSS files
import './styles/nav.css';
import './styles/sidebar.css';
import './styles/cards.css';
import './styles/modal.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const commonProps = {
    user: userData,
    rides: ridesData,
    wallet: walletData,
    offers: offersData,
    tickets: ticketsData,
    openBooking: () => setBookingOpen(true),
  };

  const isLoggedIn = localStorage.getItem("RydmateUserData");

  return (
    <Router>
      <div className="app-root">

        {/* ---- Redirect Root Page ---- */}
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/user/overview" /> : <Navigate to="/auth" />
            }
          />
        </Routes>

        {/* ---- Auth Page ---- */}
        <Routes>
          <Route path="/auth" element={<RydMateAuth/>} />
        </Routes>

        {/* ---- Logged-In Layout ---- */}
        {isLoggedIn && (
          <>
            <TopNav
              user={userData}
              onToggleSidebar={() => setSidebarOpen(v => !v)}
              onOpenBooking={() => setBookingOpen(true)}
            />

            <div className="main-layout">
              <Sidebar
                open={sidebarOpen}
                onOpenBooking={() => setBookingOpen(true)}
                onNavigate={() => setSidebarOpen(false)}
              />

              <main className="main-content">
                <div className="content-wrapper">
                  <Routes>
                    <Route
                      path="/user/overview"
                      element={
                          <DashboardOverview {...commonProps} />
                      }
                    />
                    <Route
                      path="/user/rides"
                      element={
                          <Rides {...commonProps} />
                      }
                    />
                    <Route
                      path="/user/wallet"
                      element={
                          <Wallet {...commonProps} />
                      }
                    />
                    <Route
                      path="/user/offers"
                      element={
                          <Offers {...commonProps} />
                      }
                    />
                    <Route
                      path="/user/profile"
                      element={
                          <Profile {...commonProps} />
                      }
                    />
                    <Route
                      path="/user/support"
                      element={
                          <Support {...commonProps} />
                      }
                    />
                  </Routes>
                </div>
              </main>
            </div>

            <BookRideModal
              open={bookingOpen}
              onClose={() => setBookingOpen(false)}
              vehicles={['bike', 'auto', 'car']}
            />
          </>
        )}
      </div>
    </Router>
  );
}
