import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../Firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import ReceiptData from './ReceiptData';
import { X, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

const Receipt = ({ member, onClose, isDarkMode }) => {
  const today = new Date().toISOString().split('T')[0];

  const [amountPaid, setAmountPaid] = useState('');
  const [months, setMonths] = useState('');
  const [date, setDate] = useState(today);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [monthName, setMonthName] = useState('');
  const messageRef = useRef(null);

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

    if (!amountPaid || !months) {
      setErrorMessage('Please fill in both Amount Paid and Months.');
      return;
    }

    setLoading(true);

    try {
      const receiptCollectionRef = collection(db, 'member', member.name, 'Receipt');
      await addDoc(receiptCollectionRef, {
        amountPaid: Number(amountPaid),
        months: Number(months),
        monthName: monthName.trim(),
        date,
        createdAt: serverTimestamp(),
        trainer: member.trainer,
        accessCode: member.accessCode,
        contact: member.contact,
      });

      setMessage('Receipt saved successfully!');
      setAmountPaid('');
      setMonths('');
      setMonthName('');
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
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '750px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="modal-title d-flex align-items-center gap-2">
            <FileText size={18} /> Receipt Form for {member.name}
          </h5>
          <button className="btn-remove-feature" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {message && (
          <div className="alert-banner success mb-3" ref={messageRef} tabIndex={-1}>
            <CheckCircle2 size={16} />
            <span>{message}</span>
          </div>
        )}
        {errorMessage && (
          <div className="alert-banner danger mb-3" ref={messageRef} tabIndex={-1}>
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="input-label-custom">Name</label>
              <input type="text" className="custom-input-field" value={member.name} readOnly />
            </div>
            <div className="col-md-6">
              <label className="input-label-custom">Contact</label>
              <input type="text" className="custom-input-field" value={member.contact} readOnly />
            </div>
            <div className="col-md-6">
              <label className="input-label-custom">Trainer</label>
              <input type="text" className="custom-input-field" value={member.trainer} readOnly />
            </div>
            <div className="col-md-6">
              <label className="input-label-custom">Access Code</label>
              <input type="text" className="custom-input-field" value={member.accessCode} readOnly />
            </div>
            <div className="col-md-4">
              <label className="input-label-custom">Amount Paid (₹)</label>
              <input
                type="number"
                className="custom-input-field"
                placeholder="e.g. 1500"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-4">
              <label className="input-label-custom">Duration (Months)</label>
              <input
                type="number"
                className="custom-input-field"
                placeholder="e.g. 3"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-4">
              <label className="input-label-custom">Month Name</label>
              <input
                type="text"
                className="custom-input-field"
                placeholder="e.g. January"
                value={monthName}
                onChange={(e) => setMonthName(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="mt-4 text-end">
            <button type="submit" className="btn-save-package" disabled={loading}>
              {loading ? 'Saving...' : 'Generate Receipt'}
            </button>
          </div>
        </form>

        <hr className="my-4" style={{ borderColor: 'var(--border-color)' }} />

        {/* RECEIPT HISTORY */}
        <ReceiptData memberName={member.name} />
      </div>
    </div>
  );
};

export default Receipt;