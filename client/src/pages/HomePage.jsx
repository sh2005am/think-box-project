import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import { useAuth } from '../context/AuthContext';
import Deletelogo from '../assets/icons8-delete.svg';
import apiUrl from '../apiConfig'; // Adjust path if needed
import '../App.css';

function HomePage() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  // This useEffect now handles redirection for logged-out users
  useEffect(() => {
    if (!token) {
      // If there's no token, redirect to the login page
      navigate('/login');
    } else {
      // If there is a token, fetch the user's messages
      fetchMessages();
    }
  }, [token, navigate]); // This effect runs whenever the token or navigate function changes

  // Function to fetch the logged-in user's messages
  async function fetchMessages() {
    if (!token) return; // Don't fetch if there's no token

    try {
      const response = await fetch(`${apiUrl}/api/messages`, {
        headers: {
          // Add the Authorization header to fetch messages
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  }

  // Handler for form submission to create a new message
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newMessage.trim() || !token) return;

    try {
      const response = await fetch(`${apiUrl}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the token for authentication
        },
        body: JSON.stringify({ name: newMessage }),
      });

      if (response.ok) {
        setNewMessage('');
        fetchMessages(); // Refresh the message list
      }
    } catch (error) {
      console.error("Failed to post message:", error);
    }
  };

  // Handler for deleting a message
  const handleDelete = async (id) => {
    if (!token) return;

    try {
      const response = await fetch(`${apiUrl}/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Send the token for authentication
        },
      });

      if (response.ok) {
        fetchMessages(); // Refresh the list after deleting
      }
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Return null or a loading message while the redirect is happening
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* <header className='up'>
        <h1>Think Box</h1>
        <nav>
          <span>Welcome, {user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </nav>
      </header> */}
      <Header value1={user.username} value2={handleLogout} isHome={true} action="logout"/>
        
      <form className="enter" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='Type your message...'
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Post Message</button>
      </form>

      <div className="container">
        {messages.map((message) => (
          <div className="card" key={message._id}>
            <div className="author">{message.author?.username || 'You'}</div>
            <div className="mes">{message.name}</div>
            {user && user.id === message.author?._id && (
              <img
                className="del"
                src={Deletelogo}
                alt="delete"
                onClick={() => handleDelete(message._id)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default HomePage;
