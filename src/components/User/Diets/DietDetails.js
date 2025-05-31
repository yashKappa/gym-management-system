import React, { useState, useRef, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import ViewDietPlans from './ViewDietPlans';

const DietPlanForm = () => {
  const [formData, setFormData] = useState({
    level: '',
    mealType: '',
    items: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const successRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    if (successMessage && successRef.current) {
      successRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    if (errorMessage && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center'  });
    }
  }, [successMessage, errorMessage]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const collectionRef = collection(db, 'Details', 'Diets', 'plans');
      await addDoc(collectionRef, formData);

      setSuccessMessage('Diet meal added successfully!');
      setFormData({ level: '', mealType: '', items: '' });
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error saving diet plan:', error);
      setErrorMessage(`Failed to save: ${error.message}`);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  return (
    <div className="container pt-4">
      <h3 className="text-center mb-4">🥗 Add Diet Plan Meal</h3>

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
          <label className="form-label">Plan Level</label>
          <select
            name="level"
            className="form-select"
            value={formData.level}
            onChange={handleChange}
            required
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="regular">Regular</option>
            <option value="professional">Professional</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Meal Type</label>
          <input
            type="text"
            name="mealType"
            className="form-control"
            value={formData.mealType}
            onChange={handleChange}
            placeholder="e.g., Breakfast, Snack, Dinner"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Meal Items</label>
          <textarea
            name="items"
            className="form-control"
            value={formData.items}
            onChange={handleChange}
            placeholder="e.g., Oats, 2 boiled eggs, 1 banana"
            required
          ></textarea>
        </div>

        <div className="text-end">
          <button type="submit" className="gen">Save Diet Meal</button>
        </div>
      </form>
      <ViewDietPlans />
    </div>
  );
};

export default DietPlanForm;
