import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Sparkles, Calendar, Receipt as ReceiptIcon } from 'lucide-react';

const ReceiptData = ({ memberName }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!memberName) return;

    setLoading(true);
    setError('');

    const receiptCollectionRef = collection(db, 'member', memberName, 'Receipt');
    const q = query(receiptCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setReceipts(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError('Failed to fetch receipts.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [memberName]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '-';
    const d = timestamp.toDate();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  if (!memberName) return null;

  return (
    <div>
      <h6 className="mb-3 d-flex align-items-center gap-2">
        <ReceiptIcon size={16} /> Receipt History for {memberName}
      </h6>

      {error && <p className="text-danger">{error}</p>}

      {receipts.length === 0 && !loading && (
        <div className="empty-state text-center py-3">
          <Sparkles size={24} className="empty-icon mb-1" />
          <p  style={{ fontSize: '0.85rem' }}>No past receipts generated yet.</p>
        </div>
      )}

      {receipts.length > 0 && (
        <div className="row g-3">
          {receipts.map((r, idx) => (
            <div key={r.id} className="col-md-6">
              <div className="form-glass-card p-3 mb-0" style={{ borderRadius: '14px' }}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge-tag">{r.monthName || 'Membership'}</span>
                  <span className="input-label-custom mb-0">#{receipts.length - idx}</span>
                </div>
                <div className="price-container mb-2">
                  <span className="currency">₹</span>
                  <span className="amount">{r.amountPaid}</span>
                  <span className="term">/ {r.months} mo</span>
                </div>
                <div className="d-flex flex-column gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div><strong>Access Code:</strong> {r.accessCode}</div>
                  <div>
                    <Calendar size={12} className="me-1" />
                    <strong>Date:</strong> {formatDate(r.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceiptData;