import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { Check, Clock, ShieldAlert, Sparkles, Dumbbell, Star, ChevronRight, Trash2 } from 'lucide-react';
import '../../User/ViewPackages.css';

const planBadges = ['STARTER', 'POPULAR', 'PRO CHOICE', 'ULTIMATE'];

const ViewPackages = ({ isDarkMode }) => {
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState('');
  const [confirmId, setConfirmId] = useState(null); // Tracks package selected for deletion
  const messageRef = useRef(null);
  const id = 'pack';

  // 1. Real-time packages listener
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'Details', id, 'details'),
      (snapshot) => {
        const packageList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPackages(packageList);
      },
      (error) => {
        console.error('❌ Error with real-time update:', error);
        setMessage('Real-time update failed.');
        setTimeout(() => setMessage(''), 3000);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Scroll into view on feedback message
  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRef.current.focus();
    }
  }, [message]);

  // 3. Firestore delete handler
  const handleDelete = async (packageId) => {
    try {
      await deleteDoc(doc(db, 'Details', id, 'details', packageId));
      setMessage('Package deleted successfully.');

      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          messageRef.current.focus();
        }
      }, 100);

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('❌ Error deleting package:', error);
      setMessage('Failed to delete package.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setConfirmId(null);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return price.toString().replace(/[^0-9,.]/g, '');
  };

  return (
    <div className={`packages-theme-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
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

                <div className="card-bottom flex gap-2">
                  <button className={`select-plan-btn ${isFeatured ? 'btn-primary' : 'btn-outline'}`}>
                    <span>Active Package</span>
                    <ChevronRight size={15} />
                  </button>

                  {/* Delete Button */}
                  <button 
                    className="delete-pkg-btn"
                    onClick={() => setConfirmId(pkg.id)}
                    title="Delete Package"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmId && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h5 className="modal-title">Confirm Deletion</h5>
            <p className="modal-text">Are you sure you want to delete this package? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(confirmId)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPackages;