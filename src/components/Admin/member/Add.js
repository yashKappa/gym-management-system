import React, { useState } from 'react';
import './Members.css';
import { db } from '../../Firebase';
import { doc, setDoc } from 'firebase/firestore';

const Add = () => {
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    joiningDateTime: '',
    trainer: 'None',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const initials = formData.name
      .split(' ')
      .map(word => word[0].toUpperCase())
      .join('');

    const contactSuffix = formData.contact.slice(-4);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const accessCode = `${initials}${contactSuffix}${randomNum}`;

    console.log('New Member:', formData);
    console.log('Generated Access Code:', accessCode);

    try {
      await setDoc(doc(db, 'member', formData.name), {
        ...formData,
        accessCode,
        timestamp: new Date()
      });

      setSuccessMessage(`Member added successfully! Access Code: ${accessCode}`);
    } catch (error) {
      console.error('Error adding document: ', error);
      setSuccessMessage(`❌ Failed to add member: ${error.message}`);
    }

    setShowForm(false);
    setFormData({ name: '', contact: '', joiningDateTime: '', trainer: 'None' });

    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="members-container">
      <button className="add-btn" onClick={() => setShowForm(true)}>
        <i className="fa-solid fa-plus"></i> Add
      </button>

      {successMessage && (
        <div className='success'>
          <span>{successMessage}</span>
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
              <div className="form-buttons">
                <button type="submit" className="submit-btn">Submit</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Add;
