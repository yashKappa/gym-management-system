import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Receipt from './Receipt';


const MemFetch = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [message, setMessage] = useState('');
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
    } catch (error) {
      setMessage('Failed to fetch members.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const deleteMember = async (id) => {
  const subcollections = ['Receipt', 'Attendance']; // Add all subcollection names here

  try {
    // Step 1: Delete all documents in each subcollection
    for (const sub of subcollections) {
      const subColRef = collection(db, 'member', id, sub);
      const subSnap = await getDocs(subColRef);
      const deletePromises = subSnap.docs.map(docSnap =>
        deleteDoc(doc(db, 'member', id, sub, docSnap.id))
      );
      await Promise.all(deletePromises);
    }

    // Step 2: Delete the parent member document
    await deleteDoc(doc(db, 'member', id));

    // Step 3: Update local state
    setMembers(prev => prev.filter(m => m.id !== id));
    setMessage('Member and all associated data deleted successfully.');
  } catch (error) {
    setMessage('Failed to delete member and their data.');
    console.error('Deletion error:', error);
  } finally {
    setConfirmId(null);
    setTimeout(() => setMessage(''), 3000);
  }
};


  const filtered = members.filter(member =>
    Object.values(member).some(val =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>All Members</h4>
        <button className="rec" onClick={fetchMembers} disabled={loading}>
          <i class="fa-solid fa-rotate"></i> {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {message && <div className="alert alert-info">{message}</div>}

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />

      <p>Total: <strong>{filtered.length}</strong> members</p>

      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Joining Date</th>
              <th>Trainer</th>
              <th>Access Code</th>
              <th>Receipt</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan="7" className="text-center">
                <div className="text-center mt-4">
                  <img
                    src={`${process.env.PUBLIC_URL}/assets/back.png`}
                    alt="No Receipts"
                    style={{ width: '10%', marginBottom: '10px', marginTop: '20px' }}
                  />
                  <p style={{ margin: 0 }}>No members found</p>
                </div>
              </td></tr>
            ) : (
              filtered.map(m => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td>{m.contact}</td>
                  <td>{new Date(m.joiningDateTime).toLocaleString()}</td>
                  <td>{m.trainer}</td>
                  <td>{m.accessCode}</td>
                  <td>
                    <button className='rec' onClick={() => setSelectedMember(m)}>Receipt</button>
                  </td>                 
                  <td className='del'>
                    <button onClick={() => setConfirmId(m.id)}><i class="fa-solid fa-trash"></i></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {selectedMember && (
          <Receipt
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        )}
      </div>

      {/* Simple Delete Confirmation */}
      {confirmId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
          <div className="bg-white p-4 m-4 rounded shadow" style={{ minWidth: '300px' }}>
            <h5 className="mb-3">Confirm Deletion</h5>
            <p>Are you sure you want to delete this member?</p>
            <div className="confirm d-flex justify-content-end">
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
