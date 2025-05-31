import React, { useState, useEffect } from 'react';
import { db } from '../Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function UserLogin() {
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Auto-login if cookies exist
  useEffect(() => {
    const savedName = Cookies.get('memberName');
    const savedAccessCode = Cookies.get('memberAccessCode');

    if (savedName && savedAccessCode) {
      navigate('/user/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const docRef = doc(db, 'member', name.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.name === name.trim() && data.accessCode === accessCode.trim()) {
          // Save persistent login in cookies (expires in 7 days)
          Cookies.set('memberName', data.name, { expires: 7 });
          Cookies.set('memberAccessCode', data.accessCode, { expires: 7 });
          navigate('/user/dashboard');
        } else {
          setError('Name or Access Code is incorrect.');
        }
      } else {
        setError('Member not found.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during login.');
    }
  };

 return (
  <div className="d-flex align-items-center justify-content-center vh-100 bg-light position-relative">

    {/* Back Button in Top-Left Corner */}
 <button className="rec position-absolute top-0 start-0 m-3" onClick={() => navigate('/start')} >
      <i class="fa-solid fa-arrow-left"></i> Back
    </button>
    
    <div className="p-4 shadow border" style={{ width: '100%', maxWidth: '400px' }}>
      <h3 className="text-center mb-4">Member Login</h3>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Access Code</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter access code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            required
          />
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <button className="log w-100 mt-3" type="submit">
          Login
        </button>
      </form>
    </div>
  </div>
);
}

export default UserLogin;
