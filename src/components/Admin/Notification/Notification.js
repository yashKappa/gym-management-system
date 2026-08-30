import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../Firebase';
import NotiyFetch from './NotiyFetch';
import { CheckCircle2, AlertCircle, Send, Sun, Moon } from 'lucide-react';
import '../FeePackage/FeePackageForm.css';

const Notification = () => {
  const [formData, setFormData] = useState({ title: '', msg: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const successRef = useRef(null);
  const errorRef = useRef(null);
  // Single Page-Level Theme State matching FeePackageForm
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
      const collectionRef = collection(db, 'Details', 'Notifications', 'details');
      await addDoc(collectionRef, {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setSuccessMessage('Notification sent successfully!');
      setFormData({ title: '', msg: '' });
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      setErrorMessage(`Failed to send notification: ${error.message}`);
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
        {/* Single Global Theme Toggle Bar */}
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
        <h3 className="page-header-title">🔔 Gym Announcements</h3>

        {/* Notifications Banners */}
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

        {/* Glass Card Form Body */}
        <form onSubmit={handleSubmit} className="form-glass-card">
          <div className="row g-3">
            <div className="col-12">
              <label className="input-label-custom">Title</label>
              <input
                type="text"
                name="title"
                className="custom-input-field"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Gym Holiday Notice"
                required
                disabled={loading}
              />
            </div>
            <div className="col-12">
              <label className="input-label-custom">Message</label>
              <textarea
                name="msg"
                rows="4"
                className="custom-input-field"
                value={formData.msg}
                onChange={handleChange}
                placeholder="e.g., The gym will remain closed tomorrow due to maintenance."
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="mt-4 text-end">
            <button type="submit" className="btn-save-package" disabled={loading}>
              <Send size={18} />
              <span>{loading ? 'Publishing...' : 'Send Notification'}</span>
            </button>
          </div>
        </form>

        {/* Child Fetch Component - Inherits Theme */}
        <NotiyFetch isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default Notification;