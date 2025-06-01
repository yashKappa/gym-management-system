import React, { useEffect, useState } from 'react';
import { auth } from '../Firebase';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      Cookies.set('session', user.uid, { expires: 7 });
      setErrorMsg('');
      navigate('/admin');
    } catch (error) {
      setErrorMsg("Invalid email or password. Try again");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light" style={{ padding: '15px' }} >
      <button className="rec position-absolute top-0 start-0 m-3" onClick={() => navigate('/start')} >
        <i class="fa-solid fa-arrow-left"></i> Back
      </button>
      <div className="border shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="mb-4 text-center">Admin Login</h2>
        <form onSubmit={handleLogin}>
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
              autoComplete="username"
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
              autoComplete="current-password"
            />
          </div>

          {errorMsg && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMsg}
            </div>
          )}

          <button type="submit" className="log w-100 mt-3 fw-semibold">
            Login
          </button>
        </form>
        <p className="text-center mt-4 mb-0">
          Don't have an account?{' '}
          <Link to="/signup" className="text-decoration-none fw-semibold text-primary">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
