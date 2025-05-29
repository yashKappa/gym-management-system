import React, { useState } from 'react';
import { db } from '../../Firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './Receipt.css';
import ReceiptData from './ReceiptData';

const Receipt = ({ member, onClose }) => {
  const today = new Date().toISOString().split('T')[0];

  // Hooks here, always executed
  const [amountPaid, setAmountPaid] = useState('');
  const [months, setmonths] = useState('');
  const [date, setDate] = useState(today);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!member) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amountPaid) {
      setMessage('Please enter the amount paid.');
      return;
    }

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
      setmonths('');
      setDate(today);
    } catch (error) {
      console.error('Error saving receipt:', error);
      setMessage('Failed to save receipt. Try again.');
    }finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h5>Receipt Form for <strong>{member.name}</strong></h5>
        <button className="btn btn-outline-danger btn-sm" onClick={onClose}>Close</button>
      </div>
       {message &&  <div className="success alert mt-3">
          <span>{message}</span>
        </div>}
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
            />
          </div>
          <div className="col-md-6 mt-3">
            <label className="form-label">Months</label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter Months"
              value={months}
              onChange={e => setmonths(e.target.value)}
              required
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
            />
          </div>
        </div>

        <div className='sub'>
          <button type="submit" className="gen">Generate Receipt</button>
        </div>
      </form>

<ReceiptData memberName={member.name} />

    </div>
  );
};

export default Receipt;
