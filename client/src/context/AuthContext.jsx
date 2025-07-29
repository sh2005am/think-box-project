import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // This function runs only on the initial load
    const storedUser = localStorage.getItem('user');
    try {
      // If a user is stored, parse it from JSON, otherwise return null
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      // If parsing fails, return null
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  
  const login = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user)); // We stringify the user object to store it
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const authContextValue = {
    token,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};