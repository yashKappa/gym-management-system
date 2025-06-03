import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';

const alertClasses = [
  'alert-success',
  'alert-info',
  'alert-warning',
  'alert-primary',
  'alert-secondary',
  'alert-danger',
  'alert-dark',
  'alert-light',
  'alert-themed-blue',
  'alert-neutral',
  'alert-highlight',
  'alert-urgent',
  'alert-muted',
  'alert-glow'
];

const ViewDietPlans = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);
  const [activeTab, setActiveTab] = useState('beginner');

  const mealOrder = ['breakfast', 'snack', 'lunch', 'snack2', 'dinner', 'post workout'];
  const normalize = (str) => str?.toLowerCase().replace(/\s+/g, '');

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  useEffect(() => {
    setLoading(true);
    // Real-time listener
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

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const filteredPlans = dietPlans
    .filter(plan => plan.level?.toLowerCase() === activeTab)
    .sort((a, b) => {
      const indexA = mealOrder.indexOf(normalize(a.mealType));
      const indexB = mealOrder.indexOf(normalize(b.mealType));
      return indexA - indexB;
    });

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🏋️‍♂️ Gym Diet Plans</h3>
        <button
          className="rec"
          onClick={() => showMessage('Real-time updates active, no manual refresh needed')}
          disabled={loading}
        >
          <i className="fa-solid fa-rotate"></i> {loading ? 'Loading...' : 'Real-time Active'}
        </button>
      </div>

      {message && (
        <div ref={messageRef} className="alert alert-info">
          {message}
        </div>
      )}

      <ul className="Diet nav nav-tabs justify-content-center mb-4">
        {['beginner', 'regular', 'professional'].map(level => (
          <li key={level} className="nav-item">
            <button
              className={`nav-link ${activeTab === level ? 'active' : ''}`}
              onClick={() => setActiveTab(level)}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {filteredPlans.length === 0 ? (
        <div className="text-center mt-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/back.png`}
            alt="No Plans"
            style={{ width: '10%', marginBottom: '10px', marginTop: '20px' }}
          />
          <p style={{ margin: 0 }}>No Diet plan found for this level.</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredPlans.map((plan, idx) => (
            <div className="col-12 col-md-6" key={plan.id}>
              <div className={`alert ${alertClasses[idx % alertClasses.length]} shadow-sm`}>
                <h5 className="alert-heading">{plan.mealType}</h5>
                <hr />
                <p>{plan.items}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewDietPlans;
