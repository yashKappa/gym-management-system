import React, { useState, useRef, useEffect } from 'react';
import '../../style.css';
import { db } from '../../Firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const Add = () => {
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    joiningDateTime: '',
    trainer: 'None',
  });

  const successRef = useRef(null);
  const errorRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMessage('');
  setSuccessMessage('');

  // Step 1: Generate accessCode
  const initials = formData.name
    .split(' ')
    .map(word => word[0]?.toUpperCase())
    .join('');

  const contactSuffix = formData.contact.slice(-4);
  const randomNum = Math.floor(100 + Math.random() * 900);
  const accessCode = `${initials}${contactSuffix}${randomNum}`;

  const memberDocRef = doc(db, 'member', accessCode);
  const memberDocSnap = await getDoc(memberDocRef);

  // Step 2: Check for duplicate accessCode
  if (memberDocSnap.exists()) {
    setErrorMessage('⚠️ Access code already exists. Please try again.');
    return;
  }

  try {
    // Step 3: Store in 'member' collection using accessCode as ID
    await setDoc(memberDocRef, {
      ...formData,
      accessCode,
      timestamp: new Date()
    });

    setSuccessMessage(`✅ Member added successfully! Access Code: ${accessCode}`);
    setFormData({ name: '', contact: '', joiningDateTime: '', trainer: 'None' });
    setShowForm(false);

    setTimeout(() => setSuccessMessage(''), 5000);
  } catch (error) {
    console.error('Error adding document: ', error);
    setErrorMessage(`❌ Failed to add member: ${error.message}`);
  }
};


  useEffect(() => {
    if (successMessage && successRef.current) successRef.current.focus();
    if (errorMessage && errorRef.current) errorRef.current.focus();
  }, [successMessage, errorMessage]);

  return (
    <div className="members-container">
      <button className="add-btn" onClick={() => setShowForm(true)}>
        <i className="fa-solid fa-plus"></i> Add
      </button>

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

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Member</h3>
            <form onSubmit={handleSubmit} className="form-style">
              <input
                type="text"
                name="name"
                placeholder="Member Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="contact"
                placeholder="Contact Number"
                value={formData.contact}
                onChange={handleChange}
                required
              />
              <input
                type="datetime-local"
                name="joiningDateTime"
                value={formData.joiningDateTime}
                onChange={handleChange}
                required
              />
              <select name="trainer" value={formData.trainer} onChange={handleChange}>
                <option value="None">None</option>
                <option value="Personal Trainer">Personal Trainer</option>
              </select>
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
              <div className="form-buttons">
                <button type="button" className="dels w-100" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="gen w-100">Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Add;
