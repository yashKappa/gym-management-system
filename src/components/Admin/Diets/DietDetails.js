import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Firebase';
import ViewDietPlans from './ViewDietPlans';
import { CheckCircle2, AlertCircle, Send, Sun, Moon, Flame, Clock, AlignLeft } from 'lucide-react';
import '../FeePackage/FeePackageForm.css';
import DietPlansChart from './DietPlansChart';

const DietPlanForm = () => {
  const [formData, setFormData] = useState({
    level: '',
    mealType: '',
    items: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const successRef = useRef(null);
  const errorRef = useRef(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setLoading(true);

    try {
      const collectionRef = collection(db, 'Details', 'Diets', 'plans');
      await addDoc(collectionRef, {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setSuccessMessage('Diet meal plan added successfully!');
      setFormData({ level: '', mealType: '', items: '' });
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error saving diet plan:', error);
      setErrorMessage(`Failed to save: ${error.message}`);
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setLoading(false);
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
        {/* Top Theme Toggle Bar */}
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

        {/* Header Title */}
        <h3 className="page-header-title">🥗 Gym Diet Plans</h3>

        {/* Alert Banners */}
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

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="form-glass-card">
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="input-label-custom d-flex align-items-center gap-2">
                <Flame size={15} /> Plan Level
              </label>
              <select
                name="level"
                className="custom-input-field"
                value={formData.level}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="" disabled style={{ color: 'var(--text-muted)' }}>
                  Select Level
                </option>
                <option value="beginner">Beginner</option>
                <option value="regular">Regular</option>
                <option value="professional">Professional</option>
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="input-label-custom d-flex align-items-center gap-2">
                <Clock size={15} /> Meal Type
              </label>
              <input
                type="text"
                name="mealType"
                className="custom-input-field"
                value={formData.mealType}
                onChange={handleChange}
                placeholder="e.g., Breakfast, Snack, Dinner"
                required
                disabled={loading}
              />
            </div>

            <div className="col-12">
              <label className="input-label-custom d-flex align-items-center gap-2">
                <AlignLeft size={15} /> Meal Items
              </label>
              <textarea
                name="items"
                rows="4"
                className="custom-input-field"
                value={formData.items}
                onChange={handleChange}
                placeholder="e.g., Oats, 2 boiled eggs, 1 banana..."
                style={{ textAlign: 'justify', textJustify: 'inter-word' }}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="mt-4 text-end">
            <button type="submit" className="btn-save-package" disabled={loading}>
              <Send size={18} />
              <span>{loading ? 'Saving...' : 'Save Diet Meal'}</span>
            </button>
          </div>
        </form>

        {/* Child Fetch Component */}
        <ViewDietPlans isDarkMode={isDarkMode} />
        <DietPlansChart isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default DietPlanForm;