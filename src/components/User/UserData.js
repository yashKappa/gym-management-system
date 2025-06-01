import React, { useEffect, useState, useRef } from 'react';
import Cookies from 'js-cookie';
import { db } from '../Firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

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
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const messageRef = useRef(null);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const name = Cookies.get('memberName');
            const accessCode = Cookies.get('memberAccessCode');

            if (!name || !accessCode) {
                setMessage('Missing authentication cookies.');
                return;
            }

            const userRef = doc(db, 'member', name);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                setMessage('User not found.');
                return;
            }

            const user = userSnap.data();

            if (user.accessCode !== accessCode) {
                setMessage('Access code mismatch.');
                return;
            }

            setUserData(user);

            const receiptSnapshot = await getDocs(collection(db, 'member', name, 'Receipt'));
            const receipts = receiptSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            setReceiptData(receipts);
            setMessage('User data refreshed.');
        } catch (error) {
            console.error('❌ Error fetching user data:', error);
            setMessage('Failed to fetch user data.');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>👥 User Details</h3>
                <button className="rec" onClick={fetchUserData} disabled={loading}>
                    <i className="fa-solid fa-rotate"></i> {loading ? 'Refreshing...' : 'Refresh'}
                </button>
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
                        style={{ width: '10%', marginBottom: '10px', marginTop: '20px' }}
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
                                <h5 className="alert-heading">
                                    <i className="fa-solid fa-receipt"></i> Receipt #{i + 1}
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
