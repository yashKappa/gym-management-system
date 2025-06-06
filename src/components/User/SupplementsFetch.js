import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { FaDumbbell } from 'react-icons/fa';

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

const SupplementsFetch = () => {
  const [supplements, setSupplements] = useState([]);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'Details', 'Supplements', 'details'),
      (querySnapshot) => {
        const dataList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSupplements(dataList);
        setMessage('Supplements updated.');
        setTimeout(() => setMessage(''), 3000);
      },
      (error) => {
        console.error('❌ Error in real-time update:', error);
        setMessage('Real-time update failed.');
        setTimeout(() => setMessage(''), 3000);
      }
    );

    // Clean up on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>💪 Supplements</h3>
      </div>

      {message && (
        <div ref={messageRef} className="alert alert-info">
          {message}
        </div>
      )}

      {supplements.length === 0 ? (
        <div className="text-center mt-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/back.png`}
            alt="No Supplements"
            style={{ width: '10%', marginBottom: '10px', marginTop: '20px' }}
          />
          <p style={{ margin: 0 }}>No Supplements found.</p>
        </div>
      ) : (
        <div className="row g-4">
          {supplements.map((supplement, idx) => (
            <div className="col-12 col-md-6" key={supplement.id}>
              <div className={`alert ${alertClasses[idx % alertClasses.length]} shadow-sm`}>
                <h5 className="alert-heading d-flex align-items-center gap-2">
                  <FaDumbbell /> {supplement.name || 'No Name'}
                </h5>
                <hr />
                <img
                  src={supplement.image || '/default.jpg'}
                  alt={supplement.name}
                  className="img-fluid rounded mb-2"
                  style={{ maxHeight: '150px', objectFit: 'cover' }}
                />
                <p>{supplement.description || 'No description available.'}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupplementsFetch;
