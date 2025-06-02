import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Receipt from './Receipt';

const alertClasses = [
  'alert-success',
  'alert-info',
  'alert-warning',
  'alert-primary',
  'alert-secondary',
  'alert-danger',
  'alert-dark',
  'alert-light',
  'alert-themed-blue',
  'alert-neutral',
  'alert-highlight',
  'alert-urgent',
  'alert-muted',
  'alert-glow'
];

const MemFetch = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);


  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const snapshot = await getDocs(collection(db, 'member'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(data);
      setMessage('Data refreshed.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to fetch members.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (id) => {
    try {
      // If you have subcollections, handle them here (optional)
      await deleteDoc(doc(db, 'member', id));
      setMembers(prev => prev.filter(m => m.id !== id));
      setMessage('Member deleted successfully.');
      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          messageRef.current.focus();
        }
      }, 100);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to delete member.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setConfirmId(null);
    }
  };

  // Filter members based on search query (case-insensitive)
  const filtered = members.filter(member =>
    Object.values(member).some(val =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🏋️‍♂️ Members</h3>
        <button className="rec" onClick={fetchMembers} disabled={loading}>
          <i className="fa-solid fa-rotate"></i> {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {message && (
        <div
          ref={messageRef}
          tabIndex={-1} // to make div focusable for scrollIntoView
          className="alert alert-info"
          style={{ outline: 'none' }}
        >
          {message}
        </div>
      )}

      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search members..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div className="text-center mt-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/back.png`}
            alt="No Members"
            style={{ width: '10%', marginBottom: '10px', marginTop: '20px' }}
          />
          <p>No members found.</p>
        </div>
      ) : (
        <div className="row g-4">
{filtered.map((m, idx) => (
  <div className="col-12 col-md-4" key={m.id}>
    <div className={`alert ${alertClasses[idx % alertClasses.length]} shadow-sm`}>
      <h5 className="alert-heading">
        <i className="fa-solid fa-user"></i> {m.name}
      </h5>
      <hr />
      <p><strong>Contact:</strong> {m.contact}</p>
      <p><strong>Joining Date:</strong> {new Date(m.joiningDateTime).toLocaleString()}</p>
      <p><strong>Trainer:</strong> {m.trainer}</p>
      <p><strong>Access Code:</strong> {m.accessCode}</p>
      <div className="d-flex justify-content-end">
        <button
          className="btn btn-primary btn-sm me-2"
          onClick={() => setSelectedMember(m)}
        >
          Receipt
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => setConfirmId(m.id)}
        >
          <i className="fa-solid fa-trash"></i> Delete
        </button>
      </div>
    </div>
  </div>
))}

 {selectedMember && (
        <Receipt member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}

        </div>
      )}


      {confirmId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
          <div className="bg-white p-4 m-4 rounded shadow" style={{ minWidth: '300px' }}>
            <h5 className="mb-3">Confirm Deletion</h5>
            <p>Are you sure you want to delete this member?</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => deleteMember(confirmId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemFetch;
