import React from 'react';
import { auth } from '../Firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


function Admin() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);               // Firebase Auth logout
      localStorage.removeItem('adminEmail'); // Optional: clear local storage
      navigate('/login');               // Redirect to login
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed: " + error.message);
    }
  };


  return (
    <div className="container mt-5">
      <h1>Welcome, Admin</h1>
      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      {/* Your admin page content */}
    </div>
  );
}

export default Admin;
