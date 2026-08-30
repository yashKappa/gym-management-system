import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { Dumbbell, Sparkles, ShieldAlert, Sun, Moon, PackageCheck } from 'lucide-react';
import './SupplementsFetch.css';

const SupplementsFetch = () => {
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  // Read theme directly from localStorage (defaults to dark mode)
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
    const unsubscribe = onSnapshot(
      collection(db, 'Details', 'Supplements', 'details'),
      (querySnapshot) => {
        const dataList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSupplements(dataList);
        setLoading(false);
        setMessage('Supplements updated.');
        setTimeout(() => setMessage(''), 3000);
      },
      (error) => {
        console.error('❌ Error in real-time update:', error);
        setMessage('Real-time update failed.');
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

  return (
    <div className={`supplements-theme-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
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
      <div className="supplements-header">
        <div className="header-badge">
          <Dumbbell size={14} /> GYM NUTRITION
        </div>
        <h2 className="header-title">Supplements Store</h2>
        <p className="header-subtitle">Browse recommended supplements, proteins, and fitness essentials.</p>
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
          <p>Loading supplements catalog...</p>
        </div>
      ) : supplements.length === 0 ? (
        <div className="empty-state">
          <Sparkles size={38} className="empty-icon" />
          <h3>No Supplements Found</h3>
          <p>There are currently no active supplements listed in the system.</p>
        </div>
      ) : (
        <div className="supplements-grid">
          {supplements.map((item) => (
            <div key={item.id} className="supplement-card">
              <div className="card-image-wrapper">
                <img
                  src={item.image || '/assets/back.png'}
                  alt={item.name || 'Supplement'}
                  className="supplement-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${process.env.PUBLIC_URL}/assets/back.png`;
                  }}
                />
                <span className="stock-badge">
                  <PackageCheck size={12} /> AVAILABLE
                </span>
              </div>

              <div className="card-details">
                <h4 className="supplement-title">{item.name || 'Unnamed Product'}</h4>
                <p className="supplement-description">
                  {item.description || 'No detailed description available for this supplement.'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplementsFetch;