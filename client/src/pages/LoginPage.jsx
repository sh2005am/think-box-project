import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import '../pages/login.css'
import apiUrl from '../apiConfig'; // Adjust path if needed

function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };
  function bSignUp () {
    navigate('/signup');
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/login`, { // Remember to use your computer's IP
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log in');
      }

      // Use the login function from AuthContext to save token and user state
      login(data);

      // Redirect to the home page on successful login
      navigate('/');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
     
    <div>
      
      <Header value3={"new to think box"} value2={bSignUp} isHome={false} action={"Sign Up"}/>
      <div className="mainBody">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="enter">
            <div className="group">
               <label htmlFor="username">Enter Username</label> 
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
  </div>
  <div className="group">
    <label htmlFor="username">Enter password</label> 
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          </div>
        </div>
        <button type="submit">Log In</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
  );
}

export default LoginPage;
