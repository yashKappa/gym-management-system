import React, { useState, useEffect } from 'react';
import { auth } from '../Firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Dashboard from './Dashboard';
import ViewPackages from './ViewPackages';
import NotificationFetch from './NotiyFetch';
import SupplementsFetch from './SupplementsFetch';
import ViewDietPlans from './ViewDietPlans';
import UserData from './UserData';
import { Sun, Moon } from 'lucide-react';
import '../Admin/Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    localStorage.getItem('activeSection') || 'Dashboard'
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMemberLoggedIn, setIsMemberLoggedIn] = useState(false);

  // Global Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('appTheme');
    return saved ? saved === 'dark' : true;
  });

  // Listener for Theme Updates from Child Components or local changes
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

  // Global Theme Toggle Function
  const handleGlobalThemeToggle = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    localStorage.setItem('appTheme', nextMode ? 'dark' : 'light');
    // Dispatch custom event so child pages update simultaneously
    window.dispatchEvent(new Event('themeChange'));
  };

  const handleSectionClick = (section) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
    setSidebarOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAdminLoggedIn(!!user || !!Cookies.get('adminEmail'));
    });

    const memberName = Cookies.get('memberName');
    const memberCode = Cookies.get('memberAccessCode');
    setIsMemberLoggedIn(!!memberName && !!memberCode);

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn('Admin was not signed in via Firebase:', error.message);
    }

    Cookies.remove('memberName');
    Cookies.remove('memberAccessCode');
    Cookies.remove('adminEmail');

    setIsAdminLoggedIn(false);
    setIsMemberLoggedIn(false);
    navigate('/Dashboard', { replace: true });
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard onSectionChange={handleSectionClick} />;
      case 'User Data':
        return <UserData />;
      case 'Fee Package':
        return <ViewPackages />;
      case 'Notification':
        return <NotificationFetch />;
      case 'Supplement':
        return <SupplementsFetch />;
      case 'Diet Details':
        return <ViewDietPlans />;
      default:
        return <Dashboard onSectionChange={handleSectionClick} />;
    }
  };

  return (
    <div className={`d-flex flex-column flex-md-row min-vh-100 ${isDarkMode ? 'dark-theme-admin' : 'light-theme-admin'}`}>
      
      {/* OVERLAY BACKDROP (Clicking outside sidebar closes it on mobile) */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay d-md-none"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`sidebar p-3 text-white ${sidebarOpen ? 'show' : ''} ${isDarkMode ? 'sidebar-dark' : 'sidebar-light'}`}>
        <div className="d-flex flex-column justify-content-center align-items-center pb-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/g-logo1.png`}
            alt="Gym Logo"
            style={{ width: '120px' }}
            className="d-none d-md-block pt-3"
          />
          <h4 className="name d-none d-md-block">Akatsuki-Gym</h4>
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
            { label: 'User Data', icon: 'fa-users' },
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
            >
              <i className={`fa-solid ${icon} me-2 d-md-inline`}></i>
              <span>{label}</span>
            </div>
          ))}
        </div>

        {/* Mobile Extra Actions */}
        <div className="mt-3 d-block d-md-none">
          <button className="gen mb-2 w-100" onClick={handleGlobalThemeToggle}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? ' Light Mode' : ' Dark Mode'}</span>
          </button>
          {isAdminLoggedIn || isMemberLoggedIn ? (
            <button className="logout-btn" onClick={handleLogout}>
              Logout <i className="fa-solid fa-right-from-bracket"></i>
            </button>
          ) : (
            <>
              <button className="gen mb-2 w-100" onClick={() => navigate('/user-login')}>
                🧑 User Login
              </button>
              <button className="gen w-100" onClick={() => navigate('/login')}>
                🔐 Admin Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <div className="flex-grow-1">
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
            style={{ marginLeft: 'auto' }}
          >
            ☰ Menu
          </button>

          {/* DESKTOP NAVBAR CONTROLS WITH GLOBAL THEME TOGGLE */}
          <div className="d-none d-md-flex gap-2 ms-auto align-items-center">
            <button className="gen" onClick={handleGlobalThemeToggle}>
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
              <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {isAdminLoggedIn || isMemberLoggedIn ? (
              <button className="logout-btn" onClick={handleLogout}>
                Logout <i className="fa-solid fa-right-from-bracket"></i>
              </button>
            ) : (
              <>
                <button className="gen" onClick={() => navigate('/user-login')}>
                  🧑 User Login
                </button>
                <button className="gen" onClick={() => navigate('/login')}>
                  🔐 Admin Login
                </button>
              </>
            )}
          </div>
        </nav>

        <div>{renderSection()}</div>
      </div>
    </div>
  );
}

export default Admin;