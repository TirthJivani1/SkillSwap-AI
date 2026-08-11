import React, { createContext, useState, useEffect, useContext } from 'react';
import { login as loginApi, register as registerApi, getMe } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('skillswap_token');
      if (token) {
        try {
          const res = await getMe();
          if (res.success) {
            setUser(res.data);
          } else {
            logout();
          }
        } catch (err) {
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const loginUser = async (email, password) => {
    const res = await loginApi(email, password);
    if (res.success && res.data.token) {
      localStorage.setItem('skillswap_token', res.data.token);
      setUser(res.data);
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed' };
  };

  const registerUser = async (userData) => {
    const res = await registerApi(userData);
    if (res.success && res.data.token) {
      localStorage.setItem('skillswap_token', res.data.token);
      setUser(res.data);
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed' };
  };

  const logout = () => {
    localStorage.removeItem('skillswap_token');
    setUser(null);
  };

  const updateUserState = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginUser,
        registerUser,
        logout,
        updateUserState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
