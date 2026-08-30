import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { Bell, Sparkles, CheckCircle2, Info, AlertTriangle, Trash2, ShieldAlert } from 'lucide-react';
import '../../User/NotificationFetch.css';

const badgeAccents = ['info', 'primary', 'success', 'warning'];

const NotiyFetch = ({ isDarkMode }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [message, setMessage] = useState('');

  const messageRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'Details', 'Notifications', 'details'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setNotifications(list);
        setLoading(false);
      },
      (error) => {
        console.error('❌ Error fetching notifications:', error);
        setMessage('Failed to load notifications.');
        setTimeout(() => setMessage(''), 3000);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'Details', 'Notifications', 'details', id));
      setMessage('Notification deleted successfully.');
      setTimeout(() => {
        if (messageRef.current) {
          messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      setMessage('Failed to delete notification.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setConfirmId(null);
    }
  };

  useEffect(() => {
    if (message && messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      messageRef.current.focus();
    }
  }, [message]);

  const getAccentIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={18} />;
      case 'success':
        return <CheckCircle2 size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className={`notifications-fetch-section ${isDarkMode ? 'dark' : 'light'}`}>
      {/* HEADER SECTION */}
      <div className="notifications-header">
        <div className="header-badge">
          <Bell size={14} /> ANNOUNCEMENTS & ALERTS
        </div>
        <h2 className="header-title">System Notifications</h2>
        <p className="header-subtitle">Stay updated with broadcast messages and gym alerts.</p>
      </div>

      {/* ALERT TOAST */}
     {message && (
             <div ref={messageRef} tabIndex={-1} className="theme-toast">
               <ShieldAlert size={16} />
               <span>{message}</span>
             </div>
           )}

      {/* CONTENT AREA */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Fetching latest notifications...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">
          <Sparkles size={38} className="empty-icon" />
          <h3>No Notifications Found</h3>
          <p>There are currently no broad alerts or messages posted.</p>
        </div>
      ) : (
        <div className="notifications-grid">
          {notifications.map((notif, idx) => {
            const accentClass = badgeAccents[idx % badgeAccents.length];
            return (
              <div key={notif.id} className={`notification-card accent-${accentClass}`}>
                  <div className="card-header-bar">
                  <div className="card-title-group">
                    <span className="accent-icon-bubble">
                      {getAccentIcon(accentClass)}
                    </span>
                    <h4 className="notif-title">{notif.title || 'Untitled Notice'}</h4>
                  </div>
                  <span className="notif-badge">{accentClass.toUpperCase()}</span>
                </div>
                <div className="card-content">
                <div className="card-body-content">
                  <p className="notif-message">{notif.msg || 'No message content provided.'}</p>
                </div>
                </div>
                  <div className="card-footer-meta d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                  <span>
                    {notif.createdAt?.toDate
                      ? new Date(notif.createdAt.toDate()).toLocaleDateString()
                      : notif.timestamp
                      ? new Date(notif.timestamp).toLocaleDateString()
                      : ''}
                  </span>
                  
                  {/* DELETE BUTTON (Matched with ViewPackages) */}
                  <button
                    className="delete-pkg-btn gap-2 d-flex align-items-center"
                    onClick={() => setConfirmId(notif.id)}
                    title="Delete Notification"
                  > 
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (Matched with ViewPackages) */}
      {confirmId && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h5 className="modal-title">Confirm Deletion</h5>
            <p className="modal-text">Are you sure you want to delete this notification? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setConfirmId(null)}>
                Cancel
              </button>
              <button className="btn-confirm-delete" onClick={() => handleDelete(confirmId)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotiyFetch;