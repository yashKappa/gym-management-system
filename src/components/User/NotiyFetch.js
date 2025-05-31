import React, { useEffect, useState, useRef } from 'react';
import { collection, getDocs} from 'firebase/firestore';
import { db } from '../Firebase';
import { BsBellFill } from 'react-icons/bs';

const alertClasses = ['alert-secondary', 'alert-primary', 'alert-success', 'alert-warning', 'alert-info'];

const NotificationFetch = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };


  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, 'Details', 'Notifications', 'details'));
      const notificationList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotifications(notificationList);
      showMessage('Notifications refreshed.');
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      showMessage('Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);


  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>🔔 Notifications</h3>
        <button className="rec" onClick={fetchNotifications} disabled={loading}>
          <i className="fa-solid fa-rotate"></i> {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {message && (
        <div ref={messageRef} className="alert alert-info">
          {message}
        </div>
      )}

      {notifications.length === 0 ? (
         <div className="text-center mt-4">
            <img
              src={`${process.env.PUBLIC_URL}/assets/back.png`}
              alt="No Receipts"
              style={{ width: '10%', marginBottom: '10px', marginTop:'20px' }}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationFetch;
