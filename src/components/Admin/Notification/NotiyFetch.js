import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, deleteDoc, doc, query } from 'firebase/firestore';
import { db } from '../../Firebase';
import { BsBellFill } from 'react-icons/bs';

const alertClasses = ['alert-secondary', 'alert-primary', 'alert-success', 'alert-warning', 'alert-info'];

const NotificationFetch = () => {
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
        const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotifications(list);
        setLoading(false);
        setMessage('Live notifications updated.');
        setTimeout(() => setMessage(''), 3000);
      },
      (error) => {
        console.error('❌ Error fetching notifications:', error);
        setMessage('Failed to fetch notifications.');
        setTimeout(() => setMessage(''), 3000);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
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

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🔔 Notifications</h3>
      </div>

      {message && (
        <div ref={messageRef} className="alert alert-info">
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <div className="text-center mt-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/back.png`}
            alt="No Notifications"
            style={{ width: '10%', marginBottom: '10px', marginTop: '20px' }}
          />
          <p style={{ margin: 0 }}>No Notification found.</p>
        </div>
      ) : (
        <div className="row g-4">
          {notifications.map((notification, idx) => (
            <div className="col-12 col-md-6" key={notification.id}>
              <div className={`alert ${alertClasses[idx % alertClasses.length]} shadow-sm`}>
                <h5 className="alert-heading d-flex align-items-center gap-2">
                  <BsBellFill /> {notification.title || 'No Title'}
                </h5>
                <hr />
                <p>{notification.msg || 'No message content.'}</p>
                <div className="d-flex justify-content-end">
                  <button className="dels btn-outline-danger" onClick={() => setConfirmId(notification.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmId && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center">
          <div className="bg-white p-4 m-4 rounded shadow" style={{ minWidth: '300px' }}>
            <h5 className="mb-3">Confirm Deletion</h5>
            <p>Are you sure you want to delete this notification?</p>
            <div className="d-flex justify-content-end">
              <button className="btn btn-secondary me-2" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(confirmId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationFetch;
