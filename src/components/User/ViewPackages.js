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

const ViewPackages = () => {
  const [packages, setPackages] = useState([]);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  const id = 'pack'; // Firestore document ID under 'Details'

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'Details', id, 'details'),
      (snapshot) => {
        const packageList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setPackages(packageList);
        setMessage('Packages updated.');
        setTimeout(() => setMessage(''), 3000);
      },
      (error) => {
        console.error('❌ Error with real-time update:', error);
        setMessage('Real-time update failed.');
        setTimeout(() => setMessage(''), 3000);
      }
    );

    // Cleanup on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRef.current.focus();
    }
  }, [message]);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>💰 Gym Packages</h3>
      </div>

      {message && (
        <div
          ref={messageRef}
          tabIndex={-1}
          className="alert alert-info"
          style={{ outline: 'none' }}
        >
          {message}
        </div>
      )}

      {packages.length === 0 ? (
        <div className="text-center mt-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/back.png`}
            alt="No Packages"
            style={{ width: '10%', marginBottom: '10px', marginTop: '20px' }}
          />
          <p style={{ margin: 0 }}>No Packages found.</p>
        </div>
      ) : (
        <div className="row g-4">
          {packages.map((pkg, idx) => (
            <div className="col-12 col-md-4" key={pkg.id}>
              <div className={`alert ${alertClasses[idx % alertClasses.length]} shadow-sm`}>
                <h5 className="alert-heading d-flex align-items-center gap-2">
                  <i className="fa-solid fa-sack-dollar"></i> {pkg.name}
                </h5>
                <hr />
                <p><strong>Price:</strong> ₹{pkg.price}</p>
                <p><strong>Duration:</strong> {pkg.duration}</p>
                {pkg.features && pkg.features.length > 0 && (
                  <ul className="mb-2">
                    {pkg.features.map((feature, i) => (
                      <li key={i}>✔ {feature}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewPackages;
