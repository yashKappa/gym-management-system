import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { auth } from './components/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Cookies from 'js-cookie';

import SignUp from './components/Login/Signup';
import Admin from './components/Admin/Admin';
import Start from './components/User/Start';
import UserLogin from './components/User-Login/UserLogin';
import AdminLogin from './components/Login/Login';
import Dashboard from './components/User/Dashboard';
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
      <Route path="/" element={<Start />} />
      <Route path="/user-login" element={<UserLogin />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Start />} />

    </Routes>
  );
}

export default App;
