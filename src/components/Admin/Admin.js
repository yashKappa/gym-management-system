import React, { useState } from 'react';
import { auth } from '../Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import Dashboard from './Dashboard';
import Members from './member/Members';
import FeePackage from './FeePackage/FeePackage';
import Notification from './Notification/Notification';
import Supplement from './Supplements/Supplement';
import DietDetails from './DietDetails';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
const [activeSection, setActiveSection] = useState(
  localStorage.getItem('activeSection') || '📊 Dashboard'
);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('adminEmail');
      navigate('/login');
    } catch (error) {
      alert("Logout failed: " + error.message);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Members':
        return <Members />;
      case 'Fee Package':
        return <FeePackage />;
      case 'Notification':
        return <Notification />;
      case 'Supplement':  
        return <Supplement />;
      case 'Diet Details':
        return <DietDetails />;
      default:
        return <Dashboard />;
    }
  };

  const handleSectionClick = (section) => {
  setActiveSection(section);
  localStorage.setItem('activeSection', section); // persist
  setSidebarOpen(false);
};

  return (
    <div className="d-flex flex-column flex-md-row min-vh-100">
      <div className={`sidebar bg-dark text-white p-3 ${sidebarOpen ? 'show' : ''}`}>
      <div className="d-flex flex-column justify-content-center align-items-center pb-4">
  <img
  src={`${process.env.PUBLIC_URL}/assets/g-logo1.png`}
    alt="Gym Logo"
    style={{ width: '120px' }}
    className="d-none d-md-block pt-3"
  />
  <h4 className="text-white d-none d-md-block">Akatsuki-Gym</h4>
</div>

        <button
          className="btn btn-outline-light d-block d-md-none mb-3"
          onClick={() => setSidebarOpen(false)}
        >
          ✕ Close
        </button>

          {[
  { label: 'Dashboard', icon: 'fa-chart-simple' },
  { label: 'Members', icon: 'fa-users' },
  { label: 'Fee Package', icon: 'fa-sack-dollar' },
  { label: 'Notification', icon: 'fa-bell' },
  { label: 'Supplement', icon: 'fa-capsules' },
  { label: 'Diet Details', icon: 'fa-apple-alt' }
].map(({ label, icon }) => (
  <div
    key={label}
    onClick={() => handleSectionClick(label)}
    className={`py-2 px-3 mb-2 sidebar-item d-flex align-items-center ${
      activeSection === label ? 'bg-secondary text-white' : ''
    } rounded`}
    style={{ cursor: 'pointer' }}
  >
    <i className={`fa-solid ${icon} me-2 d-md-inline`}></i>
    <span>{label}</span>
  </div>
))}


        {/* Logout inside sidebar for mobile */}
        <button
          className="m-log btn btn-danger mt-3 d-block d-md-none"
          onClick={handleLogout}
        >
          Logout <i class="fa-solid fa-right-from-bracket"></i>
        </button>
      </div>


      {/* Main Content */}
      <div className="flex-grow-1 bg-light">
        <nav className="navbar navbar-light px-3 justify-content-between align-items-center p-2">

            <img
  src={`${process.env.PUBLIC_URL}/assets/g-logo1.png`}
    alt="Gym Logo"
    style={{ width: '80px' }}
    className="d-block d-md-none"
  />
  
        <button
  className="menu btn btn-outline-dark d-md-none"
  onClick={() => setSidebarOpen(!sidebarOpen)}
  style={{ marginLeft: 'auto' }}
>
  ☰ Menu
</button>

         <button
  className="logout btn d-none d-md-block ms-auto"
  onClick={handleLogout}
>
  Logout <i class="fa-solid fa-right-from-bracket"></i>
</button>

        </nav>

        <div className="p-4">{renderSection()}</div>
      </div>
    </div>
  );
}

export default Admin;
