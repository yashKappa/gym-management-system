import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Sun, 
  Moon, 
  Mail, 
  Lock, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';
import './SignUp.css';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [maxAdmins, setMaxAdmins] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const fetchAdminLimit = async () => {
      try {
        const docRef = doc(db, 'Settings', 'adminLimit');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMaxAdmins(docSnap.data().maxAdmins);
        } else {
          setMaxAdmins(3);
        }
      } catch (error) {
        console.error('Error fetching admin limit:', error);
        setMessageType('danger');
        setMessage('Failed to load admin limit. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminLimit();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      const adminsQuery = query(collection(db, 'Admin'), where('role', '==', 'admin'));
      const adminsSnapshot = await getDocs(adminsQuery);
      const currentAdminCount = adminsSnapshot.size;

      if (currentAdminCount >= maxAdmins) {
        setMessageType('danger');
        setMessage(`Admin limit reached. Max allowed admins: ${maxAdmins}, Contact Previous Admin`);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'Admin', user.uid), {
        email: user.email,
        uid: user.uid,
        role: 'admin',
      });

      setMessageType('success');
      setMessage('Admin Registered Successfully!');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessageType('danger');
      if (error.code === 'auth/email-already-in-use') {
        setMessage('User already exists. Use another email');
      } else {
        setMessage('Failed to register admin. Please try again.');
      }
    }
  };

  return (
    <div className={`signup-theme-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      
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

      {/* SIGN UP CARD */}
      <div className="signup-card">
        <div className="signup-header">
          <div className="header-badge">
            <ShieldCheck size={14} /> SECURITY CONTROL
          </div>
          <h2 className="header-title">Admin Sign Up</h2>
          <p className="header-subtitle">Register new administrator privileges for system telemetry.</p>
        </div>

        {loading ? (
          <div className="card-loading">
            <div className="spinner-small"></div>
            <p>Verifying security limits...</p>
          </div>
        ) : (
          <form onSubmit={handleSignUp}>
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
                  placeholder="admin@akatsuki-gym.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
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
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {message && (
              <div className={`toast-alert ${messageType === 'success' ? 'success' : 'danger'}`}>
                {messageType === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{message}</span>
              </div>
            )}

            <button type="submit" className="submit-btn">
              <UserPlus size={18} />
              <span>Sign Up Admin</span>
            </button>
          </form>
        )}

        <p className="card-footer-text">
          Already have an account?{' '}
          <Link to="/login" className="link-styled">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;