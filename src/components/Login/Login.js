import React, { useEffect, useState } from 'react';
import { auth } from '../Firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Mail, 
  Lock, 
  LogIn, 
  AlertCircle 
} from 'lucide-react';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        Cookies.set('session', user.uid, { expires: 7 });
        navigate('/admin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      Cookies.set('session', user.uid, { expires: 7 });
      setErrorMsg('');
      navigate('/admin');
    } catch (error) {
      setErrorMsg("Invalid email or password. Try again");
    }
  };

  return (
    <div className={`login-theme-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      
      {/* NAVIGATION BUTTONS */}
      <button 
        className="top-nav-btn back-btn" 
        onClick={() => navigate('/start')}
      >
        <ArrowLeft size={16} />
        <span>Back</span>
      </button>

      <button 
        className="top-nav-btn theme-toggle-btn" 
        onClick={handleThemeToggle}
        title="Toggle Light/Dark Mode"
      >
        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
      </button>

      {/* LOGIN CARD */}
      <div className="login-card">
        <div className="login-header">
          <div className="header-badge">
            <ShieldCheck size={14} /> SECURITY CONTROL
          </div>
          <h2 className="header-title">Admin Login</h2>
          <p className="header-subtitle">Authenticate credentials to access administrative dashboard.</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="emailInput" className="form-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                id="emailInput"
                type="email"
                className="custom-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="passwordInput" className="form-label">
              Password
            </label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                id="passwordInput"
                type="password"
                className="custom-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="toast-alert danger" role="alert">
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          <button type="submit" className="submit-btn">
            <LogIn size={18} />
            <span>Login</span>
          </button>
        </form>

        <p className="card-footer-text">
          Don't have an account?{' '}
          <Link to="/signup" className="link-styled">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;