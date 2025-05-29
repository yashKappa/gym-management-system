import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import NotiyFetch from './NotiyFetch';

const Notification = () => {
  const [formData, setFormData] = useState({ title: '', msg: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const collectionRef = collection(db, 'Details', 'Notifications', 'details');
      await addDoc(collectionRef, formData); 

      setSuccessMessage('Package saved successfully!');
      setFormData({ title: '', msg: '' });
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setErrorMessage(`Failed to save: ${error.message}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  return (
    <div className="container pt-4">
      <h3 className="text-center mb-4">Notification</h3>

      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-light border p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Gym-Close"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Message</label>
          <textarea
            name="msg"
            className="form-control"
            value={formData.msg}
            onChange={handleChange}
            placeholder="e.g., Renovation was going on"
            required
          />
        </div>

        <div className="text-end">
          <button type="submit" className="gen px-4">Save Package</button>
        </div>
      </form>
      <NotiyFetch />
    </div>
  );
};

export default Notification;
