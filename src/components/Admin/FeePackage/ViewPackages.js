import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../Firebase';

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
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  const id = 'pack';

  useEffect(() => {
    const colRef = collection(db, 'Details', id, 'details');

    // Real-time listener
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const packageList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPackages(packageList);
        setLoading(false);
        setMessage('Packages updated.');
        setTimeout(() => setMessage(''), 3000);
      },
      (error) => {
        console.error('❌ Error fetching packages:', error);
        setMessage('Failed to fetch packages.');
        setTimeout(() => setMessage(''), 3000);
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, [id]);

  const handleDelete = async (packageId) => {
    try {
      await deleteDoc(doc(db, 'Details', 'pack', 'details', packageId));
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

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>💰 Gym Packages</h3>
      </div>

      {message && (
        <div
          ref={messageRef}
          tabIndex={-1} // to make div focusable
          className="alert alert-info"
          style={{ outline: 'none' }}
        >
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading packages...</p>
      ) : packages.length === 0 ? (
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
                <div className="d-flex justify-content-end">
                  <button
                    className="dels btn-outline-danger"
                    onClick={() => setConfirmId(pkg.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
          <div className="bg-white p-4 m-4 rounded shadow" style={{ minWidth: '300px' }}>
            <h5 className="mb-3">Confirm Deletion</h5>
            <p>Are you sure you want to delete this package?</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewPackages;
