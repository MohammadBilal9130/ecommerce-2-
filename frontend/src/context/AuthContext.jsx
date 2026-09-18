import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('gangster_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
        localStorage.removeItem('gangster_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('gangster_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const adminLogin = async (email, password, adminAlias) => {
    const res = await api.post('/auth/admin/login', { email, password, adminAlias });
    if (res.data.success && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('gangster_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data.message || 'Admin login failed');
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('gangster_user', JSON.stringify(res.data.user));
      return res.data;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gangster_user');
  };

  const updateProfile = async (updateData) => {
    const res = await api.put('/auth/profile', updateData);
    if (res.data.success && res.data.user) {
      const merged = { ...user, ...res.data.user };
      setUser(merged);
      localStorage.setItem('gangster_user', JSON.stringify(merged));
      return res.data;
    }
    throw new Error(res.data.message || 'Update failed');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        adminAlias: user?.adminAlias || user?.name || null,
        login,
        adminLogin,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
