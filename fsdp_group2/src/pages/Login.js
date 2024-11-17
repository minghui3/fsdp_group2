// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // Import Axios
import '../style/login.css'; // Import the CSS file
import logo from '../logo.png'; // Update the logo path if needed

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send a POST request to the backend login route
      const response = await axios.post('http://localhost:5000/login', {
        username,
        password,
      });

      // If login is successful, navigate to the dashboard
      if (response.status === 200) {
        navigate('/dashboard');
      }
    } catch (err) {
      // Handle error (invalid username/password)
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div>
        <img src={logo} alt="Logo" className="login-logo" /> {/* Logo Image */}
        </div>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;