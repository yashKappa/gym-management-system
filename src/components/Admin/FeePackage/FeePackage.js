import React, { useEffect, useState, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import ViewPackages from './ViewPackages';
import { Sun, Moon, Plus, X, CheckCircle2, AlertCircle, Save } from 'lucide-react';
import './FeePackageForm.css';

const FeePackageForm = () => {
  const [formData, setFormData] = useState({ name: '', price: '', duration: '' });
  const [features, setFeatures] = useState(['']);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const successRef = useRef(null);
  const errorRef = useRef(null);
  const id = 'pack';

  // Single Page-Level Theme State
 // 1. Theme State Initialization
const [isDarkMode, setIsDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem('appTheme');
  return savedTheme ? savedTheme === 'dark' : true;
});

// 2. Listen to Global Theme Events from Navbar or Other Pages
useEffect(() => {
  const syncTheme = () => {
    const saved = localStorage.getItem('appTheme');
    setIsDarkMode(saved ? saved === 'dark' : true);
  };

  window.addEventListener('themeChange', syncTheme);
  window.addEventListener('storage', syncTheme);

  return () => {
    window.removeEventListener('themeChange', syncTheme);
    window.removeEventListener('storage', syncTheme);
  };
}, []);

// 3. Child Toggle Action Dispatches Event
const handleThemeToggle = () => {
  setIsDarkMode((prev) => {
    const newMode = !prev;
    localStorage.setItem('appTheme', newMode ? 'dark' : 'light');
    window.dispatchEvent(new Event('themeChange')); // Sync navbar & other components
    return newMode;
  });
};

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      features: features.filter((f) => f.trim() !== ''),
    };

    try {
      await addDoc(collection(db, 'Details', id, 'details'), packageData);
      setSuccessMessage('Package saved successfully!');
      setFormData({ name: '', price: '', duration: '' });
      setFeatures(['']);
      setTimeout(() => setSuccessMessage(''), 5000);
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
    <div className={`fee-package-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="fee-package-container">
        {/* Single Global Theme Toggle Button */}
        <div className="fee-top-bar">
          <button
            className="theme-toggle-btn"
            onClick={handleThemeToggle}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>

        <h3 className="page-header-title">💰 Gym Fee Package</h3>

        {/* Notifications */}
        {successMessage && (
          <div
            className="alert-banner success"
            role="alert"
            ref={successRef}
            tabIndex={-1}
          >
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            className="alert-banner danger"
            role="alert"
            ref={errorRef}
            tabIndex={-1}
          >
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="form-glass-card">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="input-label-custom">Package Name</label>
              <input
                type="text"
                name="name"
                className="custom-input-field"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Premium Plan"
                required
              />
            </div>
            <div className="col-md-3">
              <label className="input-label-custom">Price</label>
              <input
                type="text"
                name="price"
                className="custom-input-field"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g., ₹4499"
                required
              />
            </div>
            <div className="col-md-3">
              <label className="input-label-custom">Duration</label>
              <input
                type="text"
                name="duration"
                className="custom-input-field"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g., 6 Months"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="input-label-custom">Features</label>
            {features.map((feature, index) => (
              <div key={index} className="feature-input-group">
                <input
                  type="text"
                  className="custom-input-field"
                  placeholder={`Feature #${index + 1}`}
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-remove-feature"
                  onClick={() => removeFeature(index)}
                  disabled={features.length === 1}
                  title="Remove feature"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
            <button type="button" className="btn-add-feature" onClick={addFeature}>
              <Plus size={16} />
              <span>Add Feature</span>
            </button>
          </div>

          <div className="mt-4 text-end">
            <button type="submit" className="btn-save-package">
              <Save size={18} />
              <span>Save Package</span>
            </button>
          </div>
        </form>

        {/* Child Component - Inherits theme state */}
        <ViewPackages isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default FeePackageForm;