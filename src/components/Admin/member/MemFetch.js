import React, { useEffect, useState, useRef } from 'react';
import { db } from '../../Firebase';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import Receipt from './Receipt';
import { User, Phone, Calendar, Key, FileText, Trash2, Sparkles, ShieldAlert } from 'lucide-react';

const MemFetch = ({ isDarkMode }) => {
  const [members, setMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'member'),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMembers(data);
      },
      (error) => {
        console.error('Error listening to real-time updates:', error);
        setMessage('Failed to get real-time data.');
        setTimeout(() => setMessage(''), 3000);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRef.current.focus();
    }
  }, [message]);

  const deleteMember = async (id) => {
    try {
      const receiptRef = collection(db, `member/${id}/Receipt`);
      const receiptSnapshot = await getDocs(receiptRef);

      const deleteReceiptDocs = receiptSnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, `member/${id}/Receipt`, docSnap.id))
      );

      await Promise.all(deleteReceiptDocs);
      await deleteDoc(doc(db, 'member', id));

      setMembers((prev) => prev.filter((m) => m.id !== id));
      setMessage('Member and all related data deleted successfully.');

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting member:', error);
      setMessage('Failed to delete member.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setConfirmId(null);
    }
  };

  const filtered = members.filter((member) =>
    Object.values(member).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div>
      {/* ALERT MESSAGE */}
      {message && (
        <div ref={messageRef} tabIndex={-1} className="alert-banner success mb-4">
          <ShieldAlert size={16} />
          <span>{message}</span>
        </div>
      )}

      {/* SEARCH BAR */}
      <div className="mb-4">
        <input
          type="text"
          className="custom-input-field"
          placeholder="🔍 Search members by name, contact, trainer, code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* MEMBERS LIST */}
      {filtered.length === 0 ? (
        <div className="empty-state text-center py-5">
          <Sparkles size={36} className="empty-icon mb-2" />
          <p className="text-muted">No members found matching your search.</p>
        </div>
      ) : (
        <div className="packages-grid pack">
          {filtered.map((m) => (
            <div className="pkg-card" key={m.id}>
              <div className="card-top">
                <span className="badge-tag">MEMBER</span>
                <h3 className="plan-name d-flex align-items-center gap-2">
                  <User size={18} /> {m.name}
                </h3>
              </div>

              <div className="card-middle d-flex flex-column gap-2 text-secondary">
                <div>
                  <Phone size={14} className="me-2" />
                  <strong>Contact:</strong> {m.contact}
                </div>
                <div>
                  <Calendar size={14} className="me-2" />
                  <strong>Joined:</strong> {new Date(m.joiningDateTime).toLocaleDateString()}
                </div>
                <div>
                  <strong>Trainer:</strong> {m.trainer}
                </div>
                <div className="duration-tag mt-2">
                  <Key size={13} />
                  <span>Access Code: {m.accessCode}</span>
                </div>
              </div>

              <div className="card-bottom flex gap-2 mt-4">
                <button
                  className="select-plan-btn btn-outline"
                  onClick={() => setSelectedMember(m)}
                >
                  <FileText size={15} />
                  <span>Receipt</span>
                </button>
                <button
                  className="delete-pkg-btn"
                  onClick={() => setConfirmId(m.id)}
                  title="Delete Member"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* RECEIPT FORM MODAL */}
      {selectedMember && (
        <Receipt member={selectedMember} onClose={() => setSelectedMember(null)} isDarkMode={isDarkMode} />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {confirmId && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h5 className="modal-title">Confirm Member Deletion</h5>
            <p className="modal-text">
              Are you sure you want to delete this member and all associated receipts?
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={() => deleteMember(confirmId)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemFetch;