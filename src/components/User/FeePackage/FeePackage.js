import React, { useEffect, useState, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import ViewPackages from './ViewPackages';

const FeePackageForm = () => {
  const [formData, setFormData] = useState({ name: '', price: '', duration: '' });
  const [features, setFeatures] = useState(['']);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const successRef = useRef(null);
  const errorRef = useRef(null);
  const id = 'pack';
  
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFeatureChange = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const packageData = {
      ...formData,
      features: features.filter(f => f.trim() !== ''),
    };

    try {
      await addDoc(collection(db, 'Details', id, 'details'), packageData);
      setSuccessMessage('Package saved successfully!');
      setFormData({ name: '', price: '', duration: '' });
      setFeatures(['']);
      setTimeout(() => setSuccessMessage(''), 5000); // Auto clear after 5 sec
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setErrorMessage(`Failed to save: ${error.message}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  useEffect(() => {
  if (successMessage && successRef.current) {
    successRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  if (errorMessage && errorRef.current) {
    errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}, [successMessage, errorMessage]);


  return (
    <div className="container pt-4">
      <h3 className="text-center mb-4">💰 Gym Fee Package</h3>

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
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Package Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Premium Plan"
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Price</label>
            <input
              type="text"
              name="price"
              className="form-control"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g., ₹4499"
              required
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Duration</label>
            <input
              type="text"
              name="duration"
              className="form-control"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 6 Months"
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="form-label">Features</label>
          {features.map((feature, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder={`Feature #${index + 1}`}
                value={feature}
                onChange={(e) => handleFeatureChange(index, e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={() => removeFeature(index)}
                disabled={features.length === 1}
              >
                <i class="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
          <button type="button" className="rec" onClick={addFeature}>
            <i class="fa-solid fa-plus"></i> Add Feature
          </button>
        </div>

        <div className="mt-4 text-end">
          <button type="submit" className="gen px-4">Save Package</button>
        </div>
      </form>
      <ViewPackages />
    </div>
  );
};

export default FeePackageForm;
