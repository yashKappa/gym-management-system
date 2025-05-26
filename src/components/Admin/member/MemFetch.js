// src/components/Admin/member/mem-fetch.js
import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs } from 'firebase/firestore';

const MemFetch = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const membersCollection = collection(db, 'member');
      const snapshot = await getDocs(membersCollection);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members based on searchQuery
  const filteredMembers = members.filter(member =>
    Object.values(member).some(val =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">All Members</h3>
        <button className="refresh" onClick={fetchMembers} disabled={loading}>
          <i class="fa-solid fa-rotate"></i> {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name, contact, or trainer..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <p >
        Total Members: <strong>{filteredMembers.length}</strong>
      </p>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-success">
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Joining Date</th>
              <th>Trainer</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">No matching members found.</td>
              </tr>
            ) : (
              filteredMembers.map((member, idx) => (
                <tr key={idx}>
                  <td>{member.name}</td>
                  <td>{member.contact}</td>
                  <td>{new Date(member.joiningDateTime).toLocaleString()}</td>
                  <td>{member.trainer}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemFetch;
