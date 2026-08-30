import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { Check, Clock, ShieldAlert, Sparkles, Dumbbell, Star, ChevronRight, Sun, Moon } from 'lucide-react';
import './ViewPackages.css';

const planBadges = ['STARTER', 'POPULAR', 'PRO CHOICE', 'ULTIMATE'];

const ViewPackages = () => {
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);
  const id = 'pack';
  // 1. Read theme preference from localStorage on initial load
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
      collection(db, 'Details', id, 'details'),
      (snapshot) => {
        const packageList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPackages(packageList);
        setMessage('Packages synchronized.');
        setTimeout(() => setMessage(''), 3000);
      },
      (error) => {
        console.error('❌ Error with real-time update:', error);
        setMessage('Real-time update failed.');
        setTimeout(() => setMessage(''), 3000);
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

  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/[^0-9,.]/g, '');
  };

  return (
    <div className={`packages-theme-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
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
      <div className="packages-header">
        <div className="header-badge">
          <Dumbbell size={14} /> GYM MEMBERSHIPS
        </div>
        <h2 className="header-title">Select Your Fitness Plan</h2>
        <p className="header-subtitle">Choose the perfect tier that fits your goals and routine.</p>
      </div>

      {/* ALERT MESSAGE */}
      {message && (
        <div ref={messageRef} tabIndex={-1} className="theme-toast">
          <ShieldAlert size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* PACKAGES GRID */}
      {packages.length === 0 ? (
        <div className="empty-state">
          <Sparkles size={36} className="empty-icon" />
          <p>No active gym packages found in the system.</p>
        </div>
      ) : (
        <div className="packages-grid">
          {packages.map((pkg, idx) => {
            const isFeatured = idx === 1;
            return (
              <div 
                key={pkg.id} 
                className={`pkg-card ${isFeatured ? 'featured-card' : ''}`}
              >
                {isFeatured && (
                  <div className="featured-ribbon">
                    <Star size={11} fill="currentColor" /> MOST POPULAR
                  </div>
                )}

                <div className="card-top">
                  <span className="badge-tag">
                    {planBadges[idx % planBadges.length]}
                  </span>
                  <h3 className="plan-name">{pkg.name}</h3>

                  <div className="price-container">
                    <span className="currency">₹</span>
                    <span className="amount">{formatPrice(pkg.price)}</span>
                    <span className="term">/ {pkg.duration || 'Term'}</span>
                  </div>
                </div>

                <div className="card-middle">
                  <div className="duration-tag">
                    <Clock size={13} />
                    <span>Duration: {pkg.duration}</span>
                  </div>

                  <div className="perks-heading">WHAT'S INCLUDED</div>

                  {pkg.features && pkg.features.length > 0 ? (
                    <ul className="perks-list">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="perk-item">
                          <span className="check-bubble">
                            <Check size={11} />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-perks">Standard gym access included.</p>
                  )}
                </div>

                <div className="card-bottom">
                  <button className={`select-plan-btn ${isFeatured ? 'btn-primary' : 'btn-outline'}`}>
                    <span>Active Package</span>
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewPackages;