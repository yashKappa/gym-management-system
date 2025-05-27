import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs } from 'firebase/firestore';

const ReceiptData = ({ memberName }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReceipts = async () => {
    if (!memberName) return;

    setLoading(true);
    setError('');
    try {
      const receiptCollectionRef = collection(db, 'member', memberName, 'Receipt');
      const snapshot = await getDocs(receiptCollectionRef);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReceipts(data);
    } catch (err) {
      setError('Failed to fetch receipts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
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
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h4>Receipts for {memberName}</h4>
        <button onClick={fetchReceipts} className="rec">
      <i class="fa-solid fa-rotate"></i> {loading ? 'Refreshing...' : 'Refresh'} 
       </button> 
      </div>
      {error && <p className="text-danger">{error}</p>}
      {receipts.length === 0 && !loading && <p>No receipts found.</p>}

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
