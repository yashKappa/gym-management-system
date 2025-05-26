// App.js
import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { auth } from './components/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';

import Login from './components/Login/Login';
import SignUp from './components/Login/Signup';
import Admin from './components/Admin/Admin';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        Cookies.set('session', user.uid, { expires: 7 });
        navigate('/admin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
