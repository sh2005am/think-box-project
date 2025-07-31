import React, { useState } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './components/Header';
import apiUrl from '../apiConfig'; // Adjust path if needed

function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    try {
      // Remember to use your computer's IP
      const response = await fetch(`${apiUrl}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to sign up');
      }

      // On successful sign-up, redirect to the login page
      alert('Sign up successful! Please log in.');
      navigate('/login');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <Header value3={"already have an account"} value2={() => navigate('/login')} isHome={false} action={"Login"} />
      <div className="mainBody">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="enter">
        <div className='group'>
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
        <div className='group'>
          <label htmlFor="password">Enter Password</label>
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
        <button type="submit">Sign Up</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
  );
}

export default SignUpPage;
