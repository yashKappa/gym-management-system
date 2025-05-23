import React, { useState } from 'react';
import { db } from '../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const adminRef = doc(db, 'Admin', email);
      const adminSnap = await getDoc(adminRef);

      if (!adminSnap.exists()) {
        setErrorMsg('Admin not Exist or Email / Password wrong');
        return;
      }

      const adminData = adminSnap.data();

      if (adminData.password !== password) {
        setErrorMsg('Admin not Exist or Email / Password wrong');
        return;
      }

      if (adminData.password === password) {
  setErrorMsg('');
  localStorage.setItem('adminEmail', email);  // Save login info
  navigate('/admin');
}


      // Successful login
      setErrorMsg('');
      navigate('/admin');  // redirect to Admin page
    } catch (error) {
      setErrorMsg("Login failed: " + error.message);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Admin Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
      {errorMsg && <div className="alert alert-danger mt-3">{errorMsg}</div>}

      <p className="text-center mt-3">
  Don't have an account? <Link to="/signup">Sign up here</Link>
</p>
    </div>
  );
}

export default Login;
