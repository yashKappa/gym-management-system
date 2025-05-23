import React from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    navigate('/login');
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
