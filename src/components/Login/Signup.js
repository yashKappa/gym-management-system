import React, { useState } from 'react';
import { auth, db } from '../Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'danger'
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
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
      setMessageType('danger');
      setMessage('User already exists. Use another email');
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 bg-light"
      style={{ padding: '15px' }}
    >
      <div className="border shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4 text-center fw-bold text-primary">Admin Sign Up</h2>
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

          <button type="submit" className="btn btn-primary w-100 mt-3 fw-semibold">
            Sign Up
          </button>
        </form>
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
