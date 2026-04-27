import React, { useState, useEffect } from 'react';
import './Dashboard.css';

const dashboardItems = [
  {
    title: 'User Datas',
    sidebarLabel: 'User Data',
    icon: '👥',
    className: 'user-data',
    description: 'View and manage your personal profile, membership details, and fitness progress all in one place.',
    image: '/assets/g-logo1.png'
  },
  {
    title: 'Fee Packages',
    sidebarLabel: 'Fee Package',
    icon: '💰',
    className: 'fee-packages',
    description: 'Explore our premium membership plans designed to fit your fitness goals and budget perfectly.',
    image: '/assets/logo.jpeg'
  },
  {
    title: 'Notifications',
    sidebarLabel: 'Notification',
    icon: '🔔',
    className: 'notifications',
    description: 'Stay updated with the latest announcements, offers, and important gym updates.',
    image: '/assets/back.png'
  },
  {
    title: 'Supplements',
    sidebarLabel: 'Supplement',
    icon: '💊',
    className: 'supplements',
    description: 'Browse our curated selection of high-quality supplements to maximize your workout results.',
    image: '/assets/g-logo1.png'
  },
  {
    title: 'Diets',
    sidebarLabel: 'Diet Details',
    icon: '🥗',
    className: 'diets',
    description: 'Get personalized diet plans crafted by nutrition experts to fuel your fitness journey.',
    image: '/assets/logo.jpeg'
  }
];

const features = [
  { icon: '💪', title: 'Expert Trainers', description: 'Certified professionals to guide you' },
  { icon: '🏋️', title: 'Modern Equipment', description: 'State-of-the-art fitness machinery' },
  { icon: '⏰', title: '24/7 Access', description: 'Train anytime that suits you' },
  { icon: '🎯', title: 'Goal Tracking', description: 'Monitor your progress daily' }
];

const AnimatedCounter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration]);

  return <span>{count}{suffix}</span>;
};

const Dashboard = ({ onSectionChange }) => {
  return (
    <div className="gym-dashboard">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="particles-container">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="pulse-dot"></span>
            Welcome Back, Warrior
          </div>
          <h1 className="hero-title">AKATSUKI GYM</h1>
          <p className="hero-subtitle">Push Your Limits. Break Barriers. Build Legends.</p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-value">24/7</div>
              <div className="stat-label">Open Hours</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">50+</div>
              <div className="stat-label">Expert Trainers</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">1000+</div>
              <div className="stat-label">Active Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Stats Counters */}
        <div className="counter-wrapper">
          <div className="counter-item animate-in delay-1">
            <div className="counter-number">
              <AnimatedCounter end={150} suffix="+" />
            </div>
            <div className="counter-label">Equipment</div>
          </div>
          <div className="counter-item animate-in delay-2">
            <div className="counter-number">
              <AnimatedCounter end={25} suffix="+" />
            </div>
            <div className="counter-label">Classes Weekly</div>
          </div>
          <div className="counter-item animate-in delay-3">
            <div className="counter-number">
              <AnimatedCounter end={98} suffix="%" />
            </div>
            <div className="counter-label">Satisfaction</div>
          </div>
          <div className="counter-item animate-in delay-4">
            <div className="counter-number">
              <AnimatedCounter end={12} suffix="K+" />
            </div>
            <div className="counter-label">Calories Burned Daily</div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <h2 className="section-title">Dashboard</h2>
        <div className="cards-grid">
          {dashboardItems.map((item, index) => (
            <div
              key={index}
              className={`dashboard-card ${item.className} animate-in delay-${index + 1}`}
              onClick={() => onSectionChange(item.sidebarLabel)}
            >
              <div
                className="card-image-bg"
                style={{ backgroundImage: `url(${item.image})` }}
              ></div>
              <div className="card-icon-wrapper">
                <span className="card-icon">{item.icon}</span>
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-description">{item.description}</p>
              <button className="card-action">
                Access {item.title}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 className="section-title">Why Choose Us</h2>
        <div className="features-section">
          {features.map((feature, index) => (
            <div key={index} className={`feature-box animate-in delay-${index + 1}`}>
              <span className="feature-icon">{feature.icon}</span>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Quote Section */}
        <div className="quote-section">
          <div className="quote-content">
            <p className="quote-text">"The only bad workout is the one that didn't happen."</p>
            <p className="quote-author">— Your Future Self</p>
          </div>
        </div>

        {/* Gym Image Showcase */}
        <h2 className="section-title">Our Facility</h2>
        <div className="image-showcase">
          <div className="showcase-item">
            <img src="/assets/back.png" alt="Gym Interior" />
            <div className="showcase-overlay">
              <p className="showcase-title">Training Area</p>
            </div>
          </div>
          <div className="showcase-item">
            <img src="/assets/logo.jpeg" alt="Gym Equipment" />
            <div className="showcase-overlay">
              <p className="showcase-title">Premium Equipment</p>
            </div>
          </div>
          <div className="showcase-item">
            <img src="/assets/g-logo1.png" alt="Gym Logo" />
            <div className="showcase-overlay">
              <p className="showcase-title">Akatsuki Strength</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
