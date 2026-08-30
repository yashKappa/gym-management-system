import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { Dumbbell, Sparkles, ShieldAlert, PackageCheck, Trash2 } from 'lucide-react';
import '../../User/SupplementsFetch.css';

const SupplementsFetch = ({ isDarkMode }) => {
  const [supplements, setSupplements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  // 1. Real-time Firebase Listener
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'Details', 'Supplements', 'details'),
      (querySnapshot) => {
        const dataList = querySnapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setSupplements(dataList);
        setLoading(false);
      },
      (error) => {
        console.error('❌ Error in real-time update:', error);
        setMessage('Real-time update failed.');
        setTimeout(() => setMessage(''), 3000);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Delete Handler
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'Details', 'Supplements', 'details', id));
      setMessage('Supplement deleted successfully.');
      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('❌ Error deleting supplement:', error);
      setMessage('Failed to delete supplement.');
      setTimeout(() => setMessage(''), 3000);
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

  return (
    <div className={`supplements-theme-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      {/* HEADER SECTION */}
      <div className="supplements-header">
        <div className="header-badge">
          <Dumbbell size={14} /> GYM NUTRITION
        </div>
        <h2 className="header-title">Supplements Store</h2>
        <p className="header-subtitle">Browse recommended supplements, proteins, and fitness essentials.</p>
      </div>

      {/* ALERT TOAST */}
      {message && (
        <div ref={messageRef} tabIndex={-1} className="theme-toast mb-4">
          <ShieldAlert size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* CONTENT AREA */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading supplements catalog...</p>
        </div>
      ) : supplements.length === 0 ? (
        <div className="empty-state">
          <Sparkles size={38} className="empty-icon" />
          <h3>No Supplements Found</h3>
          <p>There are currently no active supplements listed in the system.</p>
        </div>
      ) : (
        <div className="supplements-grid">
          {supplements.map((item) => (
            <div key={item.id} className="supplement-card">
              <div className="card-image-wrapper">
                <img
                  src={item.image || '/assets/back.png'}
                  alt={item.name || 'Supplement'}
                  className="supplement-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${process.env.PUBLIC_URL}/assets/back.png`;
                  }}
                />
                <span className="stock-badge">
                  <PackageCheck size={12} /> AVAILABLE
                </span>
              </div>

              <div className="card-details">
                <h4 className="supplement-title">{item.name || 'Unnamed Product'}</h4>
                <p className="supplement-description">
                  {item.description || 'No detailed description available for this supplement.'}
                </p>
              </div>

              {/* CARD FOOTER WITH MATCHED DELETE BUTTON */}
              <div className="card-footer-meta d-flex justify-content-end align-items-center pt-2 mt-2 border-top">
                <button
                  className="delete-pkg-btn m-2"
                  onClick={() => setConfirmId(item.id)}
                  title="Delete Supplement"
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
            <p className="modal-text">
              Are you sure you want to delete this supplement? This action cannot be undone.
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

export default SupplementsFetch;