import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../Firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Receipt.css';
import ReceiptData from './ReceiptData';

const Receipt = ({ member, onClose }) => {
  const today = new Date().toISOString().split('T')[0];

  const [amountPaid, setAmountPaid] = useState('');
  const [months, setMonths] = useState('');
  const [date, setDate] = useState(today);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Ref for message div
  const messageRef = useRef(null);

  // Effect to focus the message when it appears
 useEffect(() => {
  if ((message || errorMessage) && messageRef.current) {
    messageRef.current.focus();
    messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}, [message, errorMessage]);



  if (!member) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setErrorMessage('');

    if (!amountPaid) {
      setErrorMessage('Please enter the amount paid.');
      return;
    }

    if (!months) {
      setErrorMessage('Please enter the number of months.');
      return;
    }

    setLoading(true);

    try {
      const receiptCollectionRef = collection(db, 'member', member.name, 'Receipt');
      await addDoc(receiptCollectionRef, {
        amountPaid: Number(amountPaid),
        months: Number(months),
        date,
        createdAt: serverTimestamp(),
        trainer: member.trainer,
        accessCode: member.accessCode,
        contact: member.contact,
      });

      setMessage('Receipt saved successfully!');
      setAmountPaid('');
      setMonths('');
      setDate(today);

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving receipt:', error);
      setErrorMessage('Failed to save receipt. Try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Receipt Form for <strong>{member.name}</strong></h5>
        <button className="btn btn-outline-danger btn-sm" onClick={onClose}>Close</button>
      </div>

      {(message || errorMessage) && (
        <div
          tabIndex={-1}               // Make div focusable
          ref={messageRef}            // Attach ref
          className={`alert mt-3 ${message ? 'alert-success' : 'alert-danger'}`}
          aria-live="assertive"       // Announce immediately for screen readers
          role="alert"                // Role alert for screen readers
        >
          {message || errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row mt-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" value={member.name} readOnly />
          </div>
          <div className="col-md-6">
            <label className="form-label">Contact</label>
            <input type="text" className="form-control" value={member.contact} readOnly />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label">Trainer</label>
            <input type="text" className="form-control" value={member.trainer} readOnly />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label">Access Code</label>
            <input type="text" className="form-control" value={member.accessCode} readOnly />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label">Amount Paid</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Amount"
              value={amountPaid}
              onChange={e => setAmountPaid(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label">Months</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Months"
              value={months}
              onChange={e => setMonths(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="col-md-6 mt-3 d-none">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              disabled={loading}
            />
          </div>
        </div>

        <div className="sub mt-4">
          <button type="submit" className="gen" disabled={loading}>
            {loading ? 'Saving...' : 'Generate Receipt'}
          </button>
        </div>
      </form>

      <ReceiptData memberName={member.name} />
    </div>
  );
};

export default Receipt;
