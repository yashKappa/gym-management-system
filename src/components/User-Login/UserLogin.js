import React, { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { 
  ArrowLeft, 
  User, 
  KeyRound, 
  Dumbbell, 
  ShieldCheck, 
  AlertCircle, 
  Sun, 
  Moon 
} from 'lucide-react';
import './UserLogin.css';

function UserLogin() {
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Dark / Light Theme state synchronized with localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  const handleThemeToggle = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('appTheme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  useEffect(() => {
    const savedName = Cookies.get('memberName');
    const savedAccessCode = Cookies.get('memberAccessCode');

    if (savedName && savedAccessCode) {
      navigate('/user/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const docRef = doc(db, 'member', name.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.name === name.trim() && data.accessCode === accessCode.trim()) {
          Cookies.set('memberName', data.name, { expires: 7 });
          Cookies.set('memberAccessCode', data.accessCode, { expires: 7 });
          navigate('/user/dashboard');
        } else {
          setError('Invalid Name or Access Code.');
        }
      } else {
        setError('Member profile not found.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`modern-login-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      {/* Background Decorative Glow Elements */}
      <div className="glow-sphere sphere-1"></div>
      <div className="glow-sphere sphere-2"></div>

      {/* Navigation & Theme Bar */}
      <button className="top-nav-btn back-btn" onClick={() => navigate('/start')}>
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      <button 
        className="top-nav-btn theme-toggle-btn" 
        onClick={handleThemeToggle}
        title="Toggle Light/Dark Mode"
      >
        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      {/* Main Glassmorphism Card */}
      <div className="login-glass-card">
        <div className="brand-header">
          <div className="brand-badge-wrapper">
            <div className="brand-icon-box">
              <Dumbbell size={18} className="brand-icon" />
            </div>
            <span className="badge-text">AKATSUKI GYM</span>
          </div>
          <h2 className="login-title">Member Portal</h2>
          <p className="login-subtitle">Enter your credentials to access telemetry & plans</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {/* Member Name Field */}
          <div className="input-group-custom">
            <label className="input-label">Member Name</label>
            <div className="input-wrapper">
              <User size={18} className="field-icon" />
              <input
                type="text"
                className="custom-input"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Access Code Field */}
          <div className="input-group-custom">
            <label className="input-label">Access Code</label>
            <div className="input-wrapper">
              <KeyRound size={18} className="field-icon" />
              <input
                type="password"
                className="custom-input"
                placeholder="••••••••"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Error Alert Box */}
          {error && (
            <div className="error-banner">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button className="submit-login-btn" type="submit" disabled={isLoading}>
            {isLoading ? (
              <span className="btn-spinner">Verifying...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ShieldCheck size={18} />
              </>
            )}
          </button>
        </form>

        <div className="card-footer-info">
          <p>Need access? Contact your gym administrator.</p>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;