import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { Utensils, Sparkles, ShieldAlert, Sun, Moon, Flame, Clock } from 'lucide-react';
import './ViewDietPlans.css';

const ViewDietPlans = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('beginner');
  const messageRef = useRef(null);
  const mealOrder = ['breakfast', 'snack', 'lunch', 'snack2', 'dinner', 'post workout'];
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, '');

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

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'Details', 'Diets', 'plans'),
      (snapshot) => {
        const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDietPlans(plans);
        setLoading(false);
        showMessage('Diet plans updated.');
      },
      (error) => {
        console.error('❌ Error fetching diet plans:', error);
        setLoading(false);
        showMessage('Failed to fetch diet plans.');
      }
    );

    return () => unsubscribe();
  }, []); // Added dependency array to avoid infinite snapshot listeners

  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRef.current.focus();
    }
  }, [message]);

  const filteredPlans = dietPlans
    .filter(plan => plan.level?.toLowerCase() === activeTab)
    .sort((a, b) => {
      const indexA = mealOrder.indexOf(normalize(a.mealType));
      const indexB = mealOrder.indexOf(normalize(b.mealType));
      return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB);
    });

  return (
    <div className={`diet-theme-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
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
      <div className="diet-header">
        <div className="header-badge">
          <Utensils size={14} /> NUTRITION & MEALS
        </div>
        <h2 className="header-title">Gym Diet Plans</h2>
        <p className="header-subtitle">Follow customized meal plans engineered for your fitness level.</p>
      </div>

      {/* ALERT TOAST */}
      {message && (
        <div ref={messageRef} tabIndex={-1} className="theme-toast">
          <ShieldAlert size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* LEVEL TABS */}
      <div className="tabs-container">
        {['beginner', 'regular', 'professional'].map(level => (
          <button
            key={level}
            className={`tab-btn ${activeTab === level ? 'active' : ''}`}
            onClick={() => setActiveTab(level)}
          >
            <Flame size={14} className="tab-icon" />
            <span>{level.charAt(0).toUpperCase() + level.slice(1)}</span>
          </button>
        ))}
      </div>

      {/* CONTENT AREA */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading meal schedules...</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="empty-state">
          <Sparkles size={38} className="empty-icon" />
          <h3>No Meal Plan Found</h3>
          <p>There are no diet plans registered under the {activeTab} tier.</p>
        </div>
      ) : (
        <div className="diet-grid">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className="meal-card">
              <div className="card-top-bar">
                <span className="meal-badge">
                  <Clock size={12} /> {plan.mealType?.toUpperCase() || 'MEAL'}
                </span>
                <span className="level-tag">{activeTab.toUpperCase()}</span>
              </div>

              <div className="card-body">
                <h4 className="meal-title">{plan.mealType || 'Scheduled Meal'}</h4>
                <div className="items-box">
                  <p className="items-text">{plan.items || 'No items listed for this meal.'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewDietPlans;