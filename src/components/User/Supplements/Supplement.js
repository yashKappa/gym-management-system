import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import SupplementsFetch from './SupplementsFetch';

const Supplement = () => {
  const [formData, setFormData] = useState({ name: '', image: '', description: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const successRef = useRef(null);
  const errorRef = useRef(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const collectionRef = collection(db, 'Details', 'Supplements', 'details');
      await addDoc(collectionRef, formData);

      setSuccessMessage('Supplement added successfully!');
      setFormData({ name: '', image: '', description: '' });
      setErrorMessage('');

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error saving supplement:', error);
      setErrorMessage(`Failed to save: ${error.message}`);
      setSuccessMessage('');

      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  useEffect(() => {
    if (successMessage && successRef.current) successRef.current.focus();
    if (errorMessage && errorRef.current) errorRef.current.focus();
  }, [successMessage, errorMessage]);

  return (
    <div className="container pt-4">
      <h3 className="text-center mb-4">💪 Gym Supplement</h3>

      {successMessage && (
        <div
          className="alert alert-success"
          role="alert"
          ref={successRef}
          tabIndex={-1}
        >
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          className="alert alert-danger"
          role="alert"
          ref={errorRef}
          tabIndex={-1}
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-light border p-4 rounded shadow-sm">
        <div className="mb-3">
          <label className="form-label">Supplement Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Whey Protein"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image URL (e.g., /assets/whey.png)</label>
          <input
            type="text"
            name="image"
            className="form-control"
            value={formData.image}
            onChange={handleChange}
            placeholder="/assets/your-image.png"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            placeholder="Short description of the supplement"
            required
          ></textarea>
        </div>

        <div className="text-end">
          <button type="submit" className="gen">Save Supplement</button>
        </div>
      </form>

      <SupplementsFetch />
    </div>
  );
};

export default Supplement;
