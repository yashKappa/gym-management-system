import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { db } from '../Firebase';
import { doc, collection, onSnapshot } from 'firebase/firestore';

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

const UserData = () => {
  const [userData, setUserData] = useState(null);
  const [receiptData, setReceiptData] = useState([]);
  const [message, setMessage] = useState('');
  const messageRef = useRef(null);

  useEffect(() => {
  if (message && messageRef.current) {
    messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    messageRef.current.focus();
  }
}, [message]);


  useEffect(() => {
    const name = Cookies.get('memberName');
    const accessCode = Cookies.get('memberAccessCode');

    if (!name || !accessCode) {
      setMessage('Please log in to Akatsuki-Gym to access your data.');
      return;
    }


    // Listen for real-time updates to user document
    const userRef = doc(db, 'member', name);
    const unsubscribeUser = onSnapshot(userRef, (userSnap) => {
      if (!userSnap.exists()) {
        setMessage('User not found.');
        setUserData(null);
        return;
      }

      const user = userSnap.data();

      if (user.accessCode !== accessCode) {
        setMessage('Access code mismatch.');
        setUserData(null);
        return;
      }

      setUserData(user);
      setMessage('Data fetched.');
      setTimeout(() => setMessage(''), 3000);
    }, (error) => {
      console.error('Error fetching user data:', error);
      setMessage('Failed to fetch user data.');
    });

    // Listen for real-time updates to receipts subcollection
    const receiptRef = collection(db, 'member', name, 'Receipt');
    const unsubscribeReceipts = onSnapshot(receiptRef, (snapshot) => {
  const receipts = snapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());
  setReceiptData(receipts);
  setMessage('Data fetched.');
  if (messageRef.current) {
    messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  setTimeout(() => setMessage(''), 3000);
}, (error) => {
  console.error('Error fetching receipts:', error);
  setMessage('Failed to fetch receipt data.');
  if (messageRef.current) {
    messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});


    // Cleanup listeners on unmount
    return () => {
      unsubscribeUser();
      unsubscribeReceipts();
    };
  }, []);

  return (
    <div className="container py-5">
      <div className="mb-4">
        <h3>👥 User Details</h3>
      </div>

      {message && (
        <div
          ref={messageRef}
          tabIndex={-1}
          className="alert alert-info"
          style={{ outline: 'none' }}
        >
          {message}
        </div>
      )}

      {!userData ? (
        <div className="text-center mt-4">
          <img
            src={`${process.env.PUBLIC_URL}/assets/back.png`}
            alt="No Data"
            style={{ width: '100px', marginBottom: '10px', marginTop: '20px' }}
            className='data-img'
          />
          <p style={{ margin: 0 }}>No User Data Found.</p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-12">
            <div className={`alert ${alertClasses[0]} shadow-sm`}>
              <h5 className="alert-heading">
                <i className="fa-solid fa-user-check"></i> {userData.name}
              </h5>
              <hr />
              <p><strong>Access Code:</strong> {userData.accessCode}</p>
              <p><strong>Contact:</strong> {userData.contact}</p>
              <p><strong>Trainer:</strong> {userData.trainer}</p>
              <p><strong>Joining Date:</strong> {userData.joiningDateTime}</p>
            </div>
          </div>
          {receiptData.length > 0 ? receiptData.map((r, i) => (
            <div className="col-12 col-md-6" key={r.id}>
              <div className={`alert ${alertClasses[(i + 1) % alertClasses.length]} shadow-sm`}>
                <h5 className="title">
                  <p>{r.monthName}</p> <p>#{receiptData.length - i}</p>
                </h5>
                <hr />
                <p><strong>Amount Paid:</strong> ₹{r.amountPaid}</p>
                <p><strong>Months:</strong> {r.months}</p>
                <p><strong>Date:</strong> {r.date}</p>
                <p><strong>Trainer:</strong> {r.trainer}</p>
              </div>
            </div>
          )) : (
            <div className="text-center mt-4">
              <img
                src={`${process.env.PUBLIC_URL}/assets/back.png`}
                alt="No Receipts"
                style={{ width: '10%', marginBottom: '10px', marginTop: '20px' }}
              />
              <p style={{ margin: 0 }}>No Receipt Found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserData;
