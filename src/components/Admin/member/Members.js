import React, { useState, useEffect } from 'react';
import Form from './Add';
import MemFetch from './MemFetch';
import { Sun, Moon } from 'lucide-react';
import '../FeePackage/FeePackageForm.css';

const Members = () => {
  // Single Page-Level Theme State
 // 1. Theme State Initialization
const [isDarkMode, setIsDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem('appTheme');
  return savedTheme ? savedTheme === 'dark' : true;
});

// 2. Listen to Global Theme Events from Navbar or Other Pages
useEffect(() => {
  const syncTheme = () => {
    const saved = localStorage.getItem('appTheme');
    setIsDarkMode(saved ? saved === 'dark' : true);
  };

  window.addEventListener('themeChange', syncTheme);
  window.addEventListener('storage', syncTheme);

  return () => {
    window.removeEventListener('themeChange', syncTheme);
    window.removeEventListener('storage', syncTheme);
  };
}, []);

// 3. Child Toggle Action Dispatches Event
const handleThemeToggle = () => {
  setIsDarkMode((prev) => {
    const newMode = !prev;
    localStorage.setItem('appTheme', newMode ? 'dark' : 'light');
    window.dispatchEvent(new Event('themeChange')); // Sync navbar & other components
    return newMode;
  });
};

  return (
    <div className={`fee-package-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="fee-package-container">
        {/* Single Global Theme Toggle */}
        <div className="fee-top-bar">
          <button
            className="theme-toggle-btn"
            onClick={handleThemeToggle}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <h3 className="page-header-title">👥 Gym Members</h3>

        {/* Member Form Component */}
        <Form isDarkMode={isDarkMode} />

        {/* Member Fetch & List Component */}
        <MemFetch isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default Members;