import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { Utensils, Sparkles, ShieldAlert, Flame, Clock, Trash2 } from 'lucide-react';
import '../../User/ViewDietPlans.css';

const ViewDietPlans = ({ isDarkMode }) => {
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('beginner');
  const messageRef = useRef(null);

  const mealOrder = ['breakfast', 'snack', 'lunch', 'snack2', 'dinner', 'post workout'];
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, '');

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  // 1. Real-time Firestore Listener
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, 'Details', 'Diets', 'plans'),
      (snapshot) => {
        const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDietPlans(plans);
        setLoading(false);
      },
      (error) => {
        console.error('❌ Error fetching diet plans:', error);
        setLoading(false);
        showMessage('Failed to fetch diet plans.');
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Firestore Delete Handler
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'Details', 'Diets', 'plans', id));
      showMessage('Diet meal plan deleted successfully.');
      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (error) {
      console.error('❌ Error deleting diet plan:', error);
      showMessage('Failed to delete diet plan.');
    } finally {
      setConfirmId(null);
    }
  };

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
        <div ref={messageRef} tabIndex={-1} className="theme-toast mb-4">
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
                  <p 
                    className="items-text"
                    style={{ textAlign: 'justify', textJustify: 'inter-word' }}
                  >
                    {plan.items || 'No items listed for this meal.'}
                  </p>
                </div>
              </div>

              {/* CARD FOOTER WITH MATCHED DELETE BUTTON */}
              <div className="card-footer-meta d-flex justify-content-end align-items-center pt-2 mt-2 border-top">
                <button
                  className="delete-pkg-btn"
                  onClick={() => setConfirmId(plan.id)}
                  title="Delete Meal Plan"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmId && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h5 className="modal-title">Confirm Deletion</h5>
            <p className="modal-text" style={{ textAlign: 'justify', textJustify: 'inter-word' }}>
              Are you sure you want to delete this diet meal plan? This action cannot be undone.
            </p>
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

export default ViewDietPlans;