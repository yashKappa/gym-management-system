import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../Firebase';
import { Bell, Sparkles, ShieldAlert, CheckCircle2, Info, AlertTriangle, Sun, Moon } from 'lucide-react';
import './NotificationFetch.css';

const badgeAccents = ['info', 'primary', 'success', 'warning'];

const NotificationFetch = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  // Read theme preference from localStorage on initial load
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

  useEffect(() => {
    const q = query(collection(db, 'Details', 'Notifications', 'details'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(list);
        setLoading(false);
        setMessage('Notifications updated in real-time.');
        setTimeout(() => setMessage(''), 3000);
      },
      (error) => {
        console.error('❌ Error fetching notifications:', error);
        setMessage('Failed to load notifications.');
        setTimeout(() => setMessage(''), 3000);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRef.current.focus();
    }
  }, [message]);

  const getAccentIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={18} />;
      case 'success':
        return <CheckCircle2 size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className={`notifications-theme-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      {/* THEME TOGGLE BUTTON */}
      <button 
        className="theme-toggle-btn" 
        onClick={handleThemeToggle}
        title="Toggle Light/Dark Mode"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      {/* HEADER SECTION */}
      <div className="notifications-header">
        <div className="header-badge">
          <Bell size={14} /> ANNOUNCEMENTS & ALERTS
        </div>
        <h2 className="header-title">System Notifications</h2>
        <p className="header-subtitle">Stay updated with broadcast messages and gym alerts.</p>
      </div>

      {/* ALERT TOAST */}
      {message && (
        <div ref={messageRef} tabIndex={-1} className="theme-toast">
          <ShieldAlert size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* CONTENT AREA */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching latest notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <Sparkles size={38} className="empty-icon" />
          <h3>No Notifications Found</h3>
          <p>There are currently no broad alerts or messages posted.</p>
        </div>
      ) : (
        <div className="notifications-grid">
          {notifications.map((notif, idx) => {
            const accentClass = badgeAccents[idx % badgeAccents.length];
            return (
              <div key={notif.id} className={`notification-card accent-${accentClass}`}>
                <div className="card-header-bar">
                  <div className="card-title-group">
                    <span className="accent-icon-bubble">
                      {getAccentIcon(accentClass)}
                    </span>
                    <h4 className="notif-title">{notif.title || 'Untitled Notice'}</h4>
                  </div>
                  <span className="notif-badge">{accentClass.toUpperCase()}</span>
                </div>

                <div className="card-body-content">
                  <p className="notif-message">{notif.msg || 'No message content provided.'}</p>
                </div>

                {notif.timestamp && (
                  <div className="card-footer-meta">
                    <span>{new Date(notif.timestamp).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NotificationFetch;