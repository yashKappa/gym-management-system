import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { db } from '../Firebase';
import { doc, collection, onSnapshot } from 'firebase/firestore';
import { 
  User, 
  Search, 
  ShieldAlert, 
  Sun, 
  Moon, 
  Receipt,
  Phone,
  Calendar,
  UserCheck,
  Lock
} from 'lucide-react';
import './UserData.css';

const UserData = () => {
  const [userData, setUserData] = useState(null);
  const [receiptData, setReceiptData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  // Synchronize Theme state with localStorage (Default to dark)
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

  // Scroll notification into view
  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRef.current.focus();
    }
  }, [message]);

  // Real-time Firestore Sync using Cookie Credentials
  useEffect(() => {
    const name = Cookies.get('memberName');
    const accessCode = Cookies.get('memberAccessCode');

    if (!name || !accessCode) {
      setMessage('Please log in to Akatsuki-Gym to access your data.');
      setLoading(false);
      return;
    }

    // Listen for real-time updates to member document
    const userRef = doc(db, 'member', name);
    const unsubscribeUser = onSnapshot(
      userRef, 
      (userSnap) => {
        if (!userSnap.exists()) {
          setMessage('User not found.');
          setUserData(null);
          setLoading(false);
          return;
        }

        const user = userSnap.data();

        if (user.accessCode !== accessCode) {
          setMessage('Access code mismatch.');
          setUserData(null);
          setLoading(false);
          return;
        }

        setUserData(user);
        setMessage('Member details fetched successfully.');
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
      }, 
      (error) => {
        console.error('Error fetching user data:', error);
        setMessage('Failed to fetch user data.');
        setLoading(false);
      }
    );

    // Listen for real-time updates to receipts subcollection
    const receiptRef = collection(db, 'member', name, 'Receipt');
    const unsubscribeReceipts = onSnapshot(
      receiptRef, 
      (snapshot) => {
        const receipts = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.date || 0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.date || 0);
            return dateB - dateA;
          });

        setReceiptData(receipts);
      }, 
      (error) => {
        console.error('Error fetching receipts:', error);
        setMessage('Failed to fetch receipt data.');
      }
    );

    // Cleanup listeners on unmount
    return () => {
      unsubscribeUser();
      unsubscribeReceipts();
    };
  }, []);

  // Filter receipts based on search term
  const filteredReceipts = receiptData.filter(r => {
    const term = searchTerm.toLowerCase();
    const month = (r.monthName || '').toLowerCase();
    const amount = String(r.amountPaid || '');
    const trainer = (r.trainer || '').toLowerCase();
    const date = (r.date || '').toLowerCase();
    return month.includes(term) || amount.includes(term) || trainer.includes(term) || date.includes(term);
  });

  return (
    <div className={`userdata-theme-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      
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
      <div className="userdata-header">
        <div className="header-badge">
          <User size={14} /> CLIENT PROFILE & RECEIPTS
        </div>
        <h2 className="header-title">Member Telemetry</h2>
        <p className="header-subtitle">View account details and recent transaction history.</p>
      </div>

      {/* ALERT TOAST */}
      {message && (
        <div ref={messageRef} tabIndex={-1} className="theme-toast">
          <ShieldAlert size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading account details...</p>
        </div>
      ) : !userData ? (
        /* NO USER DATA / AUTH ERROR STATE */
        <div className="empty-state">
          <Lock size={38} className="empty-icon" />
          <h3>No User Data Available</h3>
          <p>{message || 'Log in with valid member credentials to access your telemetry and payment history.'}</p>
        </div>
      ) : (
        <>
          {/* USER OVERVIEW CARD */}
          <div className="table-container" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="user-cell" style={{ marginBottom: '1rem' }}>
              <div className="user-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-meta">
                <span className="user-name" style={{ fontSize: '1.2rem' }}>{userData.name}</span>
                <span className="user-phone">
                  <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} />
                  {userData.contact || 'No contact specified'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px' }}>
                <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>ACCESS CODE</small>
                <div className="code-badge" style={{ marginTop: '4px', display: 'inline-block' }}>
                  {userData.accessCode}
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px' }}>
                <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>TRAINER</small>
                <div style={{ fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>
                  <UserCheck size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--accent-badge)' }} />
                  {userData.trainer || 'Unassigned'}
                </div>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: '10px' }}>
                <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>JOINING DATE</small>
                <div style={{ fontWeight: 700, marginTop: '4px', color: 'var(--text-primary)' }}>
                  <Calendar size={14} style={{ display: 'inline', marginRight: '6px', color: 'var(--accent-badge)' }} />
                  {userData.joiningDateTime || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* RECEIPTS HEADER & SEARCH CONTROLS */}
          <div className="controls-bar">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search receipts by month, amount, date, or trainer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="member-count-badge">
              Total Receipts: {filteredReceipts.length}
            </div>
          </div>

          {/* RECEIPTS TABLE / EMPTY STATE */}
          {filteredReceipts.length === 0 ? (
            <div className="empty-state">
              <Receipt size={38} className="empty-icon" />
              <h3>No Receipts Found</h3>
              <p>{searchTerm ? 'No payment records match your search criteria.' : 'No billing receipts recorded for this member account.'}</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Receipt #</th>
                    <th>Month / Period</th>
                    <th>Amount Paid</th>
                    <th>Duration (Months)</th>
                    <th>Payment Date</th>
                    <th>Trainer</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReceipts.map((receipt, index) => (
                    <tr key={receipt.id}>
                      <td>
                        <span className="code-badge">
                          #{receiptData.length - index}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--text-primary)' }}>
                          {receipt.monthName || 'Billing Cycle'}
                        </strong>
                      </td>
                      <td>
                        <span style={{ color: '#22c55e', fontWeight: 800 }}>
                          ₹{receipt.amountPaid}
                        </span>
                      </td>
                      <td>{receipt.months || '1'}</td>
                      <td>{receipt.date || '—'}</td>
                      <td>{receipt.trainer || userData.trainer || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UserData;