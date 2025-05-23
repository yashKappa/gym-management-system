import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import SignUp from './components/Login/Signup';
import Admin from './components/Admin/Admin'; // Example protected page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<Admin />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
