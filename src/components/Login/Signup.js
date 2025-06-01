import React, { useState, useEffect } from 'react';
import { auth, db } from '../Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [maxAdmins, setMaxAdmins] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminLimit = async () => {
      try {
        const docRef = doc(db, 'Settings', 'adminLimit');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setMaxAdmins(docSnap.data().maxAdmins);
        } else {
          setMaxAdmins(3);
        }
      } catch (error) {
        console.error('Error fetching admin limit:', error);
        setMessageType('danger');
        setMessage('Failed to load admin limit. Try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminLimit();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {

      const adminsQuery = query(collection(db, 'Admin'), where('role', '==', 'admin'));
      const adminsSnapshot = await getDocs(adminsQuery);
      const currentAdminCount = adminsSnapshot.size;

      if (currentAdminCount >= maxAdmins) {
        setMessageType('danger');
        setMessage(`Admin limit reached. Max allowed admins: ${maxAdmins}, Contact Previous Admin`);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'Admin', user.uid), {
        email: user.email,
        uid: user.uid,
        role: 'admin',
      });

      setMessageType('success');
      setMessage('Admin Registered Successfully!');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error(error);
      setMessageType('danger');
      if (error.code === 'auth/email-already-in-use') {
        setMessage('User already exists. Use another email');
      } else {
        setMessage('Failed to register admin. Please try again.');
      }
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light" style={{ padding: '15px' }} >
      <button className="rec position-absolute top-0 start-0 m-3" onClick={() => navigate('/start')} >
        <i class="fa-solid fa-arrow-left"></i> Back
      </button>

      <div className="border shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4 text-center">Admin Sign Up</h2>

        {loading ? (
          <p>Loading settings...</p>
        ) : (
          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">
                Email address
              </label>
              <input
                id="emailInput"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">
                Password
              </label>
              <input
                id="passwordInput"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {message && (
              <div className={`alert alert-${messageType} mt-3`} role="alert">
                {message}
              </div>
            )}

            <button type="submit" className="log w-100 mt-3 fw-semibold">
              Sign Up
            </button>
          </form>
        )}

        <p className="text-center mt-4 mb-0">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none fw-semibold text-primary">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
