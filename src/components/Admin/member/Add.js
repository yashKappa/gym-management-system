import React, { useState, useRef, useEffect } from 'react';
import { db } from '../../Firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Plus, X, CheckCircle2, AlertCircle } from 'lucide-react';

const Add = ({ isDarkMode }) => {
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const memberId = formData.name.trim();

    if (!memberId) {
      setErrorMessage('Please enter a valid member name.');
      return;
    }

    const initials = formData.name
      .split(' ')
      .map((word) => word[0]?.toUpperCase())
      .join('');

    const contactSuffix = formData.contact.slice(-4);
    const randomNum = Math.floor(100 + Math.random() * 900);
    const accessCode = `${initials}${contactSuffix}${randomNum}`;

    const memberDocRef = doc(db, 'member', memberId);
    const memberDocSnap = await getDoc(memberDocRef);

    if (memberDocSnap.exists()) {
      setErrorMessage(`Member "${memberId}" already exists.`);
      return;
    }

    try {
      await setDoc(memberDocRef, {
        ...formData,
        accessCode,
        timestamp: new Date(),
      });

      setSuccessMessage(`Member "${memberId}" added successfully! Access Code: ${accessCode}`);
      setFormData({ name: '', contact: '', joiningDateTime: '', trainer: 'None' });
      setShowForm(false);

      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error adding document: ', error);
      setErrorMessage(`Failed to add member: ${error.message}`);
    }
  };

  useEffect(() => {
    if (successMessage && successRef.current) successRef.current.focus();
    if (errorMessage && errorRef.current) errorRef.current.focus();
  }, [successMessage, errorMessage]);

  return (
    <div className="mb-4">
      <button className="btn-save-package" onClick={() => setShowForm(true)}>
        <Plus size={18} />
        <span>Add New Member</span>
      </button>

      {successMessage && (
        <div className="alert-banner success mt-3" role="alert" ref={successRef} tabIndex={-1}>
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="alert-banner danger mt-3" role="alert" ref={errorRef} tabIndex={-1}>
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '500px' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="modal-title">Add New Member</h5>
              <button className="btn-remove-feature" onClick={() => setShowForm(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
              <div>
                <label className="input-label-custom">Member Name</label>
                <div className="position-relative">
                  <input
                    type="text"
                    name="name"
                    className="custom-input-field"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="input-label-custom">Contact Number</label>
                <input
                  type="tel"
                  name="contact"
                  className="custom-input-field"
                  placeholder="e.g., 9876543210"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="input-label-custom">Joining Date & Time</label>
                <input
                  type="datetime-local"
                  name="joiningDateTime"
                  className="custom-input-field"
                  value={formData.joiningDateTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="input-label-custom">Trainer Option</label>
                <select
                  name="trainer"
                  className="custom-input-field"
                  value={formData.trainer}
                  onChange={handleChange}
                >
                  <option value="None">None</option>
                  <option value="Personal Trainer">Personal Trainer</option>
                </select>
              </div>

              {errorMessage && (
                <div className="alert-banner danger" role="alert" ref={errorRef} tabIndex={-1}>
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="modal-actions mt-2">
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-save-package">
                  Submit Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Add;