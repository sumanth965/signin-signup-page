import React, { useState } from 'react';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://su-manth09-signin-signup-page-backend.onrender.com/api/auth/register', formData);
      alert("Registration successful!");
    } catch (err) {
      console.error("Register Error:", err);
      alert(err.response?.data?.msg || "Registration failed");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        name: decoded.name,
        email: decoded.email,
      });
      localStorage.setItem('token', res.data.token);
      alert("Google login/register successful!");
    } catch (err) {
      console.error("Google OAuth error:", err);
      alert("Google login failed");
    }
  };

  return (
    <div className="body container-fluid min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow border-0 rounded-4 p-4" style={{ maxWidth: '450px', width: '100%' }}>
        <h2 className="text-center mb-4 text-success fw-bold">Create an Account</h2>

        <form onSubmit={handleSubmit} className="mb-3">
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
            <input
              type="text"
              name="name"
              onChange={handleChange}
              required
              placeholder="Ravi"
              className="form-control rounded-3"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="form-control rounded-3"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="form-control rounded-3"
            />
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-3 fw-semibold shadow-sm">
            Register
          </button>
        </form>

        <p className="text-center text-secondary mb-2">
          Already have an account?{' '}
          <a href="/login" className="text-decoration-none text-primary fw-semibold">Login</a>
        </p>

        <hr className="my-3" />
        <p className="text-center text-muted mb-3">OR</p>

        <div className="d-flex justify-content-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => console.log('Google Login Failed')}
            useOneTap
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
