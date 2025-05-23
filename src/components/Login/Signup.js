import React, { useState } from 'react';
import { db } from '../Firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const adminRef = doc(db, 'Admin', email);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        alert("Admin already exists with this email!");
        return;
      }

      await setDoc(adminRef, { email, password });

      alert("Admin Registered Successfully!");
      navigate('/login');
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Admin Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Enter Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Enter Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>

      <p className="text-center mt-3">
  Already have an account? <Link to="/login">Login here</Link>
</p>
    </div>
  );
}

export default SignUp;
