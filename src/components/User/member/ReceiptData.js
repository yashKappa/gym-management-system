import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const ReceiptData = ({ memberName }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

 const fetchReceipts = useCallback(async () => {
  if (!memberName) return;

  setLoading(true);
  setError('');
  try {
    const receiptCollectionRef = collection(db, 'member', memberName, 'Receipt');
    const q = query(receiptCollectionRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReceipts(data);
    setMessage('Receipt refreshed.');
  } catch (err) {
    setError('Failed to fetch receipts.');
  } finally {
    setLoading(false);
    setTimeout(() => setMessage(''), 3000);
  }
}, [memberName]);

useEffect(() => {
  fetchReceipts();
}, [fetchReceipts]);


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
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Receipts for {memberName}</h4>
        <button onClick={fetchReceipts} className="rec">
      <i class="fa-solid fa-rotate"></i> {loading ? 'Refreshing...' : 'Refresh'} 
       </button> 
      </div>
      {error && <p className="text-danger">{error}</p>}
            {message && <div className="alert alert-info">{message}</div>}

      {receipts.length === 0 && !loading && 
      <div className="text-center mt-4">
  <img
    src={`${process.env.PUBLIC_URL}/assets/back.png`}
    alt="No Receipts"
    style={{ width: '10%', marginBottom: '10px', marginTop:'20px' }}
  />
  <p style={{ margin: 0 }}>No receipts found.</p>
</div>
}
      {receipts.length > 0 && (
        <div className="table-responsive mt-3">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                                <th>Months</th>
                <th>Amount Paid</th>
                <th>Trainer</th>
                <th>Access Code</th>
                <th>Contact</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {receipts.map(r => (
                <tr key={r.id}>
                  <td>{r.months}</td>
                  <td>{r.amountPaid}</td>
                  <td>{r.trainer}</td>
                  <td>{r.accessCode}</td>
                  <td>{r.contact}</td>
                  <td>{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReceiptData;
