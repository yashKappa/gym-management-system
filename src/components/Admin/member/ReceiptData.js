import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

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

const ReceiptData = ({ memberName }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!memberName) return;

    setLoading(true);
    setError('');

    const receiptCollectionRef = collection(db, 'member', memberName, 'Receipt');
    const q = query(receiptCollectionRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setReceipts(data);
        setMessage('Receipts updated.');
        setLoading(false);
        setTimeout(() => setMessage(''), 3000);
      },
      (err) => {
        console.error(err);
        setError('Failed to fetch receipts.');
        setLoading(false);
      }
    );

    // Cleanup listener on unmount
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

  if (!memberName) return <p>Please select a member to view receipts.</p>;

  return (
    <div className='mt-4'>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Receipts for {memberName}</h4>
      </div>
      {error && <p className="text-danger">{error}</p>}
      {message && <div className="alert alert-info mt-4">{message}</div>}

      {receipts.length === 0 && !loading && (
        <div className="text-center mt-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/back.png`}
            alt="No Receipts"
            style={{ width: '10%', marginBottom: '10px', marginTop: '20px' }}
          />
          <p style={{ margin: 0 }}>No receipts found.</p>
        </div>
      )}

      {receipts.length > 0 && (
        <div className="row mt-3">
          {receipts.map((r, idx) => (
            <div key={r.id} className="col-md-4 mb-4">
              <div className={`alert ${alertClasses[idx % alertClasses.length]} shadow-sm`}>
                <h5 className="card-title">
                  <div className='title'>
                    <p>{r.monthName}</p> <p>#{receipts.length - idx}</p>
                  </div>
                </h5>
                <hr />
                <p><strong>Amount Paid:</strong> {r.amountPaid}</p>
                <p><strong>Trainer:</strong> {r.trainer}</p>
                <p><strong>Access Code:</strong> {r.accessCode}</p>
                <p><strong>Contact:</strong> {r.contact}</p>
                <p><strong>Created At:</strong> {formatDate(r.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReceiptData;
