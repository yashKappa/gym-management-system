import React, { useState, useEffect } from 'react';
import { auth } from '../Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';
import Dashboard from './Dashboard';
import ViewPackages from './ViewPackages';
import NotificationFetch from './NotiyFetch';
import SupplementsFetch from './SupplementsFetch';
import ViewDietPlans from './ViewDietPlans';
import '../Admin/Admin.css';
import UserData from './UserData';

function Admin() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(localStorage.getItem('activeSection') || '📊 Dashboard');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isMemberLoggedIn, setIsMemberLoggedIn] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
    setSidebarOpen(false);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Dashboard':
        return <Dashboard onSectionChange={handleSectionChange} />;
      case 'User Data':
        return <UserData />
      case 'Fee Package':
        return <ViewPackages />;
      case 'Notification':
        return <NotificationFetch />;
      case 'Supplement':
        return <SupplementsFetch />;
      case 'Diet Details':
        return <ViewDietPlans />;
      default:
        return <Dashboard onSectionChange={handleSectionChange} />;
    }
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
      console.warn("Admin was not signed in via Firebase:", error.message);
    }

    Cookies.remove('memberName');
    Cookies.remove('memberAccessCode');
    Cookies.remove('adminEmail');

    setIsAdminLoggedIn(false);
    setIsMemberLoggedIn(false);
    navigate('/Dashboard', { replace: true });
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
          { label: 'User Data', icon: 'fa-users' },
          { label: 'Fee Package', icon: 'fa-sack-dollar' },
          { label: 'Notification', icon: 'fa-bell' },
          { label: 'Supplement', icon: 'fa-capsules' },
          { label: 'Diet Details', icon: 'fa-apple-alt' }
        ].map(({ label, icon }) => (
          <div
            key={label}
            onClick={() => handleSectionClick(label)}
            className={`py-2 px-3 mb-2 sidebar-item d-flex align-items-center ${activeSection === label ? 'bg-secondary text-white' : ''} rounded`}
            style={{ cursor: 'pointer' }}
          >
            <i className={`fa-solid ${icon} me-2 d-md-inline`}></i>
            <span>{label}</span>
          </div>
        ))}

        <div className="mt-3 d-block d-md-none">
          {isAdminLoggedIn || isMemberLoggedIn ? (
            <button className="logout btn m-log mt-3 d-block d-md-none" onClick={handleLogout}>
              Logout <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          ) : (
            <>
              <button className="gen w-100 mb-2" onClick={() => navigate('/user-login')}>
                👤 User Login
              </button>
              <button className="gen w-100" onClick={() => navigate('/login')}>
                🔐 Admin Login
              </button>
            </>
          )}
        </div>
      </div>

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

          <div className="d-none d-md-flex gap-2 ms-auto">
            {isAdminLoggedIn || isMemberLoggedIn ? (
              <button className="logout btn d-none d-md-block ms-auto" onClick={handleLogout}>
                Logout <i class="fa-solid fa-right-from-bracket"></i>
              </button>
            ) : (
              <>
                <button className="gen" onClick={() => navigate('/user-login')}>
                  👤 User Login
                </button>
                <button className="gen" onClick={() => navigate('/login')}>
                  🔐 Admin Login
                </button>
              </>
            )}
          </div>
        </nav>

        <div className="p-4">{renderSection()}</div>
      </div>
    </div>
  );
}

export default Admin;
