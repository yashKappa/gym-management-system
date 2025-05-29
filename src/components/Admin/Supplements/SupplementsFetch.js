import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../Firebase';
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
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [message, setMessage] = useState('');
const messageRef = useRef(null);

  const fetchSupplements = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Details', 'Supplements', 'details'));
      const dataList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSupplements(dataList);
      setMessage('Supplements refreshed.');
    } catch (error) {
      console.error('❌ Error fetching supplements:', error);
      setMessage('Failed to fetch supplements.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  useEffect(() => {
    fetchSupplements();
  }, []);

const handleDelete = async (id) => {
  try {
    await deleteDoc(doc(db, 'Details', 'Supplements', 'details', id));
    setSupplements(prev => prev.filter(s => s.id !== id));
    setMessage('Supplement deleted successfully.');
    setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  } catch (error) {
    console.error('❌ Error deleting supplement:', error);
    setMessage('Failed to delete supplement.');
    setTimeout(() => {
      if (messageRef.current) {
        messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  } finally {
    setConfirmId(null);
    setTimeout(() => setMessage(''), 3000);
  }
};


  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>💪 Supplements</h3>
        <button className="rec" onClick={fetchSupplements} disabled={loading}>
          <i className="fa-solid fa-rotate"></i> {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

{message && (
  <div ref={messageRef} className="alert alert-info">
    {message}
  </div>
)}

      {supplements.length === 0 ? (
        <div className="text-center mt-4">
          <p>No Supplements found.</p>
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
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                />
                <p>{supplement.description || 'No description available.'}</p>
                <div className="d-flex justify-content-end">
                  <button
                    className="dels btn-outline-danger"
                    onClick={() => setConfirmId(supplement.id)}
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
            <p>Are you sure you want to delete this supplement?</p>
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

export default SupplementsFetch;
