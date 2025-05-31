import React, { useEffect, useState } from 'react';
import { db } from '../Firebase';  // make sure your Firebase config path is correct
import { doc, getDoc, setDoc } from 'firebase/firestore';

const dashboardItems = [
  {
    title: 'Members',
    sidebarLabel: 'Members',
    icon: '👥',
    bg: 'alert-primary'
  },
  {
    title: 'Fee Packages',
    sidebarLabel: 'Fee Package',
    icon: '💰',
    bg: 'alert-danger'
  },
  {
    title: 'Notifications',
    sidebarLabel: 'Notification',
    icon: '🔔',
    bg: 'alert-warning'
  },
  {
    title: 'Supplements',
    sidebarLabel: 'Supplement',
    icon: '💊',
    bg: 'alert-info'
  },
  {
    title: 'Diets',
    sidebarLabel: 'Diet Details',
    icon: '🥗',
    bg: 'alert-success'
  }
];

const Dashboard = ({ onSectionChange }) => {
  const [maxAdmins, setMaxAdmins] = useState(null);
  const [loadingLimit, setLoadingLimit] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch current admin limit from Firestore on mount
  useEffect(() => {
    const fetchAdminLimit = async () => {
      try {
        const docRef = doc(db, 'Settings', 'adminLimit');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMaxAdmins(docSnap.data().maxAdmins);
        } else {
          setMaxAdmins(3); // default if none set
        }
      } catch (error) {
        console.error('Error fetching admin limit:', error);
        setMessage('Failed to load admin limit');
      } finally {
        setLoadingLimit(false);
      }
    };

    fetchAdminLimit();
  }, []);

  const handleSaveLimit = async () => {
    if (maxAdmins < 1) {
      setMessage('Admin limit must be at least 1');
      return;
    }
    try {
      await setDoc(doc(db, 'Settings', 'adminLimit'), { maxAdmins });
      setMessage('Admin limit updated successfully!');
    } catch (error) {
      console.error('Error saving admin limit:', error);
      setMessage('Failed to update admin limit');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 text-center">📊 Akatsuki-Gym Dashboard</h2>

      {/* Other Dashboard Items */}
      <div className="row g-4">
        {dashboardItems.map((item, index) => (
          <div className="col-12 col-md-6 col-lg-4" key={index}>
            <div className={`alert ${item.bg} shadow-sm rounded-3`}>
              <h5 className="alert-heading d-flex align-items-center gap-2 mb-3">
                {item.icon} {item.title}
              </h5>
              <p className="mb-3">Manage and view {item.title.toLowerCase()} details.</p>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-outline-dark btn-sm"
                  onClick={() => onSectionChange(item.sidebarLabel)}
                >
                  Go to {item.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

       {/* Admin Settings Section */}
      <div className="mb-5 p-4 border rounded shadow-sm bg-light">
        <h4 className="mb-3 d-flex align-items-center gap-2">
          ⚙️ Admin Settings
        </h4>
        {loadingLimit ? (
          <p>Loading admin limit...</p>
        ) : (
          <>
            <div>
              <label className="form-label fw-semibold" htmlFor="adminLimitInput">
                Maximum Admin Accounts Allowed
              </label>
              <input
                id="adminLimitInput"
                type="number"
                className="form-control"
                min="1"
                value={maxAdmins}
                onChange={(e) => setMaxAdmins(parseInt(e.target.value) || 1)}
                 style={{ maxWidth: '300px' }}
              />
              <button className="gen mt-3" onClick={handleSaveLimit}>
                Save Limit
              </button>
              {message && (
                <div className="alert alert-info mt-3" role="alert">
                  {message}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
