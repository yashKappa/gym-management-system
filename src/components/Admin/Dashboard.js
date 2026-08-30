import React, { useState, useEffect } from 'react';
import { 
  Users, 
  CreditCard, 
  Bell, 
  Pill, 
  Utensils, 
  ArrowRight, 
  Activity, 
  Quote, 
  TrendingUp, 
  Zap, 
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import '../User/Dashboard.css';
import DataFetch from './DataFetch';
import MemberData from './MemberData';

// High-resolution background slideshow images
const backgroundImages = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1920&q=80'
];

// Rotating fitness motivation quotes
const motivationalQuotes = [
  { quote: "Pain is temporary. Pride is forever.", author: "Akatsuki Creed" },
  { quote: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { quote: "The body achieves what the mind believes.", author: "Napoleon Hill" },
  { quote: "Success starts with self-discipline.", author: "Dwayne Johnson" },
  { quote: "No shortcuts. Just hard work, dedication, and consistency.", author: "Gym Intel" }
];

const dashboardItems = [
  {
    title: 'Add Member',
    sidebarLabel: 'Members',
    description: 'Manage gym members, active subscriptions, and check-in logs.',
    icon: Users,
    glowClass: 'card-blue',
    count: '248 Members'
  },
  {
    title: 'Fee Packages',
    sidebarLabel: 'Fee Package',
    description: 'Configure membership tiers, pricing plans, and billing schedules.',
    icon: CreditCard,
    glowClass: 'card-rose',
    count: '4 Plans Active'
  },
  {
    title: 'Notifications',
    sidebarLabel: 'Notification',
    description: 'Send mass announcements, SMS updates, and renewal alerts.',
    icon: Bell,
    glowClass: 'card-amber',
    count: '12 Unread'
  },
  {
    title: 'Supplements',
    sidebarLabel: 'Supplement',
    description: 'Track supplement stock levels, orders, and retail inventory.',
    icon: Pill,
    glowClass: 'card-cyan',
    count: '36 Products'
  },
  {
    title: 'Diets',
    sidebarLabel: 'Diet Details',
    description: 'Create customized nutrition programs and macro meal plans.',
    icon: Utensils,
    glowClass: 'card-emerald',
    count: '18 Active Plans'
  }
];

const Dashboard = ({ onSectionChange }) => {
  const [currentBgIdx, setCurrentBgIdx] = useState(0);
  const [currentQuoteIdx, setCurrentQuoteIdx] = useState(0);

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

  // Cycle Background Images & Quotes periodically
  useEffect(() => {
    const bgTimer = setInterval(() => {
      setCurrentBgIdx((prev) => (prev + 1) % backgroundImages.length);
    }, 7000);

    const quoteTimer = setInterval(() => {
      setCurrentQuoteIdx((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);

    return () => {
      clearInterval(bgTimer);
      clearInterval(quoteTimer);
    };
  }, []);

  return (
    <div className={`gym-dashboard-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      
      {/* THEME TOGGLE BUTTON */}
      <button 
        className="theme-toggle-btn" 
        onClick={handleThemeToggle}
        title="Toggle Light/Dark Mode"
      >
        {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      <div className="header">
        <div className="badge">
          <Clock size={14} /> Dashboard Overview
        </div>
        <h2 className="head-title">Welcome to Your Admin Dashboard</h2>
        <p className="head-subtitle">Manage your gym membership, view your progress, and access your personalized fitness plans.</p>
      </div>


      {/* BACKGROUND IMAGE SLIDESHOW OVERLAY */}
      <div className="slideshow-container">
        {backgroundImages.map((imgUrl, index) => (
          <div
            key={index}
            className={`slide-image ${index === currentBgIdx ? 'active' : ''}`}
            style={{ backgroundImage: `url(${imgUrl})` }}
          />
        ))}
        <div className="theme-overlay" />
      </div>

      {/* DASHBOARD CONTENT CONTAINER */}
      <div className="dashboard-content">

        {/* TOP SYSTEM HUD METRICS BAR */}
        <section className="hud-metrics-bar">
          <div className="hud-card">
            <Activity className="hud-icon text-emerald" size={20} />
            <div className="hud-info">
              <span className="hud-label">Live Gym Capacity</span>
              <span className="hud-value">78 / 120 <small className="badge-live">PEAK HOUR</small></span>
            </div>
          </div>

          <div className="hud-card">
            <TrendingUp className="hud-icon text-indigo" size={20} />
            <div className="hud-info">
              <span className="hud-label">Monthly Revenue</span>
              <span className="hud-value">$14,250 <small className="text-emerald">+12.5%</small></span>
            </div>
          </div>

          <div className="hud-card">
            <Zap className="hud-icon text-amber" size={20} />
            <div className="hud-info">
              <span className="hud-label">System Status</span>
              <span className="hud-value text-emerald">ALL SYSTEMS ONLINE</span>
            </div>
          </div>
        </section>

        {/* HERO BANNER & ROTATING MOTIVATIONAL QUOTE */}
        <header className="hero-section">
          <div className="hero-text">
            <span className="brand-badge">
              <Clock size={14} /> AKATSUKI CORE ENGINE
            </span>
            <h1 className="hero-title">Akatsuki-Gym Management</h1>
            <p className="hero-subtitle">
              Central command interface for gym administration, scheduling, and client telemetry.
            </p>
          </div>

          <div className="quote-box">
            <Quote className="quote-icon" size={28} />
            <p className="quote-text">"{motivationalQuotes[currentQuoteIdx].quote}"</p>
            <span className="quote-author">— {motivationalQuotes[currentQuoteIdx].author}</span>
          </div>
        </header>

        {/* MANAGEMENT NAVIGATION GRID */}
        <section className="cards-grid">
          {dashboardItems.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div 
                key={idx} 
                className={`management-card ${item.glowClass}`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="card-header">
                  <div className="icon-container">
                    <IconComponent size={24} />
                  </div>
                  <span className="count-tag">{item.count}</span>
                </div>

                <div className="card-main">
                  <h3 className="card-title">{item.title}</h3>
                  <p className="card-desc">{item.description}</p>
                </div>

                <div className="card-action">
                  <button 
                    className="manage-btn"
                    onClick={() => onSectionChange && onSectionChange(item.sidebarLabel)}
                  >
                    <span>Go to {item.title}</span>
                    <ArrowRight size={16} className="arrow-icon" />
                  </button>
                </div>
              </div>
            );
          })}
        </section>

        <section className="pt-5">
          <DataFetch />
          <MemberData />
        </section>

      </div>
    </div>
  );
};

export default Dashboard;