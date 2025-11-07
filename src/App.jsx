import React, { useState } from 'react';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import DashboardOverview from './components/DashboardOverview';
import Rides from './components/Rides';
import Wallet from './components/Wallet';
import Offers from './components/Offers';
import Profile from './components/Profile';
import Support from './components/Support';
import BookRideModal from './components/BookRideModal';

import userData from './data/user.json';
import ridesData from './data/rides.json';
import walletData from './data/wallet.json';
import offersData from './data/offers.json';
import ticketsData from './data/tickets.json';

import './styles/nav.css';
import './styles/sidebar.css';
import './styles/cards.css';
import './styles/modal.css';

const SECTION_COMPONENTS = {
  overview: DashboardOverview,
  rides: Rides,
  wallet: Wallet,
  offers: Offers,
  profile: Profile,
  support: Support,
};

export default function App() {
  const [section, setSection] = useState('overview');
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

  const SectionComp = SECTION_COMPONENTS[section] || DashboardOverview;

  return (
    <div className="app-root">
      <TopNav
        user={userData}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
        onOpenBooking={() => setBookingOpen(true)}
      />
      <div className="main-layout">
        <Sidebar
          current={section}
          onChange={(s) => { setSection(s); setSidebarOpen(false); }}
          open={sidebarOpen}
          onOpenBooking={() => setBookingOpen(true)}
        />
        <main className="main-content">
          <div className="content-wrapper">
            <SectionComp {...commonProps} />
          </div>
        </main>
      </div>

      <BookRideModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        vehicles={['bike','auto','car']}
      />
    </div>
  );
}
