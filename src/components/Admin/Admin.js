import React, { useState, useEffect } from 'react';
import { auth } from '../Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Sun, Moon } from 'lucide-react';

import Dashboard from './Dashboard';
import Members from './member/Members';
import FeePackage from './FeePackage/FeePackage';
import Notification from './Notification/Notification';
import Supplement from './Supplements/Supplement';
import DietDetails from './Diets/DietDetails';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem('activeSection') || 'Dashboard'
  );

  // Initialize theme state synchronized with localStorage ('appTheme')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // Event Listeners for Theme Synchronization across components
  useEffect(() => {
    const handleThemeSync = () => {
      const currentTheme = localStorage.getItem('appTheme');
      setIsDarkMode(currentTheme ? currentTheme === 'dark' : true);
    };

    window.addEventListener('themeChange', handleThemeSync);
    window.addEventListener('storage', handleThemeSync);

    return () => {
      window.removeEventListener('themeChange', handleThemeSync);
      window.removeEventListener('storage', handleThemeSync);
    };
  }, []);

  // Global Theme Toggle
  const handleGlobalThemeToggle = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('appTheme', nextMode ? 'dark' : 'light');
    window.dispatchEvent(new Event('themeChange'));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn('Logout check:', error.message);
    }

    Cookies.remove('memberName');
    Cookies.remove('memberAccessCode');
    Cookies.remove('adminEmail');
    localStorage.removeItem('adminEmail');

    navigate('/start', { replace: true });
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
    setSidebarOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard onSectionChange={handleSectionClick} />;
      case 'Members':
      case 'User Data':
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
        return <Dashboard onSectionChange={handleSectionClick} />;
    }
  };

  return (
    <div className={`d-flex flex-column flex-md-row min-vh-100 ${isDarkMode ? 'dark-theme-admin' : 'light-theme-admin'}`}>
      
      {sidebarOpen && (
        <div 
          className="sidebar-overlay d-md-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* SIDEBAR */}
      <div className={`sidebar p-3 ${sidebarOpen ? 'show' : ''} ${isDarkMode ? 'sidebar-dark' : 'sidebar-light'}`}>
        <div className="d-flex flex-column justify-content-center align-items-center pb-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/g-logo1.png`}
            alt="Gym Logo"
            style={{ width: '120px' }}
            className="d-none d-md-block pt-3"
          />
          <h4 className="sidebar-brand-title d-none d-md-block">Akatsuki-Gym</h4>
        </div>

        <div className="close-btn">
          <button
            className="close"
            onClick={() => setSidebarOpen(false)}
          >
            ✕ Close
          </button>
        </div>

         <div className="logo-img">
          <img
            src={`${process.env.PUBLIC_URL}/assets/g-logo1.png`}
            alt="Gym Logo"
            style={{ width: '120px' }}
          />
          <h4 className="sidebar-brand-title d-none d-md-block">Akatsuki-Gym</h4>
        </div>

        <div className="nav-items-wrapper">
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
                activeSection === label ? 'active' : ''
              }`}
              style={{ cursor: 'pointer' }}
            >
              <i className={`fa-solid ${icon} me-2 d-md-inline`}></i>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Mobile Sidebar Bottom Controls */}
        <div className="mb-3 d-block d-md-none">
          <button className="gen mb-2 w-100" onClick={handleGlobalThemeToggle}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? ' Light Mode' : ' Dark Mode'}</span>
          </button>
          
          <button className="logout-btn m-log w-100" onClick={handleLogout}>
            Logout <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </div>

      {/* MAIN VIEWPORT CONTAINER */}
      <div className="flex-grow-1">
        {/* TOP NAVBAR (Only Dark/Light Toggle + Logout Button) */}
        <nav className={`navbar px-3 justify-content-between align-items-center p-2 ${isDarkMode ? 'navbar-dark' : 'navbar-light'}`}>
          <img
            src={`${process.env.PUBLIC_URL}/assets/g-logo1.png`}
            alt="Gym Logo"
            style={{ width: '80px' }}
            className="d-block d-md-none"
          />

          <button
            className="menu d-md-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰ Menu
          </button>

          {/* Desktop Controls: Theme Toggle & Logout ONLY */}
          <div className="logout d-none d-md-flex align-items-center gap-2 ms-auto">
            <button className="gen" onClick={handleGlobalThemeToggle}>
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button className="logout-btn" onClick={handleLogout}>
              Logout <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          </div>
        </nav>

        <div className="context">{renderSection()}</div>
      </div>
    </div>
  );
}

export default Admin;